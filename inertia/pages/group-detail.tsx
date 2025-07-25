import Group from '#models/group'
import { Head, router } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import Footer from '../components/footer'
import Header from '../components/header'
import User from '#models/user'
import Expense from '#models/expense'

export default function GroupDetail(props: {
  group: Group
  user: User
  expenses: Expense[]
  group_members: any[]
}) {
  console.log(props)
  const [activeTab, setActiveTab] = useState('expenses') // expenses, members

  //   {
  //     "user": {
  //         "id": 4,
  //         "full_name": "Emily Wilson",
  //         "email": "emily@example.com",
  //         "created_at": "2025-07-22T13:38:40.925+00:00",
  //         "updated_at": "2025-07-22T13:38:40.925+00:00"
  //     },
  //     "group": {
  //         "id": 5,
  //         "name": "Road Trip to National Parks",
  //         "description": "Gas, food, and camping expenses for our summer road trip",
  //         "created_by": 4,
  //         "created_at": "2025-07-22T13:38:58.259+00:00",
  //         "updated_at": "2025-07-22T13:38:58.259+00:00"
  //     },
  //     "group_members": [
  //         {
  //             "id": 1,
  //             "user_id": 8,
  //             "group_id": 5,
  //             "nickname": "John",
  //             "joined_at": "2025-07-22T13:39:11.403+00:00",
  //             "created_at": "2025-07-22T13:39:11.404+00:00",
  //             "updated_at": "2025-07-22T13:39:11.404+00:00"
  //         },
  //         {
  //             "id": 2,
  //             "user_id": 7,
  //             "group_id": 5,
  //             "nickname": "Sarah",
  //             "joined_at": "2025-07-22T13:39:11.698+00:00",
  //             "created_at": "2025-07-22T13:39:11.698+00:00",
  //             "updated_at": "2025-07-22T13:39:11.698+00:00"
  //         },
  //         {
  //             "id": 3,
  //             "user_id": 6,
  //             "group_id": 5,
  //             "nickname": "Mike",
  //             "joined_at": "2025-07-22T13:39:11.977+00:00",
  //             "created_at": "2025-07-22T13:39:11.977+00:00",
  //             "updated_at": "2025-07-22T13:39:11.977+00:00"
  //         },
  //         {
  //             "id": 4,
  //             "user_id": 5,
  //             "group_id": 5,
  //             "nickname": "Emily",
  //             "joined_at": "2025-07-22T13:39:12.239+00:00",
  //             "created_at": "2025-07-22T13:39:12.239+00:00",
  //             "updated_at": "2025-07-22T13:39:12.239+00:00"
  //         },
  //         {
  //             "id": 5,
  //             "user_id": 4,
  //             "group_id": 5,
  //             "nickname": "David",
  //             "joined_at": "2025-07-22T13:39:12.526+00:00",
  //             "created_at": "2025-07-22T13:39:12.526+00:00",
  //             "updated_at": "2025-07-22T13:39:12.527+00:00"
  //         },
  //         {
  //             "id": 6,
  //             "user_id": 3,
  //             "group_id": 5,
  //             "nickname": "Lisa",
  //             "joined_at": "2025-07-22T13:39:12.805+00:00",
  //             "created_at": "2025-07-22T13:39:12.805+00:00",
  //             "updated_at": "2025-07-22T13:39:12.805+00:00"
  //         }
  //     ],
  //     "expenses": [
  //         {
  //             "id": 1,
  //             "group_id": 5,
  //             "title": "Hotel Booking - Bellagio",
  //             "description": "3 nights at Bellagio Hotel for the group",
  //             "amount": "1200.00",
  //             "paid_by": 8,
  //             "created_at": "2025-07-22T13:39:46.072+00:00",
  //             "updated_at": "2025-07-22T13:39:46.072+00:00",
  //             "expense_splits": [
  //                 {
  //                     "id": 69,
  //                     "expense_id": 1,
  //                     "user_id": 5,
  //                     "amount_owed": "36.25",
  //                     "created_at": "2025-07-22T13:40:22.704+00:00",
  //                     "updated_at": "2025-07-22T13:40:22.704+00:00"
  //                 },
  //                 {
  //                     "id": 70,
  //                     "expense_id": 1,
  //                     "user_id": 1,
  //                     "amount_owed": "36.25",
  //                     "created_at": "2025-07-22T13:40:22.988+00:00",
  //                     "updated_at": "2025-07-22T13:40:22.988+00:00"
  //                 },
  //                 {
  //                     "id": 71,
  //                     "expense_id": 1,
  //                     "user_id": 3,
  //                     "amount_owed": "36.25",
  //                     "created_at": "2025-07-22T13:40:23.256+00:00",
  //                     "updated_at": "2025-07-22T13:40:23.256+00:00"
  //                 },
  //                 {
  //                     "id": 72,
  //                     "expense_id": 1,
  //                     "user_id": 8,
  //                     "amount_owed": "36.25",
  //                     "created_at": "2025-07-22T13:40:23.546+00:00",
  //                     "updated_at": "2025-07-22T13:40:23.546+00:00"
  //                 }
  //             ]
  //         },
  //         {
  //             "id": 2,
  //             "group_id": 5,
  //             "title": "Dinner at Gordon Ramsay Steak",
  //             "description": "Group dinner at the famous steakhouse",
  //             "amount": "450.00",
  //             "paid_by": 7,
  //             "created_at": "2025-07-22T13:39:46.372+00:00",
  //             "updated_at": "2025-07-22T13:39:46.372+00:00",
  //             "expense_splits": [
  //                 {
  //                     "id": 65,
  //                     "expense_id": 2,
  //                     "user_id": 5,
  //                     "amount_owed": "45.00",
  //                     "created_at": "2025-07-22T13:40:21.434+00:00",
  //                     "updated_at": "2025-07-22T13:40:21.434+00:00"
  //                 },
  //                 {
  //                     "id": 66,
  //                     "expense_id": 2,
  //                     "user_id": 1,
  //                     "amount_owed": "45.00",
  //                     "created_at": "2025-07-22T13:40:21.718+00:00",
  //                     "updated_at": "2025-07-22T13:40:21.718+00:00"
  //                 },
  //                 {
  //                     "id": 67,
  //                     "expense_id": 2,
  //                     "user_id": 3,
  //                     "amount_owed": "45.00",
  //                     "created_at": "2025-07-22T13:40:21.977+00:00",
  //                     "updated_at": "2025-07-22T13:40:21.977+00:00"
  //                 },
  //                 {
  //                     "id": 68,
  //                     "expense_id": 2,
  //                     "user_id": 8,
  //                     "amount_owed": "45.00",
  //                     "created_at": "2025-07-22T13:40:22.398+00:00",
  //                     "updated_at": "2025-07-22T13:40:22.398+00:00"
  //                 }
  //             ]
  //         },
  //         {
  //             "id": 3,
  //             "group_id": 5,
  //             "title": "Show Tickets - Cirque du Soleil",
  //             "description": "Tickets for \"O\" show at Bellagio",
  //             "amount": "600.00",
  //             "paid_by": 6,
  //             "created_at": "2025-07-22T13:39:46.634+00:00",
  //             "updated_at": "2025-07-22T13:39:46.634+00:00",
  //             "expense_splits": [
  //                 {
  //                     "id": 61,
  //                     "expense_id": 3,
  //                     "user_id": 5,
  //                     "amount_owed": "80.00",
  //                     "created_at": "2025-07-22T13:40:20.347+00:00",
  //                     "updated_at": "2025-07-22T13:40:20.347+00:00"
  //                 },
  //                 {
  //                     "id": 62,
  //                     "expense_id": 3,
  //                     "user_id": 1,
  //                     "amount_owed": "80.00",
  //                     "created_at": "2025-07-22T13:40:20.618+00:00",
  //                     "updated_at": "2025-07-22T13:40:20.618+00:00"
  //                 },
  //                 {
  //                     "id": 63,
  //                     "expense_id": 3,
  //                     "user_id": 3,
  //                     "amount_owed": "80.00",
  //                     "created_at": "2025-07-22T13:40:20.896+00:00",
  //                     "updated_at": "2025-07-22T13:40:20.896+00:00"
  //                 },
  //                 {
  //                     "id": 64,
  //                     "expense_id": 3,
  //                     "user_id": 8,
  //                     "amount_owed": "80.00",
  //                     "created_at": "2025-07-22T13:40:21.155+00:00",
  //                     "updated_at": "2025-07-22T13:40:21.155+00:00"
  //                 }
  //             ]
  //         },
  //         {
  //             "id": 4,
  //             "group_id": 5,
  //             "title": "Uber Rides",
  //             "description": "Transportation around Vegas",
  //             "amount": "180.00",
  //             "paid_by": 5,
  //             "created_at": "2025-07-22T13:39:46.881+00:00",
  //             "updated_at": "2025-07-22T13:39:46.881+00:00",
  //             "expense_splits": [
  //                 {
  //                     "id": 56,
  //                     "expense_id": 4,
  //                     "user_id": 4,
  //                     "amount_owed": "17.00",
  //                     "created_at": "2025-07-22T13:40:18.916+00:00",
  //                     "updated_at": "2025-07-22T13:40:18.916+00:00"
  //                 },
  //                 {
  //                     "id": 57,
  //                     "expense_id": 4,
  //                     "user_id": 1,
  //                     "amount_owed": "17.00",
  //                     "created_at": "2025-07-22T13:40:19.191+00:00",
  //                     "updated_at": "2025-07-22T13:40:19.191+00:00"
  //                 },
  //                 {
  //                     "id": 58,
  //                     "expense_id": 4,
  //                     "user_id": 2,
  //                     "amount_owed": "17.00",
  //                     "created_at": "2025-07-22T13:40:19.505+00:00",
  //                     "updated_at": "2025-07-22T13:40:19.505+00:00"
  //                 },
  //                 {
  //                     "id": 59,
  //                     "expense_id": 4,
  //                     "user_id": 6,
  //                     "amount_owed": "17.00",
  //                     "created_at": "2025-07-22T13:40:19.771+00:00",
  //                     "updated_at": "2025-07-22T13:40:19.771+00:00"
  //                 },
  //                 {
  //                     "id": 60,
  //                     "expense_id": 4,
  //                     "user_id": 7,
  //                     "amount_owed": "17.00",
  //                     "created_at": "2025-07-22T13:40:20.062+00:00",
  //                     "updated_at": "2025-07-22T13:40:20.062+00:00"
  //                 }
  //             ]
  //         }
  //     ]
  // }
  // Mock data - replace with real data from backend
  const group = useMemo(
    () => ({
      id: props.group.id,
      name: props.group.name,
      description: props.group.description,
      currency: 'NGN',
      createdAt: props.group.created_at,
      totalExpenses: props.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0),
      members: props.group_members.map((member: any) => ({
        id: member.id,
        name: member.nickname,
        // email: member.user.email,
        // balance: member.amount_owed,
        // avatar: member.user.avatar || 'SC',
      })),
      expenses: props.expenses,
    }),
    [props.group, props.expenses, props.group_members]
  )

  const handleAddExpense = () => {
    router.visit(`/groups/${group.id}/expenses/create`)
  }

  const handleBackToGroups = () => {
    router.visit('/groups')
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

  return (
    <>
      <Head title={`${group.name} - SplitX`} />

      <div className="min-h-screen bg-gray-50">
        <Header auth={props.user} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={handleBackToGroups}
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
                <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
                <p className="text-gray-600 mt-1">{group.description}</p>
              </div>
            </div>

            {/* Group Stats */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Expenses</p>
                    <p
                      className={`text-2xl font-bold text-gray-800 ${
                        group.totalExpenses > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {group.totalExpenses > 0 ? '+ ' : ''} NGN{group.totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Members</p>
                    <p className="text-2xl font-bold text-gray-800">{group.members.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mb-6">
              <button
                onClick={() => router.visit(`/groups/${group.id}/summary`)}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>View Summary</span>
              </button>
              <button
                onClick={handleAddExpense}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Add Expense</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'expenses'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Expenses
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'members'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Members
                </button>
              </nav>
            </div>

            <div className="p-8">
              {/* Expenses Tab */}
              {activeTab === 'expenses' && (
                <div className="space-y-4">
                  {group.expenses.length > 0 ? (
                    group.expenses.map((expense: any) => {
                      // Find who paid for this expense
                      const paidByMember = group.members.find(
                        (member) => member.id === expense.paid_by
                      )

                      return (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                              {getCategoryIcon('general')}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">{expense.title}</h3>
                              <p className="text-sm text-gray-600">{expense.description}</p>
                              <p className="text-xs text-gray-500">
                                Paid by {paidByMember?.name || 'Unknown'} •{' '}
                                {new Date(expense.created_at.toString()).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-bold text-gray-800">
                                NGN {Number(expense.amount).toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {expense.expense_splits?.length || 0} splits
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                router.visit(`/groups/${group.id}/expenses/${expense.id}`)
                              }
                              className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors font-medium text-sm"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No expenses yet. Add your first expense!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Members Tab */}
              {activeTab === 'members' && (
                <div>
                  {/* Invite Button */}
                  <div className="mb-6">
                    <button
                      onClick={() => router.visit(`/groups/${group.id}/invite`)}
                      className="inline-flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span>Invite Members</span>
                    </button>
                  </div>

                  {/* Members Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{member.name}</h3>
                          {/* <p className="text-sm text-gray-600">{member.email}</p> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
