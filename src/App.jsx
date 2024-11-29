import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import { CartProvider } from './context/CartContext'

const DefaultLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main className="container mx-auto px-4 py-8 flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

const CheckoutLayout = ({ children }) => (
  <div className="min-h-screen">
    {children}
  </div>
);

function App() {
  const [count, setCount] = useState(0)

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route
            path="/checkout"
            element={
              <CheckoutLayout>
                <Checkout />
              </CheckoutLayout>
            }
          />
          <Route
            path="*"
            element={
              <DefaultLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/cart" element={<Cart />} />
                </Routes>
              </DefaultLayout>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App
