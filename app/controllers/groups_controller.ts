import Expense from '#models/expense'
import Group from '#models/group'
import GroupMember from '#models/group_member'
import ExpenseSplit from '#models/expense_split'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class GroupsController {
  public async index({ inertia, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const groups = await Group.query().where('created_by', user.id).preload('group_members')
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
      return response.redirect().toRoute('groups.index')
    }
    const groupMembers = await GroupMember.query().where('group_id', params.id)
    const expenses = await Expense.query().where('group_id', params.id).preload('expense_splits')
    return inertia.render('group-detail', {
      group,
      user,
      group_members: groupMembers,
      expenses,
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
    return response.redirect().toRoute('groups.index')
  }

  public async showExpense({ inertia, auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const group = await Group.query().where('id', params.id).first()

    if (!group) {
      return response.redirect().toRoute('groups.index')
    }

    const expense = await Expense.query()
      .where('id', params.expenseId)
      .where('group_id', params.id)
      .preload('expense_splits')
      .first()

    if (!expense) {
      return response.redirect().toRoute('groups.show', { id: params.id })
    }

    const groupMembers = await GroupMember.query().where('group_id', params.id)

    return inertia.render('expense-detail', {
      expense,
      group,
      user,
      group_members: groupMembers,
    })
  }

  public async settleBalance({ inertia, auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const expenseSplit = await ExpenseSplit.query().where('id', params.expenseSplitId).first()

    if (!expenseSplit) {
      return response.redirect().toRoute('groups.index')
    }

    const expense = await Expense.query().where('id', expenseSplit.expense_id).first()
    if (!expense) {
      return response.redirect().toRoute('groups.index')
    }

    const group = await Group.query().where('id', expense.group_id).first()
    if (!group) {
      return response.redirect().toRoute('groups.index')
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
      return response.redirect().toRoute('groups.index')
    }

    const expense = await Expense.query().where('id', expenseSplit.expense_id).first()
    if (!expense) {
      return response.redirect().toRoute('groups.index')
    }

    const group = await Group.query().where('id', expense.group_id).preload('group_members').first()
    if (!group) {
      return response.redirect().toRoute('groups.index')
    }

    return inertia.render('request-payment', {
      user,
      expenseSplit,
      group,
      members: group.group_members,
    })
  }

  public async createExpense({ inertia, auth, params, request, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const { amount, recipient, expenseId, expenseTitle } = request.body()
    const expense = await Expense.create({
      title: expenseTitle,
      description: expenseTitle,
      amount: amount,
      group_id: params.id,
      paid_by: user.id,
    })
    const expenseSplit = await ExpenseSplit.create({
      expense_id: expense.id,
      user_id: recipient,
      amount_owed: amount,
    })
    return response.redirect().toRoute('groups.showExpense', {
      id: params.id,
      expenseId: expense.id,
    })
  }

  public async summary({ inertia, auth, params, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const group = await Group.query().where('id', params.id).first()

    if (!group) {
      return response.redirect().toRoute('groups.index')
    }

    const expenses = await Expense.query().where('group_id', params.id).preload('expense_splits')

    return inertia.render('expense-summary', {
      user,
      group,
      expenses,
    })
  }
}
