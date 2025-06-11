import React, {useState} from 'react'
import authService from '../appwrite/auth'
import {Link ,useNavigate} from 'react-router-dom'
import {login} from '../store/authSlice'
import {Button, Input, Logo} from './index.js'
import {useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()

    const create = async(data) => {
        setError("")
        setLoading(true)
        try {
            console.log("Signup - Creating account with data:", { ...data, password: "***" })
            const session = await authService.createAccount(data)
            if (session) {
                console.log("Signup - Account created successfully, fetching user data")
                const userData = await authService.getCurrentUser()
                if (userData) {
                    console.log("Signup - User data fetched, dispatching login with:", userData)
                    dispatch(login({userData}))
                    navigate("/")
                } else {
                    console.error("Signup - Failed to get user data after account creation")
                    setError("Failed to get user data. Please try again.")
                }
            }
        } catch (error) {
            console.error("Signup error:", error)
            setError(error.message || "Signup failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className={`mx-auto w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-xl p-10 border border-purple-100 shadow-lg shadow-purple-100/20`}>
            <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight text-indigo-900">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-purple-700">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-pink-600 transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>
                        <Input
                        label="Full Name: "
                        placeholder="Enter your full name"
                        {...register("name", {
                            required: true,
                        })}
                        />
                        <Input
                        label="Email: "
                        placeholder="Enter your email"
                        type="email"
                        {...register("email", {
                            required: true,
                            validate: {
                                matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Email address must be a valid address",
                            }
                        })}
                        />
                        <Input
                        label="Password: "
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: true,})}
                        />
                        <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" disabled={loading}>
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </div>
                </form>
            </div>

    </div>
  )
}

export default Signup