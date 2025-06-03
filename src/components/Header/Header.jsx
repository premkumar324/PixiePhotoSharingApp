import React, { useState } from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiEdit, FiGrid, FiHome, FiLogIn, FiUserPlus, FiImage } from 'react-icons/fi'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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

  return (
    <header className='sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm'>
      <Container>
        <nav className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link to='/' className='flex items-center space-x-3 group'>
              <div className="w-9 h-9 transition-transform duration-200 group-hover:scale-110">
                <Logo width='36px' />
              </div>
              <div className="flex flex-col">
                <span className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight'>
                  Pixie
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">Capture & Share</span>
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
                  className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors'
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </button>
              ) : null
            )}
            {authStatus && (
              <div className="relative ml-2" onMouseLeave={() => setIsDropdownOpen(false)}>
                <button
                  className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                >
                  <span className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full text-white font-medium mr-2">
                    {userData?.name?.charAt(0)?.toUpperCase() || <FiUser className="w-4 h-4" />}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {userData?.name || 'Account'}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
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
          <div className='md:hidden flex items-center space-x-1'>
            <button
              onClick={() => navigate('/')}
              className='p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors'
            >
              <FiGrid className="w-5 h-5" />
            </button>
            {authStatus ? (
              <>
                <button
                  onClick={() => navigate('/add-post')}
                  className='p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors'
                >
                  <FiEdit className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className='p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors'
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full text-white font-medium">
                      {userData?.name?.charAt(0)?.toUpperCase() || <FiUser className="w-4 h-4" />}
                    </span>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{userData?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                      </div>
                      <button
                        onClick={() => navigate('/all-posts')}
                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                      >
                        Gallery
                      </button>
                      <div className="px-2 py-2">
                        <LogoutBtn />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className='p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors'
                >
                  <FiLogIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className='p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors'
                >
                  <FiUserPlus className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </nav>
      </Container>
    </header>
  )
}

export default Header