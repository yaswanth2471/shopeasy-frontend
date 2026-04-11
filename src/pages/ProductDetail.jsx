import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import API from '../api/axios'
import { setCart } from '../redux/cartSlice'

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAuthenticated } = useSelector(state => state.auth)
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [addingToCart, setAddingToCart] = useState(false)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await API.get(`/products/${id}`)
                setProduct(res.data)
            } catch (err) {
                toast.error('Product not found!')
                navigate('/products')
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.warning('Please login first!')
            navigate('/login')
            return
        }
        setAddingToCart(true)
        try {
            const res = await API.post('/cart/add', {
                productId: product.id,
                quantity
            })
            dispatch(setCart(res.data))
            toast.success('Added to cart! 🛒')
        } catch (err) {
            toast.error('Failed to add to cart!')
        } finally {
            setAddingToCart(false)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-2xl text-blue-600">Loading... ⏳</div>
        </div>
    )

    if (!product) return null

    return (
        <div className="max-w-5xl mx-auto py-10 px-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">

                    <img
                        src={product.imageUrl ||
                            'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full rounded-xl object-cover max-h-96"
                        onError={(e) =>
                            e.target.src = 'https://via.placeholder.com/400'}
                    />

                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-800">
                            {product.name}
                        </h1>
                        <p className="text-gray-500">{product.brand}</p>
                        <p className="text-gray-600">{product.description}</p>

                        <div className="flex items-center gap-3">
                            {product.discountPrice ? (
                                <>
                                    <span className="text-3xl font-bold
                                    text-green-600">
                                        ₹{product.discountPrice}
                                    </span>
                                    <span className="text-xl text-gray-400
                                    line-through">
                                        ₹{product.price}
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-bold
                                text-green-600">
                                    ₹{product.price}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-yellow-500 text-lg">⭐</span>
                            <span>{product.rating}
                            ({product.totalReviews} reviews)</span>
                        </div>

                        <p className={product.stockQuantity > 0 ?
                            'text-green-600 font-semibold' :
                            'text-red-500 font-semibold'}>
                            {product.stockQuantity > 0 ?
                                `In Stock (${product.stockQuantity} left)` :
                                'Out of Stock'}
                        </p>

                        <div className="flex items-center gap-4">
                            <label className="font-medium">Quantity:</label>
                            <div className="flex items-center border rounded-lg">
                                <button
                                    onClick={() =>
                                        setQuantity(q => Math.max(1, q - 1))}
                                    className="px-4 py-2 text-xl
                                    hover:bg-gray-100">
                                    -
                                </button>
                                <span className="px-4 py-2 font-bold">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(q =>
                                        Math.min(product.stockQuantity, q + 1))}
                                    className="px-4 py-2 text-xl
                                    hover:bg-gray-100">
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart ||
                                product.stockQuantity === 0}
                            className="w-full bg-blue-600 text-white py-3
                            rounded-xl font-bold text-lg hover:bg-blue-700
                            transition disabled:opacity-50">
                            {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail