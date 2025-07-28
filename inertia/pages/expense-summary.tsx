import { Head, router } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import Expense from '#models/expense'
import Group from '#models/group'
import User from '#models/user'
import { DateTime } from 'luxon'

export default function ExpenseSummary(props: { group: Group; user: User; expenses: Expense[] }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareMethod, setShareMethod] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)

  // Process the data from props
  const summary = useMemo(() => {
    const totalExpenses = props.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0)

    // Get all unique user IDs from expense splits
    const allUserIds = new Set<number>()
    props.expenses.forEach((expense) => {
      expense.expense_splits?.forEach((split) => {
        allUserIds.add(split.user_id)
      })
    })

    // Calculate member balances
    const membersWithBalances = props.group.group_members.map((member) => {
      // Calculate member statistics
      const memberExpenses = props.expenses.filter((expense) => expense.paid_by === member.user_id)
      const totalPaid = memberExpenses.reduce((acc, expense) => acc + Number(expense.amount), 0)

      const memberSplits = props.expenses.flatMap(
        (expense) =>
          expense.expense_splits?.filter((split) => split.user_id === member.user_id) || []
      )
      const totalOwed = memberSplits.reduce((acc, split) => acc + Number(split.amount_owed), 0)

      const balance = totalPaid - totalOwed

      return {
        ...member,
        totalPaid,
        totalOwed,
        balance,
        name: member.nickname || 'Unknown Member',
        avatar: member.nickname?.charAt(0)?.toUpperCase() || 'U',
      }
    })

    // Process expenses for display
    const processedExpenses = props.expenses.map((expense) => {
      const totalAmount = Number(expense.amount)
      const splitCount = expense.expense_splits?.length || 0
      const perPerson = splitCount > 0 ? totalAmount / splitCount : 0

      return {
        id: expense.id,
        title: expense.title,
        amount: totalAmount,
        paidBy: expense.paidByUser,
        category: expense.category,
        date: new Date(expense.created_at.toString()).toLocaleDateString(),
        description: expense.description,
        split: `Equal (${splitCount} people)`,
        perPerson,
      }
    })

    return {
      groupId: props.group.id,
      groupName: props.group.name,
      description: props.group.description,
      currency: 'NGN',
      createdAt: new Date(props.group.created_at.toString()).toLocaleDateString(),
      totalExpenses,
      totalMembers: props.group.group_members.length,
      period: `${new Date(props.group.created_at.toString()).toLocaleDateString()} - ${new Date().toLocaleDateString()}`,
      shareLink: `https://splitx.com/summary/${props.group.id}`,
      expenses: processedExpenses,
      members: membersWithBalances,
    }
  }, [props.group, props.expenses])

  const handleBackToGroup = () => {
    router.visit(`/groups/${summary.groupId}`)
  }

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      // Create a comprehensive HTML document for printing
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${summary.groupName} - Expense Summary</title>
            <style>
              @media print {
                body { margin: 0; padding: 20px; }
                .no-print { display: none; }
              }
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                line-height: 1.6;
                color: #333;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .header h1 {
                color: #2c3e50;
                margin-bottom: 10px;
              }
              .summary {
                margin-bottom: 30px;
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
              }
              .expenses { margin-bottom: 30px; }
              .members { margin-bottom: 30px; }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
              }
              th {
                background-color: #2c3e50;
                color: white;
                font-weight: bold;
              }
              tr:nth-child(even) { background-color: #f8f9fa; }
              .total {
                font-weight: bold;
                background-color: #e9ecef;
              }
              .positive { color: #28a745; font-weight: bold; }
              .negative { color: #dc3545; font-weight: bold; }
              .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #ddd;
                padding-top: 20px;
              }
              .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
              }
              .stat-card {
                background: white;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #ddd;
                text-align: center;
              }
              .stat-value {
                font-size: 24px;
                font-weight: bold;
                color: #2c3e50;
              }
              .stat-label {
                font-size: 14px;
                color: #666;
                margin-top: 5px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${summary.groupName} - Expense Summary</h1>
              <p><strong>Period:</strong> ${summary.period}</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <div class="summary">
              <h2>Summary</h2>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">${formatCurrency(summary.totalExpenses)}</div>
                  <div class="stat-label">Total Expenses</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${summary.totalMembers}</div>
                  <div class="stat-label">Total Members</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${formatCurrency(summary.totalExpenses / summary.totalMembers)}</div>
                  <div class="stat-label">Average per Person</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${summary.expenses.length}</div>
                  <div class="stat-label">Total Expenses</div>
                </div>
              </div>
            </div>

            <div class="expenses">
              <h2>Expenses Breakdown</h2>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Paid By</th>
                    <th>Date</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  ${summary.expenses
                    .map(
                      (expense) => `
                    <tr>
                      <td>${expense.title}</td>
                      <td>${formatCurrency(expense.amount)}</td>
                      <td>${expense.paidBy}</td>
                      <td>${expense.date}</td>
                      <td>${expense.category}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>

            <div class="members">
              <h2>Members & Balances</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Total Paid</th>
                    <th>Total Owed</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${summary.members
                    .map(
                      (member) => `
                    <tr>
                      <td>${member.name}</td>
                      <td>${formatCurrency(member.totalPaid)}</td>
                      <td>${formatCurrency(member.totalOwed)}</td>
                      <td class="${member.balance > 0 ? 'positive' : member.balance < 0 ? 'negative' : ''}">
                        ${member.balance > 0 ? '+' : ''}${formatCurrency(member.balance)}
                      </td>
                      <td>${member.balance > 0 ? 'In Credit' : member.balance < 0 ? 'Owes Money' : 'Settled'}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>

            <div class="footer">
              <p>Generated by SplitX - Expense Management Made Easy</p>
              <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
          </body>
        </html>
      `

      // Create a new window and print the content
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()

        // Wait for content to load then print
        printWindow.onload = () => {
          printWindow.print()
          printWindow.close()
        }

        // Show success notification
        const notification = document.createElement('div')
        notification.className =
          'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
        notification.textContent = 'PDF generation started! Check your print dialog.'
        document.body.appendChild(notification)
        setTimeout(() => document.body.removeChild(notification), 3000)
      } else {
        throw new Error('Popup blocked')
      }
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Failed to generate PDF. Please allow popups and try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleShare = (method: string) => {
    setShareMethod(method)
    setShowShareModal(true)
    setIsSharing(true)

    setTimeout(() => {
      setIsSharing(false)
      setShowShareModal(false)
      alert(`Shared via ${method}!`)
    }, 2000)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(summary.shareLink)
      alert('Link copied to clipboard!')
    } catch (error) {
      alert('Failed to copy link. Please copy manually.')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: summary.currency,
    }).format(amount)
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

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600'
    if (balance < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <>
      <Head title={`${summary.groupName} - Expense Summary - SplitX`} />

      <div className="min-h-screen bg-gray-50">
        <Header auth={props.user} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
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
                  <h1 className="text-3xl font-bold text-gray-800">Expense Summary</h1>
                  <p className="text-gray-600 mt-1">{summary.groupName}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isGeneratingPDF ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>Export PDF</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Summary Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatCurrency(summary.totalExpenses)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{summary.expenses.length} expenses</p>
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

            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Members</p>
                  <p className="text-2xl font-bold text-gray-800">{summary.totalMembers}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {summary.members.filter((m) => m.balance > 0).length} in credit
                  </p>
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

            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Period</p>
                  <p className="text-lg font-bold text-gray-800">{summary.period}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date().getDate() - new Date(summary.createdAt).getDate()} days
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average per Person</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatCurrency(summary.totalExpenses / summary.totalMembers)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {summary.totalMembers > 0 ? 'per member' : 'No members'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Expenses List */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Expenses Breakdown</h2>
                <span className="text-sm text-gray-500">{summary.expenses.length} expenses</span>
              </div>
              <div className="space-y-4">
                {summary.expenses.length > 0 ? (
                  summary.expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-xl">
                            {getCategoryIcon(expense.category)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{expense.title}</h3>
                            <p className="text-sm text-gray-600">{expense.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Paid by {expense.paidBy.full_name} • {expense.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-800">
                            {formatCurrency(expense.amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(expense.perPerson)} each
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Split: {expense.split}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded-full">
                          {expense.category}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p>No expenses recorded yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Members & Balances */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Group Members</h2>
                <span className="text-sm text-gray-500">{summary.members.length} members</span>
              </div>
              <div className="space-y-4">
                {summary.members.length > 0 ? (
                  summary.members.map((member) => {
                    // Use pre-calculated properties from useMemo
                    console.log(member)
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{member.avatar}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{member.name}</h3>
                            <p className="text-sm text-gray-600">
                              Member since:{' '}
                              {DateTime.fromISO(member.joined_at as any).toLocaleString(
                                DateTime.DATE_MED
                              )}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">
                                Paid: {formatCurrency(member.totalPaid)}
                              </span>
                              <span className="text-xs text-gray-500">
                                Owed: {formatCurrency(member.totalOwed)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${getBalanceColor(member.balance)}`}>
                            {member.balance > 0 ? '+' : ''}
                            {formatCurrency(member.balance)}
                          </p>
                          <p
                            className={`text-xs ${member.balance > 0 ? 'text-green-500' : member.balance < 0 ? 'text-red-500' : 'text-gray-500'}`}
                          >
                            {member.balance > 0
                              ? 'In Credit'
                              : member.balance < 0
                                ? 'Owes Money'
                                : 'Settled'}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-gray-300"
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
                    <p>No members in this group</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Share Link Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Share Summary</h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Public Link
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={summary.shareLink}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Anyone with this link can view the expense summary
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{summary.expenses.length}</p>
                  <p className="text-xs text-gray-600">Total Expenses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{summary.members.length}</p>
                  <p className="text-xs text-gray-600">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {summary.members.filter((m) => m.balance === 0).length}
                  </p>
                  <p className="text-xs text-gray-600">Settled</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Share Summary</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700"
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

              <div className="space-y-3">
                <button
                  onClick={() => handleShare('Email')}
                  disabled={isSharing}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium">Share via Email</span>
                </button>

                <button
                  onClick={() => handleShare('WhatsApp')}
                  disabled={isSharing}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  <span className="font-medium">Share via WhatsApp</span>
                </button>

                <button
                  onClick={() => handleShare('SMS')}
                  disabled={isSharing}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="font-medium">Share via SMS</span>
                </button>

                <button
                  onClick={() => handleShare('Copy Link')}
                  disabled={isSharing}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium">Copy Link</span>
                </button>
              </div>

              {isSharing && (
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center space-x-2 text-teal-600">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Sharing via {shareMethod}...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  )
}
