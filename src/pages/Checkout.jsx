import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const orderData = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      },
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: total
    };

    try {
      const result = await createOrder(orderData);
      if (result.success) {
        clearCart();
        navigate('/products');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">Your cart is empty</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full p-3">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-3 fade-in-up">
          Checkout
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-[calc(100%-2rem)]">
          {/* Checkout Form */}
          <div className="fade-in-up">
            <div className="backdrop-blur-lg bg-white/80 p-3 rounded-xl shadow-xl border border-gray-100 gap-5">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Checkout Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="peer w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all duration-200 bg-white pt-4 text-black"
                      required
                      placeholder=" "
                    />
                    <label htmlFor="firstName" className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">First Name</label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="peer w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all duration-200 bg-white pt-4 text-black"
                      required
                      placeholder=" "
                    />
                    <label htmlFor="lastName" className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Last Name</label>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="peer w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all duration-200 bg-white pt-4 text-black"
                    required
                    placeholder=" "
                  />
                  <label htmlFor="email" className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Email</label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="peer w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all duration-200 bg-white pt-4 text-black"
                    required
                    placeholder=" "
                  />
                  <label htmlFor="address" className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Address</label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="peer w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all duration-200 bg-white pt-4 text-black"
                      required
                      placeholder=" "
                    />
                    <label htmlFor="city" className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">City</label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="peer w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all duration-200 bg-white pt-4 text-black"
                      required
                      placeholder=" "
                    />
                    <label htmlFor="state" className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">State</label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="peer w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all duration-200 bg-white pt-4 text-black"
                      required
                      placeholder=" "
                    />
                    <label htmlFor="zipCode" className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">ZIP Code</label>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Payment Details</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="peer w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all duration-200 bg-white pt-4 text-black"
                        required
                        placeholder=" "
                      />
                      <label htmlFor="cardNumber" className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Card Number</label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          name="expiryDate"
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className="peer w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all duration-200 bg-white pt-4 text-black"
                          required
                          placeholder=" "
                        />
                        <label htmlFor="expiryDate" className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">MM/YY</label>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="cvv"
                          id="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="peer w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all duration-200 bg-white pt-4 text-black"
                          required
                          placeholder=" "
                        />
                        <label htmlFor="cvv" className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">CVV</label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 mt-4"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="fade-in-right">
            <div className="backdrop-blur-lg bg-white/80 p-3 rounded-xl shadow-xl border border-gray-100 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Order Summary</h2>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 py-2 border-b border-gray-200">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover transform hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-primary-600 font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-medium">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 text-gray-900">
                  <span>Total</span>
                  <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-primary-100 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900">Secure Checkout</p>
                    <p className="text-xs text-gray-500">Your data is protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
