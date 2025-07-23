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
router.get('/auth/logout', [SessionController, 'destroy']).use(middleware.auth())
router.get('/profile', [SessionController, 'profile']).use(middleware.auth())

// Group routes
router.get('/groups', [GroupsController, 'index']).use(middleware.auth())
router.post('/groups/create', [GroupsController, 'create']).use(middleware.auth())
router.get('/groups/:id', [GroupsController, 'show']).use(middleware.auth())
router
  .get('/groups/:id/expenses/:expenseId', [GroupsController, 'showExpense'])
  .use(middleware.auth())
// router.on('/groups/:id').renderInertia('group-detail')
router.on('/groups/:id/expenses/create').renderInertia('create-expense')
router
  .get('/groups/:id/settle/:expenseSplitId', [GroupsController, 'settleBalance'])
  .use(middleware.auth())

router
  .get('/groups/:id/request-payment/:expenseSplitId', [GroupsController, 'requestPayment'])
  .use(middleware.auth())
router.get('/groups/:id/summary', [GroupsController, 'summary'])
