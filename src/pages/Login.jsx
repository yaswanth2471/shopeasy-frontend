import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import API from '../api/axios'
import { loginSuccess } from '../redux/authSlice'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ email: '', password: '' })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await API.post('/auth/login', form)
            dispatch(loginSuccess({
                token: res.data.token,
                user: {
                    name: res.data.name,
                    email: res.data.email,
                    role: res.data.role,
                }
            }))
            toast.success('Login successful! 🎉')
            navigate('/')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
                    Login 👋
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full border border-gray-300 rounded-lg
                            px-4 py-3 focus:outline-none focus:ring-2
                            focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full border border-gray-300 rounded-lg
                            px-4 py-3 focus:outline-none focus:ring-2
                            focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg
                        font-bold hover:bg-blue-700 transition disabled:opacity-50">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-semibold">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login