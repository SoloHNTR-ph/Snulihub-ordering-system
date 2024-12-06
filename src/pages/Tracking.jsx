import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MagnifyingGlassIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import app from '../firebaseConfig';

const Tracking = () => {
  const { customerUserId, orderCodeWithFranchise: orderCode } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending' or 'received'
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: ''
  });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      console.log('Fetching order with:', { customerUserId, orderCode });
      try {
        setLoading(true);
        const db = getFirestore(app);
        const ordersRef = collection(db, 'orders');
        
        // Query orders collection with both orderCode and userId for security
        const q = query(
          ordersRef,
          where('orderCode', '==', orderCode),
          where('userId', '==', customerUserId)
        );
        console.log('Executing query...');
        const querySnapshot = await getDocs(q);
        console.log('Query results:', querySnapshot.size);
        
        if (querySnapshot.empty) {
          console.log('No matching orders found');
          setError('Order not found');
          setLoading(false);
          return;
        }
        
        // Get the first matching order
        const orderDoc = querySnapshot.docs[0];
        const orderData = {
          id: orderDoc.id,
          ...orderDoc.data()
        };
        console.log('Order data:', orderData);
        
        // Verify this order belongs to the customer
        if (orderData.userId !== customerUserId) {
          console.log('Unauthorized: Order belongs to different user');
          setError('Unauthorized access');
          setLoading(false);
          return;
        }
        
        setOrder(orderData);
        setPaymentStatus(orderData.status || 'pending');
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Error fetching order details');
      } finally {
        setLoading(false);
      }
    };

    if (customerUserId && orderCode) {
      fetchOrder();
    } else {
      console.log('Missing required parameters:', { customerUserId, orderCode });
      setLoading(false);
    }
  }, [customerUserId, orderCode]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Handle password submission here
    setShowPasswordModal(false);
  };

  const steps = [
    { status: 'complete', title: 'Waiting for payment confirmation', description: 'Payment confirmation in progress' },
    { status: 'current', title: 'Processing order', description: 'Your order is being processed' },
    { status: 'upcoming', title: 'Order sent', description: 'Package is on the way' },
    { status: 'upcoming', title: "Order sent to customer's address", description: 'Package delivered to destination' },
  ];

  const handlePaymentSent = () => {
    setPaymentStatus('received');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              SnuliHub Store
            </Link>
            <div className="w-[600px]">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Search orders..."
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShowPasswordModal(true)} 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
            >
              <UserIcon className="h-5 w-5 mr-2" />
              Login
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 h-auto">
          <div className="text-center mb-8">     
            <h1 className="text-2xl font-semibold text-gray-900">Track Your Order</h1>
            <p className="mt-2 text-gray-600">Order ID: {orderCode || 'Not available'}</p>
          </div>

          <div className="flex justify-between items-start w-full mb-8 relative">
            {/* Add a background line that spans the entire width */}
            <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200" aria-hidden="true" />
            
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex flex-col items-center flex-1">
                <div className="relative">
                  <div className="flex items-center justify-center">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center">
                      {step.status === 'complete' ? (
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : step.status === 'current' ? (
                        <div className="h-8 w-8 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full border-2 border-gray-300 bg-white" />
                      )}
                    </span>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-sm font-medium text-gray-900">{step.title}</div>
                    <p className="text-sm text-gray-500 mt-1 max-w-[150px]">{step.description}</p>
                    {index === 0 && (
                      <div className="mt-4">
                        <div className="w-0.5 h-16 bg-gray-200 mx-auto" />
                        <div className="relative -mt-1">
                          <div className="relative flex flex-col items-center">
                            <span className="flex h-8 w-8 items-center justify-center">
                              {paymentStatus === 'pending' ? (
                                <div className="h-8 w-8 rounded-full border-2 border-yellow-500 bg-white flex items-center justify-center">
                                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                                </div>
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </span>
                            <div className="mt-3 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                              {paymentStatus === 'pending' ? (
                                <>
                                  <p className="text-yellow-600 font-medium text-sm">Pending Payment</p>
                                  <button
                                    onClick={handlePaymentSent}
                                    className="mt-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
                                  >
                                    Send Payment
                                  </button>
                                </>
                              ) : (
                                <p className="text-green-600 font-medium text-sm">Payment sent</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-fadeIn">            
            <XMarkIcon 
              className="h-5 w-5 absolute right-6 top-6 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" 
              onClick={() => setShowPasswordModal(false)}
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-8">Add a Password</h2>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={passwordForm.password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-xl border-0 bg-gray-100/50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  required
                  placeholder="Password"
                />
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-xl border-0 bg-gray-100/50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  required
                  placeholder="Confirm Password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                Set Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;
