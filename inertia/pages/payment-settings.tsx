import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import Footer from '../components/footer'
import Header from '../components/header'
import User from '#models/user'

export default function PaymentSettings(props: { user: User }) {
  const [isSaving, setIsSaving] = useState(false)
  const [paymentData, setPaymentData] = useState({
    // Bank details
    bankName: props.user.bank_name || '',
    accountNumber: props.user.account_number || '',
    accountName: props.user.account_name || '',

    // Paystack settings
    paystackEnabled: props.user.paystack_enabled || false,
    paystackAccountCode: props.user.paystack_account_code || '',

    // Preferences
    preferredPaymentMethod: props.user.preferred_payment_method || 'both',
  })

  const banks = [
    { code: '044', name: 'Access Bank' },
    { code: '023', name: 'Citibank' },
    { code: '063', name: 'Diamond Bank' },
    { code: '050', name: 'Ecobank' },
    { code: '070', name: 'Fidelity Bank' },
    { code: '011', name: 'First Bank' },
    { code: '214', name: 'First City Monument Bank' },
    { code: '058', name: 'Guaranty Trust Bank' },
    { code: '030', name: 'Heritage Bank' },
    { code: '301', name: 'Jaiz Bank' },
    { code: '082', name: 'Keystone Bank' },
    { code: '221', name: 'Stanbic IBTC Bank' },
    { code: '076', name: 'Skye Bank' },
    { code: '068', name: 'Standard Chartered Bank' },
    { code: '232', name: 'Sterling Bank' },
    { code: '100', name: 'Suntrust Bank' },
    { code: '032', name: 'Union Bank' },
    { code: '033', name: 'United Bank for Africa' },
    { code: '215', name: 'Unity Bank' },
    { code: '035', name: 'Wema Bank' },
    { code: '057', name: 'Zenith Bank' },
  ]

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await router.put('/profile/payment-settings', paymentData)
      alert('Payment settings saved successfully!')
    } catch (error) {
      alert('Failed to save payment settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.visit('/profile')
  }

  return (
    <>
      <Head title="Payment Settings - SplitX" />

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
                <h1 className="text-3xl font-bold text-gray-800">Payment Settings</h1>
                <p className="text-gray-600 mt-1">Configure how others can pay you</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            {/* Bank Transfer Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Bank Transfer Details</h2>
              <p className="text-gray-600 mb-6">
                Add your bank account details so others can transfer money directly to you.
              </p>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="bankName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Bank Name *
                  </label>
                  <select
                    id="bankName"
                    required
                    value={paymentData.bankName}
                    onChange={(e) => setPaymentData({ ...paymentData, bankName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  >
                    <option value="">Choose your bank</option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.name}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="accountNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Account Number *
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    required
                    value={paymentData.accountNumber}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, accountNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="1234567890"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label
                    htmlFor="accountName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Account Name *
                  </label>
                  <input
                    type="text"
                    id="accountName"
                    required
                    value={paymentData.accountName}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, accountName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </div>

            {/* Paystack Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Automatic Payments (Paystack)
              </h2>
              <p className="text-gray-600 mb-6">
                Enable automatic payments so others can pay you instantly with cards or bank
                transfers.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="paystackEnabled"
                    checked={paymentData.paystackEnabled}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, paystackEnabled: e.target.checked })
                    }
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="paystackEnabled" className="text-sm font-medium text-gray-700">
                    Enable automatic payments
                  </label>
                </div>

                {paymentData.paystackEnabled && (
                  <div>
                    <label
                      htmlFor="paystackAccountCode"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Paystack Account Code *
                    </label>
                    <input
                      type="text"
                      id="paystackAccountCode"
                      required={paymentData.paystackEnabled}
                      value={paymentData.paystackAccountCode}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, paystackAccountCode: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="ACCT_xxxxxxxxxxxxx"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Get this from your Paystack dashboard under Account Settings
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Preferences */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Preferences</h2>
              <p className="text-gray-600 mb-6">
                Choose which payment method you prefer others to use when paying you.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Payment Method
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="both"
                        name="preferredPaymentMethod"
                        value="both"
                        checked={paymentData.preferredPaymentMethod === 'both'}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            preferredPaymentMethod: e.target.value as
                              | 'manual'
                              | 'automatic'
                              | 'both',
                          })
                        }
                        className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                      />
                      <label htmlFor="both" className="text-sm text-gray-700">
                        <span className="font-medium">Show both options</span>
                        <span className="block text-gray-500">
                          Let others choose between manual and automatic
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="manual"
                        name="preferredPaymentMethod"
                        value="manual"
                        checked={paymentData.preferredPaymentMethod === 'manual'}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            preferredPaymentMethod: e.target.value as
                              | 'manual'
                              | 'automatic'
                              | 'both',
                          })
                        }
                        className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                      />
                      <label htmlFor="manual" className="text-sm text-gray-700">
                        <span className="font-medium">Manual transfer only</span>
                        <span className="block text-gray-500">Prefer bank transfers (no fees)</span>
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="automatic"
                        name="preferredPaymentMethod"
                        value="automatic"
                        checked={paymentData.preferredPaymentMethod === 'automatic'}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            preferredPaymentMethod: e.target.value as
                              | 'manual'
                              | 'automatic'
                              | 'both',
                          })
                        }
                        className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                      />
                      <label htmlFor="automatic" className="text-sm text-gray-700">
                        <span className="font-medium">Automatic payment only</span>
                        <span className="block text-gray-500">
                          Prefer instant payments (small fees apply)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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
                disabled={isSaving}
                className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSaving ? (
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5"
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
              <div>
                <h4 className="text-sm font-medium text-blue-800">Security & Privacy</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your payment details are encrypted and stored securely. We never share your
                  information with third parties.
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
