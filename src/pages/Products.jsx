import React from 'react'
import { useState, useEffect } from 'react'
import API from '../api/axios'
import ProductCard from '../components/ProductCard'

const Products = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await API.get('/products')
            setProducts(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e) => {
        setSearch(e.target.value)
        if (e.target.value.trim() === '') {
            fetchProducts()
            return
        }
        try {
            const res = await API.get(
                `/products/search?keyword=${e.target.value}`)
            setProducts(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-2xl text-blue-600">Loading products... ⏳</div>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
                All Products 🛍️
            </h2>

            <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-xl px-5 py-3
                mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />

            {products.length === 0 ? (
                <div className="text-center text-gray-500 text-xl py-20">
                    No products found 😕
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2
                md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Products