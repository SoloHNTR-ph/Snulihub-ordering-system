import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'

export default function Navbar() {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { currentUser, logout, isCustomer, isFranchise } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goToDashboard = () => {
    if (isCustomer) {
      navigate('/customer-dashboard');
    } else if (isFranchise) {
      navigate('/franchise-dashboard');
    }
  };

  return (
    <nav className="bg-white shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            SnuliHub Store
          </Link>
          
          <div className="flex items-center space-x-8">
            {(!currentUser || !isFranchise) && (
              <>
                <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Home
                </Link>
                <Link to="/products" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Products
                </Link>
              </>
            )}
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={goToDashboard}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                <UserIcon className="h-6 w-6" />
              </button>
            )}

            {(!currentUser || !isFranchise) && (
              <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors">
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
    </nav>
  )
}
