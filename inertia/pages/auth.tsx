import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import Footer from '../components/footer'
import Header from '../components/header'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(form)
    if (isLogin) {
      if (form.email === '' || form.password === '') {
        alert('Please fill in all fields')
        return
      }
      router.post('/auth/login', form)
    } else {
      if (form.email === '' || form.password === '' || form.fullName === '') {
        alert('Please fill in all fields')
        return
      }
      router.post('/auth/signup', form)
    }
  }

  return (
    <>
      <Head title={isLogin ? 'Login - SplitX' : 'Sign up - SplitX'} />

      <div className="min-h-screen bg-white">
        <Header auth={null} />

        {/* Auth Section */}
        <section className="py-20 bg-gradient-to-br from-teal-50 to-green-50">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h1>
                <p className="text-gray-600">
                  {isLogin
                    ? 'Sign in to your SplitX account'
                    : 'Start managing shared expenses with friends and family'}
                </p>
              </div>

              {/* Toggle Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    isLogin
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    !isLogin
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Sign up
                </button>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                      Forgot password?
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  {isLogin ? 'Sign in' : 'Create account'}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                  Continue with Twitter
                </button>
              </div>

              {/* Terms */}
              {!isLogin && (
                <p className="mt-6 text-xs text-gray-500 text-center">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-teal-600 hover:text-teal-700">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-teal-600 hover:text-teal-700">
                    Privacy Policy
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
