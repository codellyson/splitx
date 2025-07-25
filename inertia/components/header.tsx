import { Link, router } from '@inertiajs/react'

interface HeaderProps {
  className?: string
  auth: any
}

export default function Header({ auth, className = '' }: HeaderProps) {
  console.log(auth)
  return (
    <header
      className={`bg-white border-b border-gray-100 sticky top-0 left-0 right-0 z-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/* <img src="/images/logo.png" alt="SplitX Logo" className="w-10 h-10" /> */}
            <span className="text-xl font-bold text-gray-800">SplitX</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </Link>

            {!auth ? (
              <>
                <Link
                  href="/how-it-works"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  How it works
                </Link>
                <Link
                  href="/features"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Pricing
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/groups"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Groups
                </Link>
              </>
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            {auth ? (
              <>
                <button
                  onClick={() => {
                    router.post('/auth/logout')
                  }}
                  className="px-4 bg-red-100 cursor-pointer py-2 text-gray-700 hover:bg-red-200 rounded-lg transition-colors"
                >
                  Log out
                </button>
                <Link
                  href="/profile"
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth"
                  className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
