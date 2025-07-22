import type { HttpContext } from '@adonisjs/core/http'

export default class GroupsController {
  public async index({ inertia, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    console.log(user)
    return inertia.render('groups', {
      groups: [],
      user,
    })
  }
  public async show({ inertia, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    console.log(user)
    return inertia.render('group-detail', {
      group: {},
      user,
    })
  }
}
