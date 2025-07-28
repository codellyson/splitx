import React from 'react'

interface FooterProps {
  className?: string
}

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`bg-gray-50 border-t border-gray-200 py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</a>
          </div>
          <div className="text-gray-600">
            © 2024 SplitX. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
