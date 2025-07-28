import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import User from '#models/user'
import GroupMember from '#models/group_member'
import Group from '#models/group'

export default function CreateExpense({
  user,
  group,
  groupMembers,
}: {
  user: User
  group: Group
  groupMembers: GroupMember[]
}) {
  const [expenseData, setExpenseData] = useState({
    title: '',
    amount: '',
    description: '',
    paidBy: '',
    splitType: 'equal', // equal, percentage, custom
    category: 'general',
  })

  const [splits, setSplits] = useState<
    Array<{
      user_id: number
      amount?: number
      percentage?: number
    }>
  >([])

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transportation' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'rent', label: 'Rent' },
    { value: 'other', label: 'Other' },
  ]

  // Initialize splits when split type changes
  const initializeSplits = (splitType: string) => {
    if (splitType === 'equal') {
      setSplits([])
      return
    }

    const expenseAmount = parseFloat(expenseData.amount) || 0
    const memberCount = groupMembers.length

    const newSplits = groupMembers.map((member) => ({
      user_id: member.user_id,
      amount: splitType === 'custom' ? expenseAmount / memberCount : undefined,
      percentage: splitType === 'percentage' ? 100 / memberCount : undefined,
    }))
    setSplits(newSplits)
  }

  // Handle split type change
  const handleSplitTypeChange = (splitType: string) => {
    setExpenseData({ ...expenseData, splitType })
    initializeSplits(splitType)
  }

  // Handle split value changes
  const handleSplitChange = (index: number, field: 'amount' | 'percentage', value: number) => {
    const newSplits = [...splits]
    newSplits[index] = { ...newSplits[index], [field]: value }
    setSplits(newSplits)
  }

  // Calculate total for validation
  const calculateTotal = () => {
    if (expenseData.splitType === 'percentage') {
      return splits.reduce((sum, split) => sum + (split.percentage || 0), 0)
    }
    if (expenseData.splitType === 'custom') {
      return splits.reduce((sum, split) => sum + (split.amount || 0), 0)
    }
    return 0
  }

  // Validate splits
  const validateSplits = () => {
    if (expenseData.splitType === 'equal') return true

    const total = calculateTotal()
    const expenseAmount = parseFloat(expenseData.amount) || 0

    if (expenseData.splitType === 'percentage') {
      return Math.abs(total - 100) < 0.01 // Allow small rounding errors
    }

    if (expenseData.splitType === 'custom') {
      return Math.abs(total - expenseAmount) < 0.01 // Allow small rounding errors
    }

    return false
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSplits()) {
      alert('Please ensure the splits add up correctly.')
      return
    }

    const submitData = {
      ...expenseData,
      splits: expenseData.splitType !== 'equal' ? splits : undefined,
    }

    router.post(`/groups/${group.id}/expenses/create`, submitData)
  }

  const handleCancel = () => {
    router.visit(`/groups/${group.id}`)
  }

  return (
    <>
      <Head title="Add Expense - SplitX" />

      <div className="min-h-screen bg-gray-50">
        <Header auth={user} />

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={handleCancel}
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
                <h1 className="text-3xl font-bold text-gray-800">Add Expense</h1>
                <p className="text-gray-600 mt-1">Add a new expense to {group.name}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Expense Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={expenseData.title}
                  onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="e.g., Dinner at Italian Restaurant"
                />
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    step="0.01"
                    min="0"
                    value={expenseData.amount}
                    onChange={(e) => {
                      const newAmount = e.target.value
                      setExpenseData({ ...expenseData, amount: newAmount })

                      // Update custom splits if amount changes
                      if (expenseData.splitType === 'custom' && splits.length > 0) {
                        const expenseAmount = parseFloat(newAmount) || 0
                        const memberCount = groupMembers.length
                        const newSplits = splits.map((split) => ({
                          ...split,
                          amount: expenseAmount / memberCount,
                        }))
                        setSplits(newSplits)
                      }
                    }}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Description */}
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
                  value={expenseData.description}
                  onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="Add any additional details about this expense"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={expenseData.category}
                  onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Paid By */}
              <div>
                <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-2">
                  Paid By *
                </label>
                <select
                  id="paidBy"
                  name="paidBy"
                  required
                  value={expenseData.paidBy}
                  onChange={(e) => setExpenseData({ ...expenseData, paidBy: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  <option value="">Select who paid</option>
                  {groupMembers.map((member) => (
                    <option key={member.user_id} value={member.user_id}>
                      {member.nickname || member.user.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Split Type */}
              <div>
                <label htmlFor="splitType" className="block text-sm font-medium text-gray-700 mb-2">
                  Split Type
                </label>
                <select
                  id="splitType"
                  name="splitType"
                  value={expenseData.splitType}
                  onChange={(e) => handleSplitTypeChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  <option value="equal">Split equally</option>
                  <option value="percentage">Split by percentage</option>
                  <option value="custom">Custom split</option>
                </select>
              </div>

              {/* Split Type Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  {(() => {
                    switch (expenseData.splitType) {
                      case 'equal':
                        return 'The expense will be split equally among all group members.'
                      case 'percentage':
                        return 'You can set different percentages for each member. Total must equal 100%.'
                      case 'custom':
                        return 'You can set custom amounts for each member. Total must equal the expense amount.'
                      default:
                        return 'Select a split type to see description.'
                    }
                  })()}
                </p>
              </div>

              {/* Split Configuration */}
              {expenseData.splitType !== 'equal' && splits.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">Split Configuration</h3>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          const expenseAmount = parseFloat(expenseData.amount) || 0
                          const memberCount = groupMembers.length
                          const newSplits = groupMembers.map((member) => ({
                            user_id: member.user_id,
                            amount:
                              expenseData.splitType === 'custom'
                                ? expenseAmount / memberCount
                                : undefined,
                            percentage:
                              expenseData.splitType === 'percentage'
                                ? 100 / memberCount
                                : undefined,
                          }))
                          setSplits(newSplits)
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {expenseData.splitType === 'percentage' ? 'Equal %' : 'Equal Amount'}
                      </button>
                    </div>
                  </div>

                  {splits.map((split, index) => {
                    const member = groupMembers.find((m) => m.user_id === split.user_id)
                    const memberName = member?.nickname || member?.user.full_name || 'Unknown'

                    return (
                      <div
                        key={split.user_id}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {memberName}
                          </label>
                          {expenseData.splitType === 'percentage' ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={split.percentage || 0}
                                onChange={(e) =>
                                  handleSplitChange(
                                    index,
                                    'percentage',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                placeholder="0"
                              />
                              <span className="text-gray-500">%</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">$</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={split.amount || 0}
                                onChange={(e) =>
                                  handleSplitChange(
                                    index,
                                    'amount',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                placeholder="0.00"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Total Validation */}
                  <div
                    className={`p-3 rounded-lg ${
                      validateSplits()
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <p
                      className={`text-sm ${validateSplits() ? 'text-green-700' : 'text-red-700'}`}
                    >
                      {expenseData.splitType === 'percentage'
                        ? `Total: ${calculateTotal().toFixed(2)}% ${validateSplits() ? '(✓ Valid)' : '(✗ Must equal 100%)'}`
                        : expenseData.splitType === 'custom'
                          ? `Total: $${calculateTotal().toFixed(2)} ${validateSplits() ? '(✓ Valid)' : `(✗ Must equal $${parseFloat(expenseData.amount || '0').toFixed(2)})`}`
                          : ''}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!validateSplits()}
                  className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
