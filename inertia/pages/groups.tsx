import Group from '#models/group'
import { Head, router } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import Footer from '../components/footer'
import Header from '../components/header'

export default function Groups(props: { groups: Group[]; user: any }) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  console.log(props)
  const { groups: _groups, user } = props

  const groups = useMemo(() => {
    return _groups.map((group) => {
      const totalExpensesPaid =
        group.expenses?.reduce((acc, expense) => acc + parseFloat(expense.amount as any), 0) || 0
      return {
        ...group,
        members: group.group_members.length,
        totalExpenses: group.expenses.length,
        totalExpensesPaid: totalExpensesPaid,
        currency: 'NGN',
        createdAt: group.created_at,
      }
    })
  }, [_groups])

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
  })

  const handleViewDetails = (groupId: number) => {
    router.visit(`/groups/${groupId}`)
  }

  const handleAddExpense = (groupId: number) => {
    router.visit(`/groups/${groupId}/expenses/create`)
  }

  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.post(
      '/groups/create',
      {
        name: newGroup.name,
        description: newGroup.description,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setShowCreateModal(false)
          setNewGroup({
            name: '',
            description: '',
          })
        },
      }
    )
  }

  return (
    <>
      <Head title="Groups - SplitX" />

      <div className="min-h-screen bg-gray-50">
        <Header auth={user} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Groups</h1>
              <p className="text-gray-600 mt-2">Manage your shared expenses and groups</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
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
              <span>Create Group</span>
            </button>
          </div>

          {/* Groups Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{group.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {user.id === group.created_by ? 'Owner' : 'Member'}
                        {user.id === group.created_by && ` (${group.group_members.length} members)`}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{group.description}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Members:</span>
                    <span className="font-medium">{group.members}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Expenses:</span>
                    <span className="font-medium">{group.totalExpenses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Expenses Paid:</span>
                    <span className="font-medium">
                      {group.totalExpensesPaid} / {group.totalExpenses}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(group.id)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                  {user.id === group.created_by && (
                    <button
                      onClick={() => handleAddExpense(group.id)}
                      className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                    >
                      Add Expense
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {groups.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first group to start splitting expenses with friends and family.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Create Your First Group
              </button>
            </div>
          )}
        </div>

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create New Group</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form className="space-y-6" onSubmit={handleCreateGroup}>
                <div>
                  <label
                    htmlFor="groupName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Group Name
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    name="groupName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="e.g., Weekend Trip to Miami"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Brief description of the group"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  )
}
