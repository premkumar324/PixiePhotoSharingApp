import React, { useState } from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiEdit, FiGrid, FiHome, FiLogIn, FiUserPlus, FiImage, FiMenu, FiX } from 'react-icons/fi'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Debug logging
  console.log('Auth Status:', authStatus)
  console.log('User Data:', userData)

  const navItems = [
    {
      name: 'Explore',
      slug: "/",
      icon: <FiGrid className="w-4 h-4" />,
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      icon: <FiLogIn className="w-4 h-4" />,
      active: !authStatus,
    },
    {
      name: "Sign Up",
      slug: "/signup",
      icon: <FiUserPlus className="w-4 h-4" />,
      active: !authStatus,
    },
    {
      name: "Gallery",
      slug: "/all-posts",
      icon: <FiImage className="w-4 h-4" />,
      active: authStatus,
    },
    {
      name: "New Post",
      slug: "/add-post",
      icon: <FiEdit className="w-4 h-4" />,
      active: authStatus,
    },
  ]

  const handleNavigation = (slug) => {
    navigate(slug)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className='sticky top-0 z-50 bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90 border-b border-white/10 shadow-md backdrop-blur-sm'>
      <Container>
        <nav className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link to='/' className='flex items-center space-x-3 group'>
              <div className="w-9 h-9 transition-transform duration-200 group-hover:scale-110 bg-white/20 rounded-lg flex items-center justify-center">
                <Logo width='24px' />
              </div>
              <div className="flex flex-col">
                <span className='text-2xl font-bold text-white tracking-tight'>
                  Pixie
                </span>
                <span className="text-xs text-white/80 font-medium tracking-wide">Capture & Share</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-1'>
            {navItems.map((item) => 
              item.active ? (
                <button
                  key={item.name}
                  onClick={() => navigate(item.slug)}
                  className='inline-flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-white/20 rounded-lg transition-colors'
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </button>
              ) : null
            )}
            {authStatus && (
              <div className="relative ml-2" onMouseLeave={() => setIsDropdownOpen(false)}>
                <button
                  className="inline-flex items-center px-3 py-2 border border-white/30 rounded-lg hover:bg-white/20 transition-colors"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                >
                  <span className="w-8 h-8 flex items-center justify-center bg-white text-purple-600 rounded-full font-medium mr-2">
                    {userData?.name?.charAt(0)?.toUpperCase() || <FiUser className="w-4 h-4" />}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {userData?.name || 'Account'}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-purple-100 py-1">
                    <div className="px-4 py-2 border-b border-purple-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <p className="text-sm font-medium text-gray-900">{userData?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                    </div>
                    <div className="px-2 py-2">
                      <LogoutBtn />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='p-2 text-white hover:bg-white/20 rounded-lg transition-colors'
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            <div className="fixed inset-y-0 right-0 w-64 bg-gradient-to-b from-indigo-600 to-purple-700 shadow-xl transform transition-transform duration-300 ease-in-out">
              <div className="h-full flex flex-col">
                {/* Mobile Menu Header */}
                <div className="px-4 py-6 border-b border-white/20">
                  {authStatus ? (
                    <div className="flex items-center space-x-3">
                      <span className="w-10 h-10 flex items-center justify-center bg-white text-purple-600 rounded-full font-medium text-lg">
                        {userData?.name?.charAt(0)?.toUpperCase() || <FiUser className="w-5 h-5" />}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{userData?.name}</span>
                        <span className="text-xs text-white/70 truncate">{userData?.email}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-lg font-medium text-white">Menu</span>
                  )}
                </div>

                {/* Mobile Menu Items */}
                <div className="flex-1 overflow-y-auto py-2">
                  {navItems.map((item) => 
                    item.active ? (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.slug)}
                        className='w-full flex items-center px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors'
                      >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </button>
                    ) : null
                  )}
                </div>

                {/* Mobile Menu Footer */}
                {authStatus && (
                  <div className="border-t border-white/20 p-4">
                    <LogoutBtn className="w-full bg-white/10 hover:bg-white/20 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}

export default Header