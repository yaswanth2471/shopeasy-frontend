import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminDashboard = () => {
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)

    if (user?.role !== 'ADMIN') {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <p className="text-2xl text-red-500 font-bold">
                        Access Denied!
                    </p>
                    <p className="text-gray-500 mt-2">
                        You are not authorized to view this page.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Admin Header */}
            <div className="bg-gray-800 text-white py-8 px-6">
                <h1 className="text-3xl font-bold">
                    🛠️ Admin Dashboard
                </h1>
                <p className="text-gray-400 mt-1">
                    Welcome back, {user?.name}!
                </p>
            </div>

            {/* Stats Cards */}
            <div className="max-w-6xl mx-auto py-10 px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[
                        { title: 'Manage Products', icon: '📦',
                          desc: 'Add, edit, delete products',
                          route: '/admin/products',
                          color: 'bg-blue-500' },
                        { title: 'Manage Categories', icon: '🗂️',
                          desc: 'Add, delete categories',
                          route: '/admin/categories',
                          color: 'bg-green-500' },
                        { title: 'Manage Orders', icon: '🧾',
                          desc: 'View and update orders',
                          route: '/admin/orders',
                          color: 'bg-purple-500' },
                    ].map((card) => (
                        <div
                            key={card.title}
                            onClick={() => navigate(card.route)}
                            className="bg-white rounded-xl shadow-md p-6
                            cursor-pointer hover:shadow-xl transition
                            hover:scale-105">
                            <div className={`${card.color} text-white
                            rounded-full w-14 h-14 flex items-center
                            justify-center text-2xl mb-4`}>
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {card.title}
                            </h3>
                            <p className="text-gray-500 mt-1">{card.desc}</p>
                            <button className={`mt-4 ${card.color}
                            text-white px-4 py-2 rounded-lg text-sm
                            font-medium hover:opacity-90`}>
                                Go →
                            </button>
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        Quick Actions
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="bg-blue-600 text-white px-6 py-2
                            rounded-lg hover:bg-blue-700">
                            ➕ Add Product
                        </button>
                        <button
                            onClick={() => navigate('/admin/categories')}
                            className="bg-green-600 text-white px-6 py-2
                            rounded-lg hover:bg-green-700">
                            ➕ Add Category
                        </button>
                        <button
                            onClick={() => navigate('/admin/orders')}
                            className="bg-purple-600 text-white px-6 py-2
                            rounded-lg hover:bg-purple-700">
                            📋 View Orders
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-600 text-white px-6 py-2
                            rounded-lg hover:bg-gray-700">
                            🏠 Go to Store
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard