import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../../api/axios'

const AdminCategories = () => {
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        name: '', description: '', imageUrl: ''
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await API.get('/categories')
            setCategories(res.data)
        } catch (err) {
            toast.error('Failed to load categories!')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await API.post('/categories', form)
            toast.success('Category added! ✅')
            setShowForm(false)
            setForm({ name: '', description: '', imageUrl: '' })
            fetchCategories()
        } catch (err) {
            toast.error('Failed to add category!')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return
        try {
            await API.delete(`/categories/${id}`)
            toast.success('Category deleted!')
            fetchCategories()
        } catch (err) {
            toast.error('Failed to delete!')
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-2xl text-blue-600">Loading... ⏳</div>
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto py-10 px-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                        🗂️ Manage Categories
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Total: {categories.length} categories
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
                        onClick={() => setShowForm(!showForm)}
                        className="bg-green-600 text-white px-4 py-2
                        rounded-lg hover:bg-green-700">
                        ➕ Add Category
                    </button>
                </div>
            </div>

            {/* Add Category Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">
                        Add New Category
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            placeholder="Category Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({...form, name: e.target.value})}
                            required
                            className="w-full border rounded-lg px-4 py-3
                            focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({...form, description: e.target.value})}
                            className="w-full border rounded-lg px-4 py-3
                            focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            placeholder="Image URL (optional)"
                            value={form.imageUrl}
                            onChange={(e) =>
                                setForm({...form, imageUrl: e.target.value})}
                            className="w-full border rounded-lg px-4 py-3
                            focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6
                                py-2 rounded-lg hover:bg-green-700 font-medium">
                                Save Category
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="bg-gray-400 text-white px-6
                                py-2 rounded-lg hover:bg-gray-500">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-gray-600">
                                ID
                            </th>
                            <th className="px-6 py-4 text-left text-gray-600">
                                Name
                            </th>
                            <th className="px-6 py-4 text-left text-gray-600">
                                Description
                            </th>
                            <th className="px-6 py-4 text-left text-gray-600">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id}
                                className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500">
                                    #{cat.id}
                                </td>
                                <td className="px-6 py-4 font-semibold">
                                    {cat.name}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {cat.description}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-green-100
                                    text-green-700 px-3 py-1 rounded-full
                                    text-sm">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="text-red-500
                                        hover:text-red-700 font-medium">
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminCategories