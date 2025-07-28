import { Head, router } from '@inertiajs/react'
import Header from '../components/header'
import Footer from '../components/footer'
import User from '#models/user'
import Settlement from '#models/settlement'
import Group from '#models/group'
import { DateTime } from 'luxon'

export default function SettlementDetail(props: {
  user: User
  settlement: Settlement
  group: Group
  fromUser: User
  toUser: User
}) {
  const handleBackToGroup = () => {
    router.visit(`/groups/${props.group.id}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'pending':
        return (
          <svg
            className="w-8 h-8 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case 'failed':
        return (
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )
      default:
        return (
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
    }
  }

  return (
    <>
      <Head title={`Settlement Details - SplitX`} />

      <div className="min-h-screen bg-gray-50">
        <Header auth={props.user} />

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
                <h1 className="text-3xl font-bold text-gray-800">Settlement Details</h1>
                <p className="text-gray-600 mt-1">{props.group.name}</p>
              </div>
            </div>
          </div>

          {/* Settlement Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
              <div className="flex items-center space-x-2">
                {getStatusIcon(props.settlement.status)}
                <span className={`font-medium ${getStatusColor(props.settlement.status)}`}>
                  {props.settlement.status.charAt(0).toUpperCase() +
                    props.settlement.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-xl text-gray-800">
                  {formatCurrency(props.settlement.amount)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-medium">{props.fromUser.full_name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">{props.toUser.full_name}</span>
              </div>

              {props.settlement.payment_reference && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-mono text-sm">{props.settlement.payment_reference}</span>
                </div>
              )}

              {props.settlement.transaction_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm">{props.settlement.transaction_id}</span>
                </div>
              )}

              {props.settlement.payment_notes && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Notes:</span>
                  <span className="text-sm">{props.settlement.payment_notes}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Payment Type:</span>
                <span className="text-sm font-medium">
                  {props.settlement.payment_type === 'automatic'
                    ? 'Paystack Payment'
                    : 'Manual Bank Transfer'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-sm">
                  {DateTime.fromISO(props.settlement.created_at.toString()).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </span>
              </div>

              {props.settlement.paid_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid:</span>
                  <span className="text-sm">
                    {DateTime.fromISO(props.settlement.paid_at.toString()).toLocaleString(
                      DateTime.DATETIME_MED
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleBackToGroup}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Back to Group
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
