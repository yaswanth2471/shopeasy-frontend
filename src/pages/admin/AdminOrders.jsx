import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../../api/axios'

const AdminOrders = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await API.get('/orders/all')
            setOrders(res.data)
        } catch (err) {
            toast.error('Failed to load orders!')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (orderId, status) => {
        try {
            await API.put(`/orders/${orderId}/status?status=${status}`)
            toast.success('Order status updated! ✅')
            fetchOrders()
        } catch (err) {
            toast.error('Failed to update status!')
        }
    }

    const statusColor = (status) => {
        const colors = {
            PENDING: 'bg-yellow-100 text-yellow-700',
            CONFIRMED: 'bg-blue-100 text-blue-700',
            SHIPPED: 'bg-purple-100 text-purple-700',
            DELIVERED: 'bg-green-100 text-green-700',
            CANCELLED: 'bg-red-100 text-red-700',
        }
        return colors[status] || 'bg-gray-100 text-gray-700'
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-2xl text-blue-600">Loading... ⏳</div>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                        🧾 Manage Orders
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Total: {orders.length} orders
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admin')}
                    className="bg-gray-500 text-white px-4 py-2
                    rounded-lg hover:bg-gray-600">
                    ← Back
                </button>
            </div>

            {/* Orders */}
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white
                    rounded-xl shadow">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-xl text-gray-500">
                            No orders yet!
                        </p>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.orderId}
                            className="bg-white rounded-xl shadow p-6">
                            <div className="flex justify-between
                            items-center mb-4">
                                <div>
                                    <p className="font-bold text-lg">
                                        Order #{order.orderId}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(order.createdAt)
                                            .toLocaleDateString('en-IN')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full
                                    text-sm font-semibold
                                    ${statusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <select
                                        onChange={(e) =>
                                            handleStatusUpdate(
                                                order.orderId, e.target.value)}
                                        className="border rounded-lg
                                        px-3 py-1 text-sm">
                                        <option value="">Update Status</option>
                                        <option value="CONFIRMED">
                                            Confirm
                                        </option>
                                        <option value="SHIPPED">Ship</option>
                                        <option value="DELIVERED">
                                            Deliver
                                        </option>
                                        <option value="CANCELLED">
                                            Cancel
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4
                            text-sm text-gray-600">
                                <div>
                                    <p>💰 Amount:
                                        <span className="font-bold
                                        text-green-600 ml-1">
                                            ₹{order.finalAmount}
                                        </span>
                                    </p>
                                    <p>💳 Payment: {order.paymentStatus}</p>
                                </div>
                                <div>
                                    <p>📍 {order.address?.city},{' '}
                                        {order.address?.state}</p>
                                    <p>📞 {order.address?.phone}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default AdminOrders