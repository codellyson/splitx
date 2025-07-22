import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

export default function CreateExpense() {
  const [expenseData, setExpenseData] = useState({
    title: '',
    amount: '',
    description: '',
    paidBy: '',
    splitType: 'equal', // equal, percentage, custom
    category: 'general'
  })

  // Mock group data - replace with real data from backend
  const group = {
    id: 1,
    name: 'Weekend Trip to Miami',
    members: [
      { id: 1, name: 'Sophia Carter', email: 'sophia@example.com' },
      { id: 2, name: 'John Doe', email: 'john@example.com' },
      { id: 3, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 4, name: 'Mike Johnson', email: 'mike@example.com' },
      { id: 5, name: 'Sarah Wilson', email: 'sarah@example.com' },
      { id: 6, name: 'Tom Brown', email: 'tom@example.com' }
    ]
  }

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transportation' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'rent', label: 'Rent' },
    { value: 'other', label: 'Other' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Expense data:', expenseData)
    // Navigate back to group detail page
    router.visit(`/groups/${group.id}`)
  }

  const handleCancel = () => {
    router.visit(`/groups/${group.id}`)
  }

  return (
    <>
      <Head title="Add Expense - SplitX" />

      <div className="min-h-screen bg-gray-50">
        <Header />

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    step="0.01"
                    min="0"
                    value={expenseData.amount}
                    onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
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
                  {group.members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
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
                  onChange={(e) => setExpenseData({ ...expenseData, splitType: e.target.value })}
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
                  {expenseData.splitType === 'equal' && 'The expense will be split equally among all group members.'}
                  {expenseData.splitType === 'percentage' && 'You can set different percentages for each member.'}
                  {expenseData.splitType === 'custom' && 'You can set custom amounts for each member.'}
                </p>
              </div>

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
                  className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium"
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
