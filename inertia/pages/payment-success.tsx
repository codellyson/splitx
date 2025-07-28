import { Head, router } from '@inertiajs/react'
import { useEffect } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import User from '#models/user'
import Settlement from '#models/settlement'
import Group from '#models/group'

export default function PaymentSuccess(props: {
  user: User
  settlement: Settlement
  group: Group
  status: 'success' | 'pending' | 'failed'
  message: string
}) {
  useEffect(() => {
    // Auto-redirect to group after 5 seconds
    const timer = setTimeout(() => {
      router.visit(`/groups/${props.group.id}`)
    }, 5000)

    return () => clearTimeout(timer)
  }, [props.group.id])

  const handleBackToGroup = () => {
    router.visit(`/groups/${props.group.id}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  }

  const getStatusIcon = () => {
    switch (props.status) {
      case 'success':
        return (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )
      case 'pending':
        return (
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-yellow-600"
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
          </div>
        )
      case 'failed':
        return (
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
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
          </div>
        )
    }
  }

  const getStatusColor = () => {
    switch (props.status) {
      case 'success':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'failed':
        return 'text-red-600'
    }
  }

  return (
    <>
      <Head title="Payment Status - SplitX" />

      <div className="min-h-screen bg-gray-50">
        <Header auth={props.user} />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            {getStatusIcon()}

            <h1 className={`text-2xl font-bold mt-6 ${getStatusColor()}`}>
              {props.status === 'success' && 'Payment Successful!'}
              {props.status === 'pending' && 'Payment Pending'}
              {props.status === 'failed' && 'Payment Failed'}
            </h1>

            <p className="text-gray-600 mt-2 mb-6">{props.message}</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-semibold">{formatCurrency(props.settlement.amount)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reference</p>
                  <p className="font-mono text-xs">{props.settlement.payment_reference}</p>
                </div>
                <div>
                  <p className="text-gray-500">Group</p>
                  <p className="font-semibold">{props.group.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-semibold">
                    {new Date(props.settlement.created_at.toString()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBackToGroup}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Back to Group
              </button>

              <p className="text-xs text-gray-500">
                You will be automatically redirected in 5 seconds...
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
