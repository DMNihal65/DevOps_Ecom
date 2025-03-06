import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    const mockProducts = [
      {
        id: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        image: 'https://via.placeholder.com/300x200?text=Headphones',
        description: 'High-quality wireless headphones with noise cancellation.'
      },
      {
        id: 2,
        name: 'Smartphone',
        price: 699.99,
        image: 'https://via.placeholder.com/300x200?text=Smartphone',
        description: 'Latest model with high-resolution camera and fast processor.'
      },
      {
        id: 3,
        name: 'Laptop',
        price: 1299.99,
        image: 'https://via.placeholder.com/300x200?text=Laptop',
        description: 'Powerful laptop for work and gaming with long battery life.'
      },
      {
        id: 4,
        name: 'Smartwatch',
        price: 249.99,
        image: 'https://via.placeholder.com/300x200?text=Smartwatch',
        description: 'Track your fitness and stay connected with this smartwatch.'
      },
      {
        id: 5,
        name: 'Wireless Earbuds',
        price: 129.99,
        image: 'https://via.placeholder.com/300x200?text=Earbuds',
        description: 'Compact earbuds with amazing sound quality and long battery life.'
      },
      {
        id: 6,
        name: 'Tablet',
        price: 349.99,
        image: 'https://via.placeholder.com/300x200?text=Tablet',
        description: 'Perfect for entertainment and productivity on the go.'
      }
    ]
    
    setProducts(mockProducts)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">Loading products...</div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            addToCart={() => addToCart(product)} 
          />
        ))}
      </div>
    </div>
  )
}

export default ProductList 