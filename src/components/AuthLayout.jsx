import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function Protected({children, authentication = true}) {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        // If authentication is required but user is not authenticated
        if (authentication && !authStatus) {
            navigate("/login")
        } 
        // If authentication is not required but user is authenticated
        else if (!authentication && authStatus) {
            navigate("/")
        }
        
        setLoader(false)
    }, [authStatus, navigate, authentication])

    if (loader) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
            </div>
        )
    }

    return <>{children}</>
}

