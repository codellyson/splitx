import { Head, router } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import Footer from '../components/footer'
import Header from '../components/header'
import User from '#models/user'
import Expense from '#models/expense'
import Group from '#models/group'
import ExpenseSplit from '#models/expense_split'
import axios from 'axios'

export default function HybridSettle(props: {
  user: User
  expenseSplit: ExpenseSplit
  expense: Expense
  group: Group
  group_members: any[]
  members: User[]
  recipient: User
  paymentOptions: any
}) {
  const [selectedMethod, setSelectedMethod] = useState<'manual' | 'automatic'>(
    props.paymentOptions.preferred === 'automatic' && props.paymentOptions.automatic
      ? 'automatic'
      : 'manual'
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [manualConfirmation, setManualConfirmation] = useState(false)
  const [paymentNotes, setPaymentNotes] = useState('')

  // Process the data from props
  const settlement = useMemo(() => {
    const amount = Number(props.expenseSplit.amount_owed)
    const recipient = props.members.find((m) => m.id === props.expense.paid_by)
    const recipientName = recipient?.full_name || 'Unknown'

    return {
      groupId: props.group.id,
      groupName: props.group.name,
      amount,
      currency: 'NGN',
      recipient: recipientName,
      description: `Settlement for ${props.expense.title}`,
      expenseTitle: props.expense.title,
      expenseDescription: props.expense.description,
    }
  }, [props.expenseSplit, props.expense, props.group, props.members])

  const handleAutomaticPayment = async () => {
    setIsProcessing(true)

    try {
      // Initialize Paystack payment using fetch
      const response = await axios.post(
        '/settlements/initialize-payment',
        {
          expenseSplitId: props.expenseSplit.id,
          amount: settlement.amount,
          note: settlement.description,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN':
              document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
        }
      )
      if (response.data.success && response.data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url
      } else {
        console.log(response.data)
        throw new Error(response.data.message || 'Failed to initialize payment')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to initiate payment. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleManualConfirmation = async () => {
    if (!manualConfirmation) {
      alert('Please confirm that you have completed the bank transfer.')
      return
    }

    setIsProcessing(true)

    try {
      await router.post('/settlements/mark-paid', {
        expense_split_id: props.expenseSplit.id,
        payment_notes: paymentNotes || 'Manual transfer completed',
      })

      alert('Payment confirmed! Your balance has been settled.')
      router.visit(`/groups/${settlement.groupId}`)
    } catch (error) {
      alert('Failed to confirm payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    router.visit(`/groups/${settlement.groupId}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: settlement.currency,
    }).format(amount)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <>
      <Head title="Settle Balance - SplitX" />

      <div className="min-h-screen bg-gray-50">
        <Header auth={props.user} />

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
                <h1 className="text-3xl font-bold text-gray-800">Settle Balance</h1>
                <p className="text-gray-600 mt-1">Choose your preferred payment method</p>
              </div>
            </div>
          </div>

          {/* Settlement Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Group:</span>
                <span className="font-medium">{settlement.groupName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expense:</span>
                <span className="font-medium">{settlement.expenseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recipient:</span>
                <span className="font-medium">{settlement.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-lg text-red-600">
                  {formatCurrency(settlement.amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Choose Payment Method</h2>

            {/* Payment Method Cards */}
            <div className="space-y-4">
              {/* Manual Transfer Option */}
              {props.paymentOptions.manual && (
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedMethod === 'manual'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod('manual')}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
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
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {props.paymentOptions.manual.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {props.paymentOptions.manual.description}
                      </p>
                      <div className="mt-2 space-y-1">
                        {props.paymentOptions.manual.instructions.map(
                          (instruction: string, index: number) => (
                            <p key={index} className="text-xs text-gray-500">
                              • {instruction}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          selectedMethod === 'manual'
                            ? 'border-teal-500 bg-teal-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedMethod === 'manual' && (
                          <svg
                            className="w-3 h-3 text-white mx-auto mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Automatic Payment Option */}
              {props.paymentOptions.automatic && (
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedMethod === 'automatic'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod('automatic')}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {props.paymentOptions.automatic.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {props.paymentOptions.automatic.description}
                      </p>
                      <div className="mt-2 space-y-1">
                        {props.paymentOptions.automatic.features.map(
                          (feature: string, index: number) => (
                            <p key={index} className="text-xs text-gray-500">
                              ✓ {feature}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          selectedMethod === 'automatic'
                            ? 'border-teal-500 bg-teal-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedMethod === 'automatic' && (
                          <svg
                            className="w-3 h-3 text-white mx-auto mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Details */}
            {selectedMethod === 'manual' && props.paymentOptions.manual && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Bank Transfer Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Bank:</span>
                    <span className="font-medium">{props.paymentOptions.manual.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Account Number:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-medium">
                        {props.paymentOptions.manual.accountNumber}
                      </span>
                      <button
                        onClick={() => copyToClipboard(props.paymentOptions.manual.accountNumber)}
                        className="text-blue-600 hover:text-blue-800"
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
                  <div className="flex justify-between">
                    <span className="text-blue-700">Account Name:</span>
                    <span className="font-medium">{props.paymentOptions.manual.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Reference:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-medium">
                        {props.paymentOptions.manual.reference}
                      </span>
                      <button
                        onClick={() => copyToClipboard(props.paymentOptions.manual.reference)}
                        className="text-blue-600 hover:text-blue-800"
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
                  <div className="flex justify-between">
                    <span className="text-blue-700">Amount:</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(props.paymentOptions.manual.amount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 space-y-4">
              {selectedMethod === 'manual' ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="manualConfirmation"
                      checked={manualConfirmation}
                      onChange={(e) => setManualConfirmation(e.target.checked)}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="manualConfirmation" className="text-sm text-gray-700">
                      I have completed the bank transfer
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="paymentNotes"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Payment Notes (Optional)
                    </label>
                    <textarea
                      id="paymentNotes"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Add any notes about your payment..."
                    />
                  </div>

                  <button
                    onClick={handleManualConfirmation}
                    disabled={!manualConfirmation || isProcessing}
                    className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        <span>Confirming Payment...</span>
                      </>
                    ) : (
                      <>
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Confirm Payment</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAutomaticPayment}
                  disabled={isProcessing}
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
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
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <span>Pay {formatCurrency(settlement.amount)}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-gray-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-gray-800">Secure Payment</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedMethod === 'automatic'
                    ? 'Your payment is processed securely via Paystack. We never store your card details.'
                    : 'Bank transfers are secure and direct. Always verify account details before transferring.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
