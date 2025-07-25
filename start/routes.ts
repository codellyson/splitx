/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const GroupsController = () => import('#controllers/groups_controller')
const PasswordResetController = () => import('#controllers/password_reset_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const SessionController = () => import('#controllers/session_controller')

router.on('/').renderInertia('home')
router.on('/auth').renderInertia('auth')
router.post('/auth/signup', [SessionController, 'signup'])
router.post('/auth/login', [SessionController, 'store'])
router.post('/auth/logout', [SessionController, 'destroy']).use(middleware.auth())
router.get('/profile', [SessionController, 'profile']).use(middleware.auth())

// Password reset routes
router.get('/forgot-password', [PasswordResetController, 'showForgotPassword'])
router.post('/forgot-password', [PasswordResetController, 'sendResetEmail'])
router.get('/reset-password/:token', [PasswordResetController, 'showResetPassword'])
router.post('/reset-password', [PasswordResetController, 'resetPassword'])

// Group routes
router.get('/groups', [GroupsController, 'index']).use(middleware.auth())
router.post('/groups/create', [GroupsController, 'create']).use(middleware.auth())
router.get('/groups/:id', [GroupsController, 'show']).use(middleware.auth())

// router.on('/groups/:id').renderInertia('group-detail')
router
  .get('/groups/:id/expenses/create', [GroupsController, 'createExpensePage'])
  .use(middleware.auth())
router
  .get('/groups/:id/expenses/:expenseId', [GroupsController, 'showExpense'])
  .use(middleware.auth())
router
  .post('/groups/:id/expenses/create', [GroupsController, 'createExpense'])
  .use(middleware.auth())

router
  .get('/groups/:id/settle/:expenseSplitId', [GroupsController, 'settleBalance'])
  .use(middleware.auth())

router
  .get('/groups/:id/request-payment/:expenseSplitId', [GroupsController, 'requestPayment'])
  .use(middleware.auth())
router
  .post('/groups/request-payment', [GroupsController, 'sendPaymentRequest'])
  .use(middleware.auth())
router.get('/groups/:id/summary', [GroupsController, 'summary'])

// Invite routes
router.get('/groups/:id/invite', [GroupsController, 'invitePage']).use(middleware.auth())
router.post('/groups/:id/invite', [GroupsController, 'sendInvite']).use(middleware.auth())
router.get('/invite/:token', [GroupsController, 'showInvite']).use(middleware.auth())
router.get('/invite/:token/accept', [GroupsController, 'acceptInvite']).use(middleware.auth())
router.get('/invite/:token/decline', [GroupsController, 'declineInvite']).use(middleware.auth())
