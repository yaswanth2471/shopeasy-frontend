import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import store from './redux/store'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Navbar />
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={
                        <ProtectedRoute><Cart /></ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                        <ProtectedRoute><Orders /></ProtectedRoute>
                    } />
                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
                    } />
                    <Route path="/admin/products" element={
                        <ProtectedRoute><AdminProducts /></ProtectedRoute>
                    } />
                    <Route path="/admin/categories" element={
                        <ProtectedRoute><AdminCategories /></ProtectedRoute>
                    } />
                    <Route path="/admin/orders" element={
                        <ProtectedRoute><AdminOrders /></ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}

export default App