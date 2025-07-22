// import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async store({ request, auth, response }: HttpContext) {
    /**
     * Step 1: Get credentials from the request body
     */
    const { email, password } = request.only(['email', 'password'])

    /**
     * Step 2: Verify credentials
     */
    const _user = await User.findBy('email', email)
    const user = await User.verifyCredentials(email, password)
    console.log({ _user, user })

    /**
     * Step 3: Login user
     */
    await auth.use('web').login(user)

    /**
     * Step 4: Send them to a protected route
     */
    response.redirect('/groups')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
  }

  async signup({ request, auth, response }: HttpContext) {
    const { email, password, fullName } = request.only(['email', 'password', 'fullName'])
    const user = await User.create({ email, password, full_name: fullName })
    console.log(user)
    await auth.use('web').login(user)
    response.redirect('/groups')
  }

  async profile({ inertia, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    console.log(user)
    return inertia.render('profile', { user })
  }
}
