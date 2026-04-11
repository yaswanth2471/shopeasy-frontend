import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/authSlice'
import { clearCart } from '../redux/cartSlice'

const Navbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isAuthenticated, user } = useSelector(state => state.auth)
    const { totalItems } = useSelector(state => state.cart)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(clearCart())
        navigate('/login')
    }

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
            <Link to="/" className="text-2xl font-bold">🛒 ShopEasy</Link>

            <div className="flex items-center gap-6">
                <Link to="/products" className="hover:text-blue-200">Products</Link>

                {isAuthenticated ? (
                    <>
                    {user?.role === 'ADMIN' && (
      <Link 
        to="/admin"
        className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-medium"
      >
        🛠️ Admin
      </Link>
    )}
                        <Link to="/cart" className="hover:text-blue-200">
                            Cart 🛒 {totalItems > 0 &&
                                <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                                    {totalItems}
                                </span>}
                        </Link>
                        <Link to="/orders" className="hover:text-blue-200">Orders</Link>
                        <span className="text-blue-200">Hi, {user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login"
                            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50">
                            Login
                        </Link>
                        <Link to="/register"
                            className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar