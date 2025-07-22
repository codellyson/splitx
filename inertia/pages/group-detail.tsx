import Group from '#models/group'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import Footer from '../components/footer'
import Header from '../components/header'

export default function GroupDetail(props: { group: Group; user: any }) {
  console.log(props)
  const [activeTab, setActiveTab] = useState('expenses') // expenses, members, balances

  // Mock data - replace with real data from backend
  const group = {
    id: props.group.id,
    name: props.group.name,
    description: props.group.description,
    currency: 'USD',
    createdAt: props.group.created_at,
    totalExpenses: props.expenses.reduce((acc, expense) => acc + expense.amount, 0),
    members: props.group_members.map((member) => ({
      id: member.id,
      name: member.nickname,
      // email: member.user.email,
      // balance: member.amount_owed,
      // avatar: member.user.avatar || 'SC',
    })),
    expenses: [
      {
        id: 1,
        title: 'Hotel Booking',
        amount: 450.0,
        paidBy: 'Sophia Carter',
        category: 'accommodation',
        date: '2024-01-20',
        description: '3 nights at Miami Beach Hotel',
      },
      {
        id: 2,
        title: 'Dinner at Italian Restaurant',
        amount: 180.5,
        paidBy: 'John Doe',
        category: 'food',
        date: '2024-01-21',
        description: 'Group dinner on first night',
      },
      {
        id: 3,
        title: 'Car Rental',
        amount: 320.0,
        paidBy: 'Jane Smith',
        category: 'transport',
        date: '2024-01-22',
        description: 'SUV rental for the weekend',
      },
      {
        id: 4,
        title: 'Beach Activities',
        amount: 150.0,
        paidBy: 'Sarah Wilson',
        category: 'entertainment',
        date: '2024-01-23',
        description: 'Jet ski and parasailing',
      },
      {
        id: 5,
        title: 'Groceries',
        amount: 150.0,
        paidBy: 'Tom Brown',
        category: 'food',
        date: '2024-01-24',
        description: 'Food and drinks for the trip',
      },
    ],
  }

  const handleAddExpense = () => {
    router.visit(`/groups/${group.id}/expenses/create`)
  }

  const handleBackToGroups = () => {
    router.visit('/groups')
  }

  const handleSettleBalance = (memberId: number, amount: number) => {
    router.visit(`/groups/${group.id}/settle`, {
      data: {
        memberId,
        amount: Math.abs(amount),
        recipient: group.members.find((m) => m.id === memberId)?.name,
      },
    })
  }

  const handleRequestPayment = (memberId: number, amount: number) => {
    router.visit(`/groups/${group.id}/request-payment`, {
      data: {
        memberId,
        amount: Math.abs(amount),
        recipient: group.members.find((m) => m.id === memberId)?.name,
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
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-800">
                      ${group.totalExpenses.toFixed(2)}
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

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Your Balance</p>
                    <p
                      className={`text-2xl font-bold ${group.members?.[0]?.balance > 0 ? 'text-green-600' : group.members?.[0]?.balance < 0 ? 'text-red-600' : 'text-gray-800'}`}
                    >
                      {group.members?.[0]?.balance > 0 ? '+' : ''}$
                      {group.members?.[0]?.balance?.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
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
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
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
                <button
                  onClick={() => setActiveTab('balances')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'balances'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Balances
                </button>
              </nav>
            </div>

            <div className="p-8">
              {/* Expenses Tab */}
              {activeTab === 'expenses' && (
                <div className="space-y-4">
                  {group.expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{expense.title}</h3>
                          <p className="text-sm text-gray-600">{expense.description}</p>
                          <p className="text-xs text-gray-500">
                            Paid by {expense.paidBy} • {expense.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">${expense.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Members Tab */}
              {activeTab === 'members' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{member.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Balances Tab */}
              {activeTab === 'balances' && (
                <div className="space-y-4">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{member.avatar}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{member.name}</h3>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p
                            className={`font-bold ${member.balance > 0 ? 'text-green-600' : member.balance < 0 ? 'text-red-600' : 'text-gray-600'}`}
                          >
                            {member.balance > 0 ? '+' : ''}${member?.balance?.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.balance > 0
                              ? 'Owes you'
                              : member.balance < 0
                                ? 'You owe'
                                : 'Settled up'}
                          </p>
                        </div>
                        {member.balance !== 0 && (
                          <button
                            onClick={() =>
                              member.balance > 0
                                ? handleRequestPayment(member.id, member.balance)
                                : handleSettleBalance(member.id, member.balance)
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              member.balance > 0
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {member.balance > 0 ? 'Request' : 'Settle'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
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
