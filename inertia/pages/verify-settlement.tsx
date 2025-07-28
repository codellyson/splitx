import { Head, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Footer from '../components/footer'
import Header from '../components/header'
import User from '#models/user'
import Settlement from '#models/settlement'
import Group from '#models/group'

export default function VerifySettlement(props: {
  user: User
  settlement: Settlement
  group: Group
  fromUser: User
  toUser: User
  paymentOptions: any
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'processing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'processing':
        return (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )
      case 'failed':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        )
    }
  }

  const handleRefreshStatus = async () => {
    setIsLoading(true)
    try {
      await router.reload({ only: ['settlement'] })
      setRefreshCount((prev) => prev + 1)
    } catch (error) {
      console.error('Failed to refresh status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToGroup = () => {
    router.visit(`/groups/${props.group.id}`)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <>
      <Head title="Verify Settlement - SplitX" />

      <div className="min-h-screen bg-gray-50">
        <Header auth={props.user} />

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <h1 className="text-3xl font-bold text-gray-800">Verify Settlement</h1>
                <p className="text-gray-600 mt-1">Check your payment status</p>
              </div>
            </div>
          </div>

          {/* Settlement Details */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Settlement Details</h2>
              <button
                onClick={handleRefreshStatus}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(props.settlement.status)}
                  <div>
                    <p className="font-medium text-gray-800">Status</p>
                    <p className="text-sm text-gray-600">Payment verification</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(props.settlement.status)}`}
                >
                  {props.settlement.status.charAt(0).toUpperCase() +
                    props.settlement.status.slice(1)}
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Amount</p>
                  <p className="text-sm text-gray-600">Total settlement amount</p>
                </div>
                <span className="text-xl font-bold text-red-600">
                  {formatCurrency(props.settlement.amount)}
                </span>
              </div>

              {/* From/To */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium text-gray-800 mb-1">From</p>
                  <p className="text-sm text-gray-600">{props.fromUser.full_name}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-medium text-gray-800 mb-1">To</p>
                  <p className="text-sm text-gray-600">{props.toUser.full_name}</p>
                </div>
              </div>

              {/* Payment Type */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Payment Method</p>
                  <p className="text-sm text-gray-600">How the payment was made</p>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {props.settlement.payment_type === 'automatic'
                    ? 'Paystack Payment'
                    : 'Manual Bank Transfer'}
                </span>
              </div>

              {/* Reference */}
              {props.settlement.payment_reference && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Payment Reference</p>
                    <p className="text-sm text-gray-600">Transaction identifier</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-gray-700">
                      {props.settlement.payment_reference}
                    </span>
                    <button
                      onClick={() => copyToClipboard(props.settlement.payment_reference!)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Transaction ID */}
              {props.settlement.transaction_id && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Transaction ID</p>
                    <p className="text-sm text-gray-600">Payment processor reference</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-gray-700">
                      {props.settlement.transaction_id}
                    </span>
                    <button
                      onClick={() => copyToClipboard(props.settlement.transaction_id!)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Notes */}
              {props.settlement.payment_notes && (
                <div className="p-4 border rounded-lg">
                  <p className="font-medium text-gray-800 mb-2">Payment Notes</p>
                  <p className="text-sm text-gray-600">{props.settlement.payment_notes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium text-gray-800 mb-1">Created</p>
                  <p className="text-sm text-gray-600">
                    {new Date(props.settlement.created_at.toString()).toLocaleString()}
                  </p>
                </div>
                {props.settlement.paid_at && (
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">Paid At</p>
                    <p className="text-sm text-gray-600">
                      {new Date(props.settlement.paid_at.toString()).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleBackToGroup}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Back to Group
            </button>
            {props.settlement.status === 'pending' &&
              props.settlement.payment_type === 'automatic' &&
              props.settlement.payment_link && (
                <button
                  onClick={() => window.open(props.settlement.payment_link!, '_blank')}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Complete Payment
                </button>
              )}
          </div>

          {/* Status-specific messages */}
          {props.settlement.status === 'completed' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-green-800">Payment Completed!</p>
                  <p className="text-sm text-green-600">
                    Your settlement has been successfully processed and verified.
                  </p>
                </div>
              </div>
            </div>
          )}

          {props.settlement.status === 'processing' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-yellow-600 animate-spin"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-yellow-800">Payment Processing</p>
                  <p className="text-sm text-yellow-600">
                    Your payment is being processed. Please wait a few minutes and refresh the page.
                  </p>
                </div>
              </div>
            </div>
          )}

          {props.settlement.status === 'failed' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-red-800">Payment Failed</p>
                  <p className="text-sm text-red-600">
                    The payment could not be processed. Please try again or contact support.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  )
}
