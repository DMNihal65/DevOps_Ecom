import React from 'react'

function Cart({ items, removeFromCart }) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-16 h-16 object-cover rounded"
              />
              <div className="ml-4">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-gray-500">${item.price.toFixed(2)} x {item.quantity}</p>
              </div>
            </div>
            <button 
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
          Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart 