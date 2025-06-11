import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('App - Checking current user')
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        console.log('App - User found, logging in:', userData)
        dispatch(login({userData}))
      } else {
        console.log('App - No user found, logging out')
        dispatch(logout())
      }
    })
    .catch(error => {
      console.error('App - Error checking current user:', error)
      dispatch(logout())
    })
    .finally(() => {
      console.log('App - Authentication check complete')
      setLoading(false)
    })
  }, [])
  
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
      <div className='w-full block'>
        <Header />
        <main className='container mx-auto px-4 py-6'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App
