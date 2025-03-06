import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'
import Cart from './components/Cart'

function App() {
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id ? {...item, quantity: item.quantity + 1} : item
      ))
    } else {
      setCartItems([...cartItems, {...product, quantity: 1}])
    }
  }

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId))
  }

  const toggleCart = () => {
    setShowCart(!showCart)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar cartItemsCount={cartItems.reduce((total, item) => total + item.quantity, 0)} toggleCart={toggleCart} />
      <main className="container mx-auto py-8 px-4">
        {showCart ? (
          <Cart items={cartItems} removeFromCart={removeFromCart} />
        ) : (
          <ProductList addToCart={addToCart} />
        )}
      </main>
    </div>
  )
}

export default App
