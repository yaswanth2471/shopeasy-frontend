import React from 'react'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import API from '../api/axios'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await API.get('/orders/my-orders')
            setOrders(res.data)
        } catch (err) {
            toast.error('Failed to load orders!')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async (orderId) => {
        try {
            await API.put(`/orders/${orderId}/cancel`)
            toast.success('Order cancelled!')
            fetchOrders()
        } catch (err) {
            toast.error('Cannot cancel this order!')
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
            <div className="text-2xl text-blue-600">Loading orders... ⏳</div>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
                My Orders 📦
            </h2>

            {orders.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-xl text-gray-500">No orders yet!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.orderId}
                            className="bg-white rounded-xl shadow-md p-6">

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
                                    {(order.status === 'PENDING' ||
                                      order.status === 'CONFIRMED') && (
                                        <button
                                            onClick={() =>
                                                handleCancel(order.orderId)}
                                            className="text-red-500
                                            border border-red-500 px-3 py-1
                                            rounded-lg text-sm hover:bg-red-50">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3 border-t pt-4">
                                {order.orderItems?.map((item, idx) => (
                                    <div key={idx}
                                        className="flex justify-between
                                        items-center">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.productImage ||
                                                'https://via.placeholder.com/50'}
                                                alt={item.productName}
                                                className="w-12 h-12 rounded-lg
                                                object-cover"
                                                onError={(e) =>
                                                    e.target.src =
                                                    'https://via.placeholder.com/50'}
                                            />
                                            <div>
                                                <p className="font-medium">
                                                    {item.productName}
                                                </p>
                                                <p className="text-gray-500
                                                text-sm">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold">
                                            ₹{item.totalPrice}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 mt-4 flex
                            justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Payment: {order.paymentStatus}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {order.address?.city},{' '}
                                        {order.address?.state}
                                    </p>
                                </div>
                                <p className="font-bold text-xl text-green-600">
                                    ₹{order.finalAmount}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Orders