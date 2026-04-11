import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-20 px-6 text-center">
                <h1 className="text-5xl font-bold mb-4">
                    Welcome to ShopEasy 🛒
                </h1>
                <p className="text-xl mb-8 text-blue-100">
                    Best products at best prices!
                </p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-white text-blue-600 px-8 py-3 rounded-full
                    font-bold text-lg hover:bg-blue-50 transition">
                    Shop Now →
                </button>
            </div>

            {/* Categories */}
            <div className="max-w-6xl mx-auto py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
                    Shop by Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { name: 'Electronics', icon: '📱' },
                        { name: 'Fashion', icon: '👗' },
                        { name: 'Home & Kitchen', icon: '🏠' },
                        { name: 'Sports', icon: '⚽' },
                    ].map((cat) => (
                        <div
                            key={cat.name}
                            onClick={() => navigate('/products')}
                            className="bg-white rounded-xl shadow p-6 text-center
                            cursor-pointer hover:shadow-lg hover:scale-105 transition">
                            <div className="text-4xl mb-3">{cat.icon}</div>
                            <p className="font-semibold text-gray-700">{cat.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div className="bg-white py-16 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1
                md:grid-cols-3 gap-8 text-center">
                    {[
                        { icon: '🚚', title: 'Free Delivery',
                          desc: 'On orders above ₹499' },
                        { icon: '🔒', title: 'Secure Payment',
                          desc: '100% safe transactions' },
                        { icon: '↩️', title: 'Easy Returns',
                          desc: '7 day return policy' },
                    ].map((f) => (
                        <div key={f.title} className="p-6">
                            <div className="text-5xl mb-4">{f.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                            <p className="text-gray-500">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home