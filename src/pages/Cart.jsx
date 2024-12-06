import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h2>
      {totalItems > 0 && (
        <p className="text-gray-600 mb-8">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      )}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-500">Loading your cart...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {cartItems.map((item) => (
            <div key={item.id} className="card flex items-center">
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-24 object-cover rounded-md"
              />
              <div className="ml-6 flex-1">
                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                </p>
                <div className="mt-2 flex items-center">
                  <button 
                    className="btn-primary px-2 py-1"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="mx-4">{item.quantity}</span>
                  <button 
                    className="btn-primary px-2 py-1"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button 
                className="text-red-600 hover:text-red-800"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="card mt-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-medium text-gray-900">Total ({totalItems} {totalItems === 1 ? 'item' : 'items'}):</span>
              </div>
              <span className="text-2xl font-bold text-primary-600">${total.toFixed(2)}</span>
            </div>
            <button 
              className="btn-primary w-full mt-4"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
