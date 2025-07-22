interface HeaderProps {
  className?: string
  auth: any
  user: any
}

export default function Header({ auth, className = '', user }: HeaderProps) {
  console.log(auth, user)
  return (
    <header className={`bg-white border-b border-gray-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/* <img src="/images/logo.png" alt="SplitX Logo" className="w-10 h-10" /> */}
            <span className="text-xl font-bold text-gray-800">SplitX</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </a>
            <a href="/groups" className="text-gray-700 hover:text-gray-900 transition-colors">
              Groups
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 transition-colors">
              How it works
            </a>
            <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            {auth ? (
              <>
                <a
                  href="/auth"
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Log out
                </a>
                <a
                  href="/profile"
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Profile
                </a>
              </>
            ) : (
              <>
                <a
                  href="/auth"
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Log in
                </a>
                <a
                  href="/auth"
                  className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors"
                >
                  Sign up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
