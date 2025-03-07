import React from 'react'

function Navbar({ cartItemsCount, toggleCart }) {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">E-Commerce Stores</div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleCart}
            className="flex items-center space-x-1 bg-blue-700 px-3 py-2 rounded-md hover:bg-blue-800 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
              <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <span>Cart ({cartItemsCount})</span>
          </button> 
        </div>
      </div>
    </nav>
  )
}

export default Navbar 