/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const GroupsController = () => import('#controllers/groups_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const SessionController = () => import('#controllers/session_controller')

router.on('/').renderInertia('home')
router.on('/auth').renderInertia('auth')
router.post('/auth/signup', [SessionController, 'signup'])
router.post('/auth/login', [SessionController, 'store'])
router.post('/auth/logout', [SessionController, 'destroy'])
router.get('/profile', [SessionController, 'profile']).use(middleware.auth())

// Group routes
router.get('/groups', [GroupsController, 'index']).use(middleware.auth())
router.post('/groups/create', [GroupsController, 'create']).use(middleware.auth())
router.get('/groups/:id', [GroupsController, 'show']).use(middleware.auth())
// router.on('/groups/:id').renderInertia('group-detail')
// router.on('/groups/:id/expenses/create').renderInertia('create-expense')
// router.on('/groups/:id/settle').renderInertia('settle-balance')
// router.on('/groups/:id/request-payment').renderInertia('request-payment')
// router.on('/groups/:id/summary').renderInertia('expense-summary')
