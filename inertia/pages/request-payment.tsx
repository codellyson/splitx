import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

export default function RequestPayment() {
  const [isSending, setIsSending] = useState(false)
  const [emailData, setEmailData] = useState({
    recipientEmail: '',
    recipientName: '',
    message: '',
    paymentLink: ''
  })

  // Mock data - replace with real data from backend
  const request = {
    groupId: 1,
    groupName: 'Weekend Trip to Miami',
    amount: 120.50,
    currency: 'USD',
    recipient: 'John Doe',
    recipientEmail: 'john@example.com',
    description: 'Settlement for Weekend Trip to Miami'
  }

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    try {
      // Mock email sending with payment link
      console.log('Sending payment request:', {
        recipientEmail: emailData.recipientEmail,
        recipientName: emailData.recipientName,
        amount: request.amount,
        currency: request.currency,
        message: emailData.message,
        paymentLink: emailData.paymentLink,
        groupName: request.groupName
      })

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock successful email send
      alert('Payment request sent successfully! John will receive an email with the payment link.')
      router.visit(`/groups/${request.groupId}`)
    } catch (error) {
      alert('Failed to send payment request. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleCancel = () => {
    router.visit(`/groups/${request.groupId}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: request.currency
    }).format(amount)
  }

  const generatePaymentLink = () => {
    // Mock payment link generation
    const link = `https://splitx.com/pay/${request.groupId}/${request.recipient}?amount=${request.amount}&currency=${request.currency}`
    setEmailData({ ...emailData, paymentLink: link })
  }

  return (
    <>
      <Head title="Request Payment - SplitX" />

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
                <h1 className="text-3xl font-bold text-gray-800">Request Payment</h1>
                <p className="text-gray-600 mt-1">Send a payment request to {request.recipient}</p>
              </div>
            </div>
          </div>

          {/* Payment Request Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Request Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Group:</span>
                <span className="font-medium">{request.groupName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recipient:</span>
                <span className="font-medium">{request.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-lg text-green-600">{formatCurrency(request.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-orange-600 font-medium">Pending Payment</span>
              </div>
            </div>
          </div>

          {/* Email Request Form */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Send Payment Request</h2>

            <form onSubmit={handleSendRequest} className="space-y-6">
              <div>
                <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  id="recipientEmail"
                  required
                  value={emailData.recipientEmail}
                  onChange={(e) => setEmailData({ ...emailData, recipientEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="john@example.com"
                  defaultValue={request.recipientEmail}
                />
              </div>

              <div>
                <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  id="recipientName"
                  required
                  value={emailData.recipientName}
                  onChange={(e) => setEmailData({ ...emailData, recipientName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="John Doe"
                  defaultValue={request.recipient}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="Hey John, could you please settle your balance for our Miami trip? Thanks!"
                />
              </div>

              <div>
                <label htmlFor="paymentLink" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Link
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="paymentLink"
                    readOnly
                    value={emailData.paymentLink}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    placeholder="Click 'Generate Link' to create payment link"
                  />
                  <button
                    type="button"
                    onClick={generatePaymentLink}
                    className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Generate Link
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  This link will be included in the email for easy payment
                </p>
              </div>

              {/* Email Preview */}
              {emailData.paymentLink && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">Email Preview:</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>To:</strong> {emailData.recipientEmail}</p>
                    <p><strong>Subject:</strong> Payment Request - {request.groupName}</p>
                    <div className="border-t border-gray-200 pt-2">
                      <p>Hi {emailData.recipientName},</p>
                      <p className="mt-2">
                        You have an outstanding balance of <strong>{formatCurrency(request.amount)}</strong> for the group "{request.groupName}".
                      </p>
                      {emailData.message && (
                        <p className="mt-2 italic">"{emailData.message}"</p>
                      )}
                      <p className="mt-2">
                        Please click the link below to settle your payment:
                      </p>
                      <p className="mt-2 text-teal-600 break-all">{emailData.paymentLink}</p>
                      <p className="mt-2">Thanks!</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending || !emailData.paymentLink}
                  className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Send Payment Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Additional Options */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Additional Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-800">Export Payment Summary</h4>
                    <p className="text-sm text-gray-600">Download PDF with payment details</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors">
                  Export
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-800">Share Payment Link</h4>
                    <p className="text-sm text-gray-600">Share directly via WhatsApp, SMS, etc.</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
