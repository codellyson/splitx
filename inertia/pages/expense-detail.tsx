import { Head, router } from '@inertiajs/react'
import { useMemo } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import User from '#models/user'
import Expense from '#models/expense'
import Group from '#models/group'
import GroupMember from '#models/group_member'

export default function ExpenseDetail(props: {
  expense: Expense
  group: Group
  user: User
  group_members: GroupMember[]
  settlements: any[]
}) {
  const expense = useMemo(
    () => ({
      id: props.expense.id,
      title: props.expense.title,
      description: props.expense.description,
      amount: Number(props.expense.amount),
      paid_by: props.expense.paid_by,
      split_type: props.expense.split_type,
      created_at: props.expense.created_at,
      expense_splits: props.expense.expense_splits || [],
    }),
    [props.expense]
  )

  const group = useMemo(
    () => ({
      id: props.group.id,
      name: props.group.name,
      description: props.group.description,
      created_by: props.group.created_by,
    }),
    [props.group]
  )

  const members = useMemo(
    () =>
      props.group_members.map((member) => ({
        id: member.user_id,
        name: member.nickname,
        email: member.user?.email,
      })),
    [props.group_members]
  )

  const handleBackToGroup = () => {
    router.visit(`/groups/${group.id}`)
  }

  const handleRequestExpenseSplit = (
    splitId: number,
    amount: number,
    recipientName: string,
    recipientEmail: string
  ) => {
    router.visit(`/groups/${group.id}/request-payment/${splitId}`, {
      data: {
        splitId,
        amount,
        recipient: recipientName,
        recipientEmail: recipientEmail,
        expenseId: expense.id,
        expenseTitle: expense.title,
      },
    })
  }

  const handleSettleExpense = (splitId: number, amount: number, recipientName: string) => {
    router.visit(`/groups/${group.id}/settle/${splitId}`, {
      data: {
        splitId,
        amount,
        recipient: recipientName,
        expenseId: expense.id,
        expenseTitle: expense.title,
      },
    })
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      food: '🍽️',
      transport: '🚗',
      accommodation: '🏨',
      entertainment: '🎉',
      utilities: '⚡',
      rent: '🏠',
      general: '💰',
      other: '📝',
    }
    return icons[category as keyof typeof icons] || '💰'
  }

  // Helper function to determine payment status for a split
  const getSplitPaymentStatus = (split: any) => {
    const amountOwed = Number(split.amount_owed)

    // If this is the person who paid for the expense, they don't owe anything
    if (split.user_id === expense.paid_by) {
      return { status: 'paid', color: 'green', text: 'Paid', isPayer: true }
    }

    // If amount owed is 0, it's paid
    if (amountOwed === 0) {
      return { status: 'paid', color: 'green', text: 'Paid' }
    }

    // Check if there's a pending settlement for this split
    const pendingSettlement = props.settlements.find(
      (settlement) =>
        settlement.from_user === split.user_id &&
        settlement.to_user === expense.paid_by &&
        settlement.status === 'pending' &&
        settlement.amount === amountOwed
    )

    if (pendingSettlement) {
      return { status: 'pending', color: 'yellow', text: 'Pending' }
    }

    // Check if there's a completed settlement for this split
    const completedSettlement = props.settlements.find(
      (settlement) =>
        settlement.from_user === split.user_id &&
        settlement.to_user === expense.paid_by &&
        settlement.status === 'completed' &&
        settlement.amount === amountOwed
    )

    if (completedSettlement) {
      return { status: 'paid', color: 'green', text: 'Paid' }
    }

    // Default to unpaid
    return { status: 'unpaid', color: 'red', text: 'Unpaid' }
  }

  // Find who paid for this expense
  const paidByMember = members.find((member) => member.id === expense.paid_by)

  // Calculate total amount owed and payment statistics
  const totalOwed = expense.expense_splits.reduce(
    (acc, split) => acc + Number(split.amount_owed),
    0
  )

  const paymentStats = expense.expense_splits.reduce(
    (stats, split) => {
      const status = getSplitPaymentStatus(split)
      if (status.isPayer || status.status === 'paid') {
        stats.paid++
      } else if (status.status === 'pending') {
        stats.pending++
      } else {
        stats.unpaid++
      }
      return stats
    },
    { paid: 0, pending: 0, unpaid: 0 }
  )
  return (
    <>
      <Head title={`${expense.title} - ${group.name} - SplitX`} />

      <div className="min-h-screen bg-gray-50">
        <Header auth={props.user} />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={handleBackToGroup}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{expense.title}</h1>
                <p className="text-gray-600 mt-1">{group.name}</p>
              </div>
            </div>
          </div>

          {/* Expense Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                  {getCategoryIcon('general')}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{expense.title}</h2>
                  <p className="text-gray-600 mt-1">{expense.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Created on {new Date(expense.created_at.toString()).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-800">NGN {expense.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Total Amount</p>
              </div>
            </div>

            {/* Expense Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Paid By</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {paidByMember?.name.charAt(0) || '?'}
                    </span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {paidByMember?.name || 'Unknown'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Split Details</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">NGN {expense.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Owed:</span>
                    <span className="font-medium">NGN {totalOwed.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Splits:</span>
                    <span className="font-medium">{expense.expense_splits.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type of Split:</span>
                    <span className="font-medium">
                      {expense.split_type === 'percentage'
                        ? 'Percentage'
                        : expense.split_type === 'equal'
                          ? 'Equal'
                          : 'Custom'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Splits */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Expense Splits</h2>

            {expense.expense_splits.length > 0 ? (
              <div className="space-y-4">
                {expense.expense_splits.map((split) => {
                  const member = members.find((m) => m.id === split.user_id)
                  const isCurrentUser = split.user_id === props.user.id
                  const amountOwed = Number(split.amount_owed)
                  const paymentStatus = getSplitPaymentStatus(split)

                  return (
                    <div
                      key={split.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {member?.name.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{member?.name || 'Unknown'}</h3>
                          <p className="text-sm text-gray-500">
                            {paymentStatus.isPayer
                              ? `${isCurrentUser ? 'You' : member?.name} paid NGN ${expense.amount.toFixed(2)}`
                              : `${isCurrentUser ? 'You' : member?.name} owe${isCurrentUser ? '' : 's'} NGN ${amountOwed.toFixed(2)}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              paymentStatus.color === 'green'
                                ? 'text-green-600'
                                : paymentStatus.color === 'yellow'
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                            }`}
                          >
                            {paymentStatus.isPayer
                              ? `+ NGN ${expense.amount.toFixed(2)}`
                              : `${paymentStatus.status === 'paid' ? '+' : '-'} NGN ${amountOwed.toFixed(2)}`}
                          </p>
                          <p
                            className={`text-xs ${
                              paymentStatus.color === 'green'
                                ? 'text-green-500'
                                : paymentStatus.color === 'yellow'
                                  ? 'text-yellow-500'
                                  : 'text-gray-500'
                            }`}
                          >
                            {paymentStatus.isPayer ? 'Paid' : paymentStatus.text}
                          </p>
                        </div>

                        {!paymentStatus.isPayer &&
                          paymentStatus.status === 'unpaid' &&
                          isCurrentUser &&
                          amountOwed > 0 &&
                          expense.paid_by !== props.user.id && (
                            <button
                              onClick={() =>
                                handleSettleExpense(
                                  split.id,
                                  amountOwed,
                                  paidByMember?.name || 'Unknown'
                                )
                              }
                              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                            >
                              Settle
                            </button>
                          )}
                        {!paymentStatus.isPayer &&
                          paymentStatus.status === 'unpaid' &&
                          group.created_by === props.user.id && (
                            <button
                              onClick={() =>
                                handleRequestExpenseSplit(
                                  split.id,
                                  amountOwed,
                                  member?.name || 'Unknown',
                                  member?.email || 'Unknown'
                                )
                              }
                              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
                            >
                              Request Payment
                            </button>
                          )}
                        {!paymentStatus.isPayer && paymentStatus.status === 'pending' && (
                          <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-medium text-sm">
                            Payment Pending
                          </span>
                        )}
                        {paymentStatus.status === 'paid' && !paymentStatus.isPayer && (
                          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium text-sm">
                            ✓ Paid
                          </span>
                        )}
                        {paymentStatus.isPayer && (
                          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium text-sm">
                            ✓ Paid Full Amount
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No splits found for this expense.</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Summary</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">NGN {expense.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Expense</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{expense.expense_splits.length}</p>
                <p className="text-sm text-gray-600">People Involved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{paymentStats.paid}</p>
                <p className="text-sm text-green-600">Paid</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {paymentStats.unpaid + paymentStats.pending}
                </p>
                <p className="text-sm text-red-600">Pending</p>
              </div>
            </div>

            {/* Payment Progress */}
            {expense.expense_splits.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Payment Progress</span>
                  <span>
                    {paymentStats.paid}/{expense.expense_splits.length} completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(paymentStats.paid / expense.expense_splits.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
