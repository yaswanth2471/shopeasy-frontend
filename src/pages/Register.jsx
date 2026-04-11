import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../api/axios'

const Register = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: '', email: '', password: '', phone: ''
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await API.post('/auth/register', form)
            toast.success('Registration successful! Please login.')
            navigate('/login')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
                    Register 🚀
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                        { label: 'Name', name: 'name',
                          type: 'text', placeholder: 'Enter your name' },
                        { label: 'Email', name: 'email',
                          type: 'email', placeholder: 'Enter your email' },
                        { label: 'Phone', name: 'phone',
                          type: 'text', placeholder: 'Enter your phone' },
                        { label: 'Password', name: 'password',
                          type: 'password', placeholder: 'Enter your password' },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-gray-700 mb-1 font-medium">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={form[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                required
                                className="w-full border border-gray-300 rounded-lg
                                px-4 py-3 focus:outline-none focus:ring-2
                                focus:ring-blue-500"
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg
                        font-bold hover:bg-blue-700 transition disabled:opacity-50">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-semibold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register