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
import CustomerDashboard from './pages/CustomerDashboard'
import FranchiseDashboard from './pages/FranchiseDashboard'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute';

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
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route
              path="/checkout"
              element={
                <CheckoutLayout>
                  <ProtectedRoute requiredRole="non-franchise">
                    <Checkout />
                  </ProtectedRoute>
                </CheckoutLayout>
              }
            />
            <Route
              path="/order/:customerUserId/:orderCodeWithFranchise"
              element={
                <TrackingLayout>
                  <Tracking />
                </TrackingLayout>
              }
            />
            <Route
              path="/customer-dashboard"
              element={
                <DefaultLayout>
                  <ProtectedRoute requiredRole="customer">
                    <CustomerDashboard />
                  </ProtectedRoute>
                </DefaultLayout>
              }
            />
            <Route
              path="/franchise-dashboard"
              element={
                <DefaultLayout>
                  <ProtectedRoute requiredRole="franchise">
                    <FranchiseDashboard />
                  </ProtectedRoute>
                </DefaultLayout>
              }
            />
            <Route
              path="*"
              element={
                <DefaultLayout>
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <ProtectedRoute requiredRole="non-franchise">
                          <Home />
                        </ProtectedRoute>
                      } 
                    />
                    {/* Commented out Cart and Products routes
                    <Route 
                      path="/products" 
                      element={
                        <ProtectedRoute requiredRole="non-franchise">
                          <Products />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/cart" 
                      element={
                        <ProtectedRoute requiredRole="non-franchise">
                          <Cart />
                        </ProtectedRoute>
                      } 
                    />
                    */}
                    <Route 
                      path="/admin/users" 
                      element={
                        <ProtectedRoute requiredRole="non-franchise">
                          <UserConsole />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </DefaultLayout>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
