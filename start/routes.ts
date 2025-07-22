/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home')
router.on('/auth').renderInertia('auth')
router.on('/profile').renderInertia('profile')

// Group routes
router.on('/groups').renderInertia('groups')
router.on('/groups/:id').renderInertia('group-detail')
router.on('/groups/:id/expenses/create').renderInertia('create-expense')
router.on('/groups/:id/settle').renderInertia('settle-balance')
router.on('/groups/:id/request-payment').renderInertia('request-payment')
router.on('/groups/:id/summary').renderInertia('expense-summary')
