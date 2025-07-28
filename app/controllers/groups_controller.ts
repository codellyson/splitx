import Expense from '#models/expense'
import Group from '#models/group'
import GroupMember from '#models/group_member'
import GroupInvitation from '#models/group_invitation'
import ExpenseSplit from '#models/expense_split'
import Settlement from '#models/settlement'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import vine from '@vinejs/vine'
import { randomBytes } from 'node:crypto'
import { DateTime } from 'luxon'
import EmailService from '#services/email_service'

export default class GroupsController {
  public async index({ inertia, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const groupMembers = await GroupMember.query().where('user_id', user.id)

    const groups = await Group.query()
      .where('created_by', user.id)
      .orWhereIn(
        'id',
        groupMembers.map((member) => member.group_id)
      )
      .preload('group_members')
      .preload('expenses')
      .preload('createdByUser')

    return inertia.render('groups', {
      groups,
      user,
    })
  }
  public async show({ inertia, auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const group = await Group.query()
      .where('id', params.id)

      .first()
    if (!group) {
      return response.redirect().toRoute('/groups')
    }
    const groupMembers = await GroupMember.query().where('group_id', params.id)
    const expenses = await Expense.query().where('group_id', params.id).preload('expense_splits')

    // Get settlements for this group
    const settlements = await Settlement.query()
      .where('group_id', params.id)
      .preload('fromUser')
      .preload('toUser')
      .orderBy('created_at', 'desc')

    return inertia.render('group-detail', {
      group,
      user,
      group_members: groupMembers,
      expenses,
      settlements,
    })
  }

  public async create({ inertia, auth, request, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const { name, description } = request.body()
    const group = await Group.create({
      name,
      description,
      created_by: user.id,
    })
    await group.related('group_members').create({
      user_id: user.id,
      nickname: user.full_name || user.email,
      group_id: group.id,
    })
    return response.redirect().toRoute('/groups')
  }

  public async showExpense({ inertia, auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const group = await Group.query().where('id', params.id).first()

    if (!group) {
      return response.redirect().toRoute('/groups')
    }

    const expense = await Expense.query()
      .where('id', params.expenseId)
      .where('group_id', params.id)
      .preload('expense_splits')
      .first()

    if (!expense) {
      return response.redirect().toRoute('groups.show', { id: params.id })
    }

    const groupMembers = await GroupMember.query().where('group_id', params.id).preload('user')

    // Get settlements related to this expense
    const settlements = await Settlement.query()
      .where('group_id', params.id)
      .preload('fromUser')
      .preload('toUser')
      .orderBy('created_at', 'desc')

    return inertia.render('expense-detail', {
      expense,
      group,
      user,
      group_members: groupMembers,
      settlements,
    })
  }

  public async settleBalance({ inertia, auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const expenseSplit = await ExpenseSplit.query().where('id', params.expenseSplitId).first()

    if (!expenseSplit) {
      return response.redirect().toRoute('/groups')
    }

    const expense = await Expense.query().where('id', expenseSplit.expense_id).first()
    if (!expense) {
      return response.redirect().toRoute('/groups')
    }

    const group = await Group.query().where('id', expense.group_id).first()
    if (!group) {
      return response.redirect().toRoute('/groups')
    }

    const groupMembers = await GroupMember.query().where('group_id', group.id)
    const members = await User.query().whereIn(
      'id',
      groupMembers.map((m) => m.user_id)
    )

    return inertia.render('settle-balance', {
      user,
      expenseSplit,
      expense,
      group,
      group_members: groupMembers,
      members,
    })
  }
  public async requestPayment({ inertia, auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const expenseSplit = await ExpenseSplit.query().where('id', params.expenseSplitId).first()

    if (!expenseSplit) {
      return response.redirect().toRoute('/groups')
    }

    const expense = await Expense.query().where('id', expenseSplit.expense_id).first()
    if (!expense) {
      return response.redirect().toRoute('/groups')
    }

    const group = await Group.query()
      .where('id', expense.group_id)
      .preload('group_members', (query) => {
        query.preload('user')
      })
      .first()
    if (!group) {
      return response.redirect().toRoute('/groups')
    }

    return inertia.render('request-payment', {
      user,
      expenseSplit,
      group,
      members: group.group_members,
    })
  }

  public async sendPaymentRequest({ auth, request, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const { data } = request.body()
    console.log(data, 'data', user)
    await EmailService.sendPaymentRequest(
      data.recipientEmail,
      data.recipientName,
      data.amount,
      data.groupName,
      data.paymentLink,
      data.message
    )
    return response.redirect().back()
  }

  public async createExpensePage({ inertia, auth, params, request, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const groupId = params.id
    const group = await Group.query().where('id', groupId).first()
    const groupMembers = await GroupMember.query().where('group_id', groupId)
    if (!group) {
      return response.redirect().toRoute('/groups')
    }
    return inertia.render('create-expense', {
      user,
      group,
      groupMembers,
    })
  }

  public async createExpense({ inertia, auth, params, request, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const validateExpense = vine.compile(
      vine.object({
        amount: vine.number(),
        title: vine.string(),
        paidBy: vine.number(),
        description: vine.string().optional(),
        splitType: vine.enum(['equal', 'percentage', 'custom']).optional(),
        category: vine.string().optional(),
        splits: vine
          .array(
            vine.object({
              user_id: vine.number(),
              amount: vine.number().optional(),
              percentage: vine.number().optional(),
            })
          )
          .optional(),
      })
    )
    const { amount, title, description, category, paidBy, splitType, splits } =
      await request.validateUsing(validateExpense)
    console.log(amount, title, paidBy, splitType)

    // Validate splits if provided
    if (splitType !== 'equal' && splits) {
      if (splitType === 'percentage') {
        const totalPercentage = splits.reduce((sum, split) => sum + (split.percentage || 0), 0)
        if (Math.abs(totalPercentage - 100) > 0.01) {
          return response.redirect().back()
        }
      } else if (splitType === 'custom') {
        const totalAmount = splits.reduce((sum, split) => sum + (split.amount || 0), 0)
        if (Math.abs(totalAmount - amount) > 0.01) {
          return response.redirect().back()
        }
      }
    }

    const groupId = params.id
    const expense = await Expense.create({
      title: title,
      description: description,
      amount: amount,
      group_id: groupId,
      paid_by: paidBy,
      split_type: splitType,
      category,
    })

    const groupMembers = await GroupMember.query().where('group_id', groupId)
    let expenseSplits = []
    let amountSplitted = amount / groupMembers.length

    switch (splitType) {
      case 'percentage':
        if (!splits) {
          return response.redirect().toRoute('/groups')
        }
        expenseSplits = await ExpenseSplit.createMany(
          splits.map((split: any) => ({
            expense_id: expense.id,
            user_id: split.user_id,
            amount_owed: (amount * (split.percentage || 0)) / 100,
          }))
        )
        break
      case 'custom':
        if (!splits) {
          return response.redirect().toRoute('/groups')
        }
        expenseSplits = await ExpenseSplit.createMany(
          splits.map((split: any) => ({
            expense_id: expense.id,
            user_id: split.user_id,
            amount_owed: split.amount || 0,
          }))
        )
        break
      case 'equal':
        expenseSplits = await ExpenseSplit.createMany(
          groupMembers.map((member) => ({
            expense_id: expense.id,
            user_id: member.user_id,
            amount_owed: amountSplitted,
          }))
        )
        break
      default:
        // defautl here is always equal

        console.log(amountSplitted, 'amountSplitted')
        expenseSplits = await ExpenseSplit.createMany(
          groupMembers.map((member) => ({
            expense_id: expense.id,
            user_id: member.user_id,
            amount_owed: amountSplitted,
          }))
        )
    }
    console.log(expenseSplits)
    return response.redirect().toRoute('/groups/:id/expenses/:expenseId', {
      id: params.id,
      expenseId: expense.id,
    })
  }

  public async summary({ inertia, auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const group = await Group.query().where('id', params.id).preload('group_members').first()

    if (!group) {
      return response.redirect().toRoute('/groups')
    }

    const expenses = await Expense.query()
      .where('group_id', params.id)
      .preload('expense_splits')
      .preload('paidByUser')
      .orderBy('created_at', 'desc')

    return inertia.render('expense-summary', {
      user,
      group,
      expenses,
    })
  }

  public async invitePage({ inertia, auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const group = await Group.query().where('id', params.id).first()

    if (!group) {
      return response.redirect().toRoute('/groups')
    }

    const pendingInvitations = await GroupInvitation.query()
      .where('group_id', params.id)
      .where('status', 'pending')

    return inertia.render('invite-members', {
      user,
      group,
      pendingInvitations,
    })
  }

  public async sendInvite({ auth, params, request, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const group = await Group.query().where('id', params.id).first()

    if (!group) {
      return response.redirect().toRoute('/groups')
    }

    const validateInvite = vine.compile(
      vine.object({
        email: vine.string().email(),
        nickname: vine.string().optional(),
      })
    )

    const { email, nickname } = await request.validateUsing(validateInvite)

    // Check if user is already a member
    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      const existingMember = await GroupMember.query()
        .where('group_id', params.id)
        .where('user_id', existingUser.id)
        .first()

      if (existingMember) {
        return response.redirect().back()
      }
    }

    // Check if invitation already exists
    const existingInvitation = await GroupInvitation.query()
      .where('group_id', params.id)
      .where('email', email)
      .where('status', 'pending')
      .first()

    if (existingInvitation) {
      return response.redirect().back()
    }

    // Generate unique token
    const token = randomBytes(32).toString('hex')
    const expiresAt = DateTime.now().plus({ days: 7 })

    await GroupInvitation.create({
      group_id: params.id,
      invited_by: user.id,
      email,
      nickname,
      token,
      status: 'pending',
      expires_at: expiresAt,
    })

    // Send email invitation here
    const invitation = await GroupInvitation.query()
      .where('group_id', params.id)
      .where('email', email)
      .where('status', 'pending')
      .preload('group')
      .preload('invitedByUser')
      .first()
    if (invitation) {
      await EmailService.sendGroupInvitation(invitation)
    }

    return response.redirect().back()
  }

  public async acceptInvite({ auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const invitation = await GroupInvitation.query()
      .where('token', params.token)
      .where('status', 'pending')
      .where('expires_at', '>', DateTime.now().toSQL())
      .preload('invitedByUser')
      .first()
    console.log(invitation)
    if (!invitation) {
      return response.redirect().toRoute('/groups')
    }

    const checkIfUserExists = await User.findBy('email', invitation.email)
    console.log(checkIfUserExists, 'checkIfUserExists')
    let newUser: User | null = null
    if (!checkIfUserExists) {
      //create an account for the user
      newUser = await User.create({
        email: invitation.email,
        password: randomBytes(16).toString('hex'),
        full_name: invitation.nickname,
      })
      // send the temporary password to the user
      await EmailService.sendTemporaryPassword(newUser, newUser.password)
    } else {
      newUser = checkIfUserExists
    }
    console.log(newUser, 'newUser')
    if (newUser) {
      // Check if user is already a member
      const existingMember = await GroupMember.query()
        .where('group_id', invitation.group_id)
        .where('user_id', newUser?.id)
        .first()
      console.log(existingMember)
      if (existingMember) {
        return response.redirect().toRoute('/groups')
      }

      // Add user to group
      await GroupMember.create({
        group_id: invitation.group_id,
        user_id: newUser?.id,
        nickname: invitation.nickname || newUser?.full_name || newUser?.email,
        joined_at: DateTime.now(),
      })
    }
    // Update invitation status
    invitation.status = 'accepted'
    await invitation.save()

    return response.redirect().toRoute('/groups/:id', { id: invitation.group_id })
  }

  public async showInvite({ inertia, auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const invitation = await GroupInvitation.query()
      .where('token', params.token)
      .where('status', 'pending')
      .where('expires_at', '>', DateTime.now().toSQL())
      .preload('invitedByUser')
      .preload('group')
      .first()

    if (!invitation) {
      return response.redirect().toRoute('/groups')
    }

    return inertia.render('invite-accept', {
      user,
      group: invitation.group,
      invitation,
    })
  }

  public async declineInvite({ auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const invitation = await GroupInvitation.query()
      .where('token', params.token)
      .where('status', 'pending')
      .first()

    if (!invitation) {
      return response.redirect().toRoute('/groups')
    }

    invitation.status = 'declined'
    await invitation.save()

    return response.redirect().toRoute('/groups')
  }

  /**
   * Generate PDF for expense summary
   */
  public async generatePDF({ auth, request, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const {
      groupName,
      period,
      totalExpenses,
      totalMembers,
      expenses,
      members,
      currency,
      generatedAt,
    } = request.body()

    try {
      // For now, we'll return a simple HTML response that can be printed
      // In a real implementation, you'd use a PDF library like Puppeteer or jsPDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${groupName} - Expense Summary</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .summary { margin-bottom: 30px; }
              .expenses { margin-bottom: 30px; }
              .members { margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f8f9fa; font-weight: bold; }
              .total { font-weight: bold; background-color: #e9ecef; }
              .positive { color: #28a745; }
              .negative { color: #dc3545; }
              .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${groupName} - Expense Summary</h1>
              <p><strong>Period:</strong> ${period}</p>
              <p><strong>Generated:</strong> ${generatedAt}</p>
            </div>

            <div class="summary">
              <h2>Summary</h2>
              <table>
                <tr>
                  <td><strong>Total Expenses:</strong></td>
                  <td>${new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(totalExpenses)}</td>
                </tr>
                <tr>
                  <td><strong>Total Members:</strong></td>
                  <td>${totalMembers}</td>
                </tr>
                <tr>
                  <td><strong>Average per Person:</strong></td>
                  <td>${new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(totalExpenses / totalMembers)}</td>
                </tr>
              </table>
            </div>

            <div class="expenses">
              <h2>Expenses Breakdown</h2>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Paid By</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${expenses
                    .map(
                      (expense: any) => `
                    <tr>
                      <td>${expense.title}</td>
                      <td>${new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(expense.amount)}</td>
                      <td>${expense.paidBy}</td>
                      <td>${expense.date}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>

            <div class="members">
              <h2>Members & Balances</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Total Paid</th>
                    <th>Total Owed</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  ${members
                    .map(
                      (member: any) => `
                    <tr>
                      <td>${member.name}</td>
                      <td>${new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(member.totalPaid)}</td>
                      <td>${new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(member.totalOwed)}</td>
                      <td class="${member.balance > 0 ? 'positive' : member.balance < 0 ? 'negative' : ''}">
                        ${member.balance > 0 ? '+' : ''}${new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(member.balance)}
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>

            <div class="footer">
              <p>Generated by SplitX - Expense Management Made Easy</p>
            </div>
          </body>
        </html>
      `

      response.header('Content-Type', 'text/html')
      response.header(
        'Content-Disposition',
        `attachment; filename="splitx-summary-${groupName.replace(/\s+/g, '-').toLowerCase()}.html"`
      )
      return response.send(htmlContent)
    } catch (error) {
      console.error('PDF generation error:', error)
      return response.status(500).json({ error: 'Failed to generate PDF' })
    }
  }
}

// initiate transfer with paystack with Transfer API
