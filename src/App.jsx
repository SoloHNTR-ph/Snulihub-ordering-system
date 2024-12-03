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
import Tracking from './pages/Tracking'
import UserConsole from './pages/UserConsole'
import { CartProvider } from './context/CartContext'

const DefaultLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col w-full">
    <Navbar />
    <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
      {children}
    </main>
    <Footer />
  </div>
);

const CheckoutLayout = ({ children }) => (
  <div className="min-h-screen w-full">
    {children}
  </div>
);

const TrackingLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col w-full">
    <main className="flex-grow w-full">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
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
            path="/order/:orderId/:userId"
            element={
              <TrackingLayout>
                <Tracking />
              </TrackingLayout>
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
                  <Route path="/admin/users" element={<UserConsole />} />
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
