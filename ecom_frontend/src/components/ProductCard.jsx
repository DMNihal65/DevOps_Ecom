import React from 'react'

function ProductCard({ product, addToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
        <p className="text-gray-500 text-sm mt-2">{product.description}</p>
        <button 
          onClick={addToCart}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard 