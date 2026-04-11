import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../api/axios'
import { setCart } from '../redux/cartSlice'

const Cart = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [cart, setCartData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [addresses, setAddresses] = useState([])
    const [selectedAddress, setSelectedAddress] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('COD')
    const [placing, setPlacing] = useState(false)
    const [showAddAddress, setShowAddAddress] = useState(false)
    const [newAddress, setNewAddress] = useState({
        fullName: '', phone: '', addressLine1: '',
        addressLine2: '', city: '', state: '', pincode: ''
    })

    useEffect(() => {
        fetchCart()
        fetchAddresses()
    }, [])

    const fetchCart = async () => {
        try {
            const res = await API.get('/cart')
            setCartData(res.data)
            dispatch(setCart(res.data))
        } catch (err) {
            toast.error('Failed to load cart!')
        } finally {
            setLoading(false)
        }
    }

    const fetchAddresses = async () => {
        try {
            const res = await API.get('/addresses')
            setAddresses(res.data)
            if (res.data.length > 0) setSelectedAddress(res.data[0].id)
        } catch (err) {
            console.error(err)
        }
    }

    const handleAddAddress = async () => {
        try {
            await API.post('/addresses', newAddress)
            toast.success('Address added!')
            setShowAddAddress(false)
            fetchAddresses()
            setNewAddress({
                fullName: '', phone: '', addressLine1: '',
                addressLine2: '', city: '', state: '', pincode: ''
            })
        } catch (err) {
            toast.error('Failed to add address!')
        }
    }

 const handleRemove = async (cartItemId) => {
    try {
        await API.delete(`/cart/remove/${cartItemId}`)
        // Wait then fetch fresh cart
        setTimeout(async () => {
            await fetchCart()
            toast.success('Item removed!')
        }, 500)
    } catch (err) {
        toast.error('Failed to remove item!')
    }
}

const handleUpdateQty = async (cartItemId, quantity) => {
    if (quantity <= 0) {
        await handleRemove(cartItemId)
        return
    }
    try {
        await API.put(`/cart/update/${cartItemId}`, { quantity })
        await fetchCart()
    } catch (err) {
        toast.error('Failed to update quantity!')
    }
}
    const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

const handlePlaceOrder = async () => {
    if (!selectedAddress) {
        toast.warning('Please add a delivery address first!')
        return
    }

    setPlacing(true)

    try {
        // Place order first
        const orderRes = await API.post('/orders/place', {
            addressId: selectedAddress,
            paymentMethod
        })

        const placedOrder = orderRes.data

        // If COD — done!
        if (paymentMethod === 'COD') {
            toast.success('Order placed successfully! 🎉')
            fetchCart()
            navigate('/orders')
            return
        }

        // If Razorpay — open payment modal
        if (paymentMethod === 'RAZORPAY') {
            const loaded = await loadRazorpay()
            if (!loaded) {
                toast.error('Razorpay failed to load!')
                return
            }

            // Create Razorpay order
            const razorpayRes = await API.post('/payment/create-order', {
                amount: placedOrder.finalAmount,
                currency: 'INR',
                orderId: placedOrder.orderId
            })

            const options = {
                key: razorpayRes.data.keyId,
                amount: razorpayRes.data.amount * 100,
                currency: 'INR',
                name: 'ShopEasy',
                description: `Order #${placedOrder.orderId}`,
                order_id: razorpayRes.data.razorpayOrderId,
                handler: async (response) => {
                    try {
                        await API.post('/payment/verify', {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            orderId: placedOrder.orderId
                        })
                        toast.success('Payment successful! 🎉')
                        fetchCart()
                        navigate('/orders')
                    } catch (err) {
                        toast.error('Payment verification failed!')
                    }
                },
                prefill: {
                    name: 'Customer',
                    email: 'customer@example.com',
                },
                theme: {
                    color: '#2563EB'
                }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        }

    } catch (err) {
        toast.error('Failed to place order!')
    } finally {
        setPlacing(false)
    }
}

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-2xl text-blue-600">Loading cart... ⏳</div>
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto py-10 px-6">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
                My Cart 🛒
            </h2>

            {!cart || cart.items?.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-xl text-gray-500 mb-6">
                        Your cart is empty!
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-blue-600 text-white px-8 py-3
                        rounded-xl font-bold hover:bg-blue-700">
                        Shop Now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map(item => (
                            <div key={item.cartItemId}
                                className="bg-white rounded-xl shadow p-4
                                flex gap-4 items-center">
                                <img
                                    src={item.productImage ||
                                        'https://via.placeholder.com/100'}
                                    alt={item.productName}
                                    className="w-24 h-24 object-cover rounded-lg"
                                    onError={(e) =>
                                        e.target.src =
                                        'https://via.placeholder.com/100'}
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">
                                        {item.productName}
                                    </h3>
                                    <p className="text-green-600 font-bold">
                                        ₹{item.price}
                                    </p>
                                    <div className="flex items-center
                                    gap-3 mt-2">
                                        <button
                                            onClick={() => handleUpdateQty(
                                                item.cartItemId,
                                                item.quantity - 1)}
                                            className="bg-gray-200 px-3
                                            py-1 rounded-lg font-bold">
                                            -
                                        </button>
                                        <span className="font-bold">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateQty(
                                                item.cartItemId,
                                                item.quantity + 1)}
                                            className="bg-gray-200 px-3
                                            py-1 rounded-lg font-bold">
                                            +
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleRemove(item.cartItemId)}
                                            className="ml-4 text-red-500
                                            hover:text-red-700 font-medium">
                                            🗑️ Remove
                                        </button>
                                    </div>
                                </div>
                                <div className="font-bold text-lg">
                                    ₹{item.totalPrice}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-xl shadow p-6
                    h-fit space-y-4">
                        <h3 className="text-xl font-bold">Order Summary</h3>

                        <div className="flex justify-between text-gray-600">
                            <span>Items ({cart.totalItems})</span>
                            <span>₹{cart.totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery</span>
                            <span className="text-green-600">FREE</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between
                        font-bold text-lg">
                            <span>Total</span>
                            <span>₹{cart.totalAmount}</span>
                        </div>

                        {/* Address Section */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="font-medium">
                                    Delivery Address
                                </label>
                                <button
                                    onClick={() =>
                                        setShowAddAddress(!showAddAddress)}
                                    className="text-blue-600 text-sm
                                    hover:underline">
                                    + Add New
                                </button>
                            </div>

                            {showAddAddress && (
                                <div className="space-y-2 mb-3">
                                    {[
                                        { name: 'fullName',
                                          placeholder: 'Full Name' },
                                        { name: 'phone',
                                          placeholder: 'Phone' },
                                        { name: 'addressLine1',
                                          placeholder: 'Address Line 1' },
                                        { name: 'addressLine2',
                                          placeholder: 'Address Line 2' },
                                        { name: 'city',
                                          placeholder: 'City' },
                                        { name: 'state',
                                          placeholder: 'State' },
                                        { name: 'pincode',
                                          placeholder: 'Pincode' },
                                    ].map(field => (
                                        <input
                                            key={field.name}
                                            placeholder={field.placeholder}
                                            value={newAddress[field.name]}
                                            onChange={(e) => setNewAddress({
                                                ...newAddress,
                                                [field.name]: e.target.value
                                            })}
                                            className="w-full border rounded-lg
                                            px-3 py-2 text-sm"
                                        />
                                    ))}
                                    <button
                                        onClick={handleAddAddress}
                                        className="w-full bg-green-500
                                        text-white py-2 rounded-lg
                                        font-medium hover:bg-green-600">
                                        Save Address
                                    </button>
                                </div>
                            )}

                            {addresses.length === 0 ? (
                                <p className="text-red-500 text-sm">
                                    No address found! Add one above.
                                </p>
                            ) : (
                                <select
                                    value={selectedAddress}
                                    onChange={(e) =>
                                        setSelectedAddress(e.target.value)}
                                    className="w-full border rounded-lg
                                    px-3 py-2">
                                    {addresses.map(addr => (
                                        <option key={addr.id} value={addr.id}>
                                            {addr.fullName} - {addr.city}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="font-medium block mb-1">
                                Payment Method
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2">
                                <option value="COD">Cash on Delivery</option>
                                <option value="UPI">UPI</option>
                                <option value="RAZORPAY">Razorpay</option>
                            </select>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={placing}
                            className="w-full bg-blue-600 text-white py-3
                            rounded-xl font-bold hover:bg-blue-700
                            disabled:opacity-50">
                            {placing ? 'Placing...' : '🎉 Place Order'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart