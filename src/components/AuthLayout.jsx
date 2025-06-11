import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function Protected({children, authentication = true}) {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)
    const userData = useSelector(state => state.auth.userData)
    
    // Debug logging
    console.log('AuthLayout - Auth Status:', authStatus)
    console.log('AuthLayout - User Data:', userData)
    console.log('AuthLayout - Authentication Required:', authentication)

    useEffect(() => {
        // If authentication is required but user is not authenticated
        if (authentication && !authStatus) {
            console.log('AuthLayout - Redirecting to login')
            navigate("/login")
        } 
        // If authentication is not required but user is authenticated
        else if (!authentication && authStatus) {
            console.log('AuthLayout - Redirecting to home')
            navigate("/")
        }
        // If we're good to show the content
        else {
            console.log('AuthLayout - Showing protected content')
            setLoader(false)
        }
    }, [authStatus, navigate, authentication])

    if (loader) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <div className="w-24 h-24 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
            </div>
        )
    }

    return <>{children}</>
}

