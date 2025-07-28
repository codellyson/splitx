import { Head, Link } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import Footer from '../components/footer'
import Header from '../components/header'

export default function Profile(props: { user: any }) {
  const { user } = props
  const [notifications, setNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [userData, setUserData] = useState({
    name: user.full_name,
    email: user.email,
    phone: user.phone,
  })

  useEffect(() => {
    console.log(user)
    setUserData({
      name: user.full_name,
      email: user.email,
      phone: user.phone,
    })
  }, [user])
  return (
    <>
      <Head title="Profile - SplitX" />

      <div className="min-h-screen bg-gray-50">
        {/* Custom Header with Profile Icon */}
        <Header auth={user} />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>

            <div className="flex items-center space-x-6">
              {/* Profile Picture */}
              <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-medium">{userData.name.charAt(0)}</span>
              </div>

              {/* Profile Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                <p className="text-gray-600">
                  Joined in{' '}
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h3>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  readOnly
                  defaultValue={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue="+1 (555) 123-4567"
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Payment Methods</h3>
              <Link
                href="/profile/payment-settings"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm"
              >
                Configure Payment Settings
              </Link>
            </div>

            <div className="space-y-4">
              {/* Bank Account */}
              {user.bank_name && user.account_number ? (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.bank_name}</p>
                      <p className="text-sm text-gray-600">
                        Account ending in {user.account_number.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Active
                    </span>
                    <Link
                      href="/profile/payment-settings"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Bank Account</p>
                      <p className="text-sm text-gray-600">No bank account configured</p>
                    </div>
                  </div>
                  <Link
                    href="/profile/payment-settings"
                    className="px-3 py-1 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors text-sm"
                  >
                    Add Bank Account
                  </Link>
                </div>
              )}

              {/* Paystack Account */}
              {user.paystack_enabled && user.paystack_account_code ? (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded flex items-center justify-center">
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
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Paystack</p>
                      <p className="text-sm text-gray-600">Automatic payments enabled</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Active
                    </span>
                    <Link
                      href="/profile/payment-settings"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
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
                    <div>
                      <p className="font-medium text-gray-800">Automatic Payments</p>
                      <p className="text-sm text-gray-600">Paystack not configured</p>
                    </div>
                  </div>
                  <Link
                    href="/profile/payment-settings"
                    className="px-3 py-1 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors text-sm"
                  >
                    Enable
                  </Link>
                </div>
              )}

              {/* Payment Preferences */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Payment Preferences</p>
                    <p className="text-sm text-gray-600">
                      Preferred method:{' '}
                      {user.preferred_payment_method === 'both'
                        ? 'Both options'
                        : user.preferred_payment_method === 'manual'
                          ? 'Manual transfers only'
                          : 'Automatic payments only'}
                    </p>
                  </div>
                  <Link
                    href="/profile/payment-settings"
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    Change
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* App Preferences */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">App Preferences</h3>

            <div className="space-y-6">
              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Notifications</p>
                  <p className="text-sm text-gray-600">Receive push notifications for updates</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-teal-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Dark Mode</p>
                  <p className="text-sm text-gray-600">Switch to dark theme</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-teal-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="flex justify-end">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
