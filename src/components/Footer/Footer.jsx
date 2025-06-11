import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <footer className="py-8 bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-lg p-1.5">
              <Logo width="40px" />
            </div>
            <span className="text-white/80 text-sm">
              © {new Date().getFullYear()} Pixie. All rights reserved.
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm mt-4 md:mt-0">
            <Link
              to="/privacy-policy"
              className="text-white/80 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-white/80 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer