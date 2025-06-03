import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <footer className="py-8 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo width="40px" />
            <span className="text-gray-600 text-sm">
              © {new Date().getFullYear()} MegaBlog. All rights reserved.
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <Link
              to="/privacy-policy"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer