import { Head } from '@inertiajs/react'
import Footer from '../components/footer'
import Header from '../components/header'

export default function Home() {
  return (
    <>
      <Head title="SplitX - Split expenses, simplify payments" />

      <div className="min-h-screen bg-white">
        <Header auth={null} />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-teal-50 to-green-50 rounded-t-3xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              {/* Hero Illustration */}
              <div className="mb-12 flex justify-center">
                <div className="relative w-80 h-64 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center">
                  {/* Abstract illustration of hands and device */}
                  <div className="relative w-48 h-32">
                    {/* Hand 1 */}
                    <div className="absolute top-0 left-0 w-16 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-80"></div>
                    {/* Hand 2 */}
                    <div className="absolute top-4 right-0 w-14 h-18 bg-gradient-to-br from-brown-200 to-amber-200 rounded-full opacity-80"></div>
                    {/* Device/Card */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-white rounded-lg shadow-lg"></div>
                  </div>
                </div>
              </div>

              {/* Hero Text */}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                Split expenses, simplify payments
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                SplitX makes it easy to manage shared expenses, track balances, and settle up with
                friends and family. No more awkward IOUs or complicated calculations.
              </p>

              {/* Hero CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors font-medium">
                  Sign up
                </button>
                <button className="px-8 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium">
                  Log in
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How SplitX Works Section */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">How SplitX works</h2>
              <p className="text-xl text-gray-600">
                SplitX simplifies group expenses with a few easy steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Create a group</h3>
                <p className="text-gray-600">
                  Start by creating a group for your trip, event, or shared living arrangement.
                  Invite friends and family to join.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Add expenses</h3>
                <p className="text-gray-600">
                  Easily add expenses to the group, specifying who paid and who owes. SplitX
                  automatically calculates balances.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-gray-600"
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
                <h3 className="text-xl font-bold text-gray-800 mb-4">Settle up</h3>
                <p className="text-gray-600">
                  Settle balances with direct bank transfers or other payment methods. Export
                  summaries or share payment links for easy tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Features</h2>
              <p className="text-xl text-gray-600">
                SplitX offers a range of features to make managing shared expenses a breeze.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                  <div className="relative w-32 h-24">
                    <div className="absolute top-0 left-0 w-8 h-10 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-80"></div>
                    <div className="absolute top-2 right-0 w-6 h-8 bg-gradient-to-br from-brown-200 to-amber-200 rounded-full opacity-80"></div>
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-white rounded shadow"></div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Group expenses</h3>
                  <p className="text-gray-600">
                    Create groups for any shared expense, from trips and events to shared living
                    costs. Invite participants and manage expenses easily.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                  <div className="relative w-32 h-24">
                    <div className="absolute top-0 left-0 w-6 h-8 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-80"></div>
                    <div className="absolute top-2 right-0 w-8 h-10 bg-gradient-to-br from-brown-200 to-amber-200 rounded-full opacity-80"></div>
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-white rounded shadow"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-80"></div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Balance tracking</h3>
                  <p className="text-gray-600">
                    Track who owes whom with real-time balance updates. See a clear breakdown of
                    expenses and payments within each group.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                  <div className="relative w-32 h-24">
                    <div className="absolute top-0 left-0 w-8 h-10 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-80"></div>
                    <div className="absolute top-2 right-0 w-6 h-8 bg-gradient-to-br from-brown-200 to-amber-200 rounded-full opacity-80"></div>
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-white rounded-lg shadow"></div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Payment integration</h3>
                  <p className="text-gray-600">
                    Settle balances directly through the app with integrated payment methods. Export
                    summaries or share payment links for easy reconciliation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Ready to simplify your shared expenses?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Sign up for SplitX today and experience the easiest way to manage group finances.
            </p>
            <button className="px-8 py-3 bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors font-medium">
              Get started
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
