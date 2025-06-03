import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'
import { FiLogOut } from 'react-icons/fi'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
    
    return (
        <button
            className='w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'
            onClick={logoutHandler}
        >
            <FiLogOut className="w-4 h-4 mr-2" />
            Sign Out
        </button>
    )
}

export default LogoutBtn