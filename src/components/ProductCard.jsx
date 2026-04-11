import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/products/${product.id}`)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl
            transition cursor-pointer overflow-hidden">

            <img
                src={product.imageUrl || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) =>
                    e.target.src = 'https://via.placeholder.com/300'}
            />

            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">
                    {product.name}
                </h3>
                <p className="text-gray-500 text-sm">{product.brand}</p>

                <div className="flex items-center gap-2 mt-2">
                    {product.discountPrice ? (
                        <>
                            <span className="text-green-600 font-bold text-lg">
                                ₹{product.discountPrice}
                            </span>
                            <span className="text-gray-400 line-through text-sm">
                                ₹{product.price}
                            </span>
                        </>
                    ) : (
                        <span className="text-green-600 font-bold text-lg">
                            ₹{product.price}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-yellow-500">⭐ {product.rating}</span>
                    <span className={`text-sm ${product.stockQuantity > 0 ?
                        'text-green-500' : 'text-red-500'}`}>
                        {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ProductCard