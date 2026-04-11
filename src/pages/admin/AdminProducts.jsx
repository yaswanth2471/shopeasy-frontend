import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../../api/axios'

const AdminProducts = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editProduct, setEditProduct] = useState(null)
    const [form, setForm] = useState({
        name: '', description: '', price: '',
        discountPrice: '', stockQuantity: '',
        brand: '', imageUrl: '', categoryId: ''
    })

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await API.get('/products')
            setProducts(res.data)
        } catch (err) {
            toast.error('Failed to load products!')
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await API.get('/categories')
            setCategories(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editProduct) {
                await API.put(`/products/${editProduct.id}`, form)
                toast.success('Product updated! ✅')
            } else {
                await API.post('/products', form)
                toast.success('Product added! ✅')
            }
            setShowForm(false)
            setEditProduct(null)
            resetForm()
            fetchProducts()
        } catch (err) {
            toast.error('Failed to save product!')
        }
    }

    const handleEdit = (product) => {
        setEditProduct(product)
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            discountPrice: product.discountPrice || '',
            stockQuantity: product.stockQuantity,
            brand: product.brand || '',
            imageUrl: product.imageUrl || '',
            categoryId: product.categoryId
        })
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return
        try {
            await API.delete(`/products/${id}`)
            toast.success('Product deleted!')
            fetchProducts()
        } catch (err) {
            toast.error('Failed to delete!')
        }
    }

    const resetForm = () => {
        setForm({
            name: '', description: '', price: '',
            discountPrice: '', stockQuantity: '',
            brand: '', imageUrl: '', categoryId: ''
        })
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
                        📦 Manage Products
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Total: {products.length} products
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/admin')}
                        className="bg-gray-500 text-white px-4 py-2
                        rounded-lg hover:bg-gray-600">
                        ← Back
                    </button>
                    <button
                        onClick={() => {
                            setShowForm(!showForm)
                            setEditProduct(null)
                            resetForm()
                        }}
                        className="bg-blue-600 text-white px-4 py-2
                        rounded-lg hover:bg-blue-700">
                        ➕ Add Product
                    </button>
                </div>
            </div>

            {/* Add/Edit Product Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">
                        {editProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <form onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            placeholder="Product Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({...form, name: e.target.value})}
                            required
                            className="border rounded-lg px-4 py-3
                            focus:outline-none focus:ring-2
                            focus:ring-blue-500"
                        />
                        <input
                            placeholder="Brand"
                            value={form.brand}
                            onChange={(e) =>
                                setForm({...form, brand: e.target.value})}
                            className="border rounded-lg px-4 py-3
                            focus:outline-none focus:ring-2
                            focus:ring-blue-500"
                        />
                        <input
                            placeholder="Price"
                            type="number"
                            value={form.price}
                            onChange={(e) =>
                                setForm({...form, price: e.target.value})}
                            required
                            className="border rounded-lg px-4 py-3
                            focus:outline-none focus:ring-2
                            focus:ring-blue-500"
                        />
                        <input
                            placeholder="Discount Price (optional)"
                            type="number"
                            value={form.discountPrice}
                            onChange={(e) =>
                                setForm({...form,
                                    discountPrice: e.target.value})}
                            className="border rounded-lg px-4 py-3
                            focus:outline-none focus:ring-2
                            focus:ring-blue-500"
                        />
                        <input
                            placeholder="Stock Quantity"
                            type="number"
                            value={form.stockQuantity}
                            onChange={(e) =>
                                setForm({...form,
                                    stockQuantity: e.target.value})}
                            required
                            className="border rounded-lg px-4 py-3
                            focus:outline-none focus:ring-2
                            focus:ring-blue-500"
                        />
                        <select
                            value={form.categoryId}
                            onChange={(e) =>
                                setForm({...form,
                                    categoryId: e.target.value})}
                            required
                            className="border rounded-lg px-4 py-3
                            focus:outline-none focus:ring-2
                            focus:ring-blue-500">
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <input
                            placeholder="Image URL"
                            value={form.imageUrl}
                            onChange={(e) =>
                                setForm({...form, imageUrl: e.target.value})}
                            className="border rounded-lg px-4 py-3
                            focus:outline-none focus:ring-2
                            focus:ring-blue-500 md:col-span-2"
                        />
                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({...form,
                                    description: e.target.value})}
                            rows={3}
                            className="border rounded-lg px-4 py-3
                            focus:outline-none focus:ring-2
                            focus:ring-blue-500 md:col-span-2"
                        />
                        <div className="flex gap-3 md:col-span-2">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6
                                py-2 rounded-lg hover:bg-blue-700
                                font-medium">
                                {editProduct ?
                                    'Update Product' : 'Save Product'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false)
                                    setEditProduct(null)
                                    resetForm()
                                }}
                                className="bg-gray-400 text-white px-6
                                py-2 rounded-lg hover:bg-gray-500">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-4 text-left text-gray-600">
                                Image
                            </th>
                            <th className="px-4 py-4 text-left text-gray-600">
                                Name
                            </th>
                            <th className="px-4 py-4 text-left text-gray-600">
                                Price
                            </th>
                            <th className="px-4 py-4 text-left text-gray-600">
                                Stock
                            </th>
                            <th className="px-4 py-4 text-left text-gray-600">
                                Category
                            </th>
                            <th className="px-4 py-4 text-left text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}
                                className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4">
                                    <img
                                        src={product.imageUrl ||
                                        'https://via.placeholder.com/50'}
                                        alt={product.name}
                                        className="w-12 h-12 rounded-lg
                                        object-cover"
                                        onError={(e) =>
                                            e.target.src =
                                            'https://via.placeholder.com/50'}
                                    />
                                </td>
                                <td className="px-4 py-4 font-semibold">
                                    {product.name}
                                </td>
                                <td className="px-4 py-4">
                                    <div>₹{product.price}</div>
                                    {product.discountPrice && (
                                        <div className="text-green-600
                                        text-sm">
                                            ₹{product.discountPrice}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`px-2 py-1 rounded-full
                                    text-sm ${product.stockQuantity > 0 ?
                                        'bg-green-100 text-green-700' :
                                        'bg-red-100 text-red-700'}`}>
                                        {product.stockQuantity}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-gray-500">
                                    {product.categoryName}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleEdit(product)}
                                            className="text-blue-500
                                            hover:text-blue-700 font-medium">
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(product.id)}
                                            className="text-red-500
                                            hover:text-red-700 font-medium">
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminProducts