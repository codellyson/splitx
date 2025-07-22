import Expense from '#models/expense'
import Group from '#models/group'
import GroupMember from '#models/group_member'
import type { HttpContext } from '@adonisjs/core/http'

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
}
