import React, { useState, useEffect } from 'react';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import app from '../firebaseConfig';
import { userService } from '../services/userService';
import CreateProductModal from '../components/CreateProductModal';

const db = getFirestore(app);

const UserConsole = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    category: 'customer'
  });
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
      setLoading(false);
    } catch (err) {
      setError('Error fetching users: ' + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await userService.createUser(newUser);
      setNewUser({ email: '', firstName: '', lastName: '', phone: '', category: 'customer' });
      fetchUsers();
    } catch (err) {
      setError('Error creating user: ' + err.message);
    }
  };

  // Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'users', editingUser.id);
      
      // Create an update object only with defined values
      const updateData = {};
      
      if (editingUser.email) updateData.email = editingUser.email;
      if (editingUser.firstName) updateData.firstName = editingUser.firstName;
      if (editingUser.lastName) updateData.lastName = editingUser.lastName;
      if (editingUser.phone) updateData.phone = editingUser.phone;
      if (editingUser.category) updateData.category = editingUser.category;
      
      // Always add updatedAt
      updateData.updatedAt = new Date();

      await updateDoc(userRef, updateData);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError('Error updating user: ' + err.message);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const userRef = doc(db, 'users', userId);
        await deleteDoc(userRef);
        fetchUsers();
      } catch (err) {
        setError('Error deleting user: ' + err.message);
      }
    }
  };

  // Upgrade user to franchise
  const handleUpgradeToFranchise = async (userId) => {
    if (window.confirm('Are you sure you want to upgrade this user to franchise? This will create a new franchise account and transfer all data.')) {
      try {
        await userService.upgradeToFranchise(userId);
        fetchUsers();
      } catch (err) {
        setError('Error upgrading user: ' + err.message);
      }
    }
  };

  // Revert franchise to customer
  const handleRevertToCustomer = async (userId) => {
    if (window.confirm('Are you sure you want to revert this franchise back to customer? This will create a new customer account and transfer all data.')) {
      try {
        await userService.revertToCustomer(userId);
        fetchUsers();
      } catch (err) {
        setError('Error reverting user: ' + err.message);
      }
    }
  };

  // Handle product creation success
  const handleProductCreated = (newProduct) => {
    // You can add additional logic here if needed
    setIsProductModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management Console</h1>
        <button
          onClick={() => setIsProductModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Product
        </button>
      </div>

      {/* Create New User Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Phone"
              value={newUser.phone}
              onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <select
              value={newUser.category}
              onChange={(e) => setNewUser({...newUser, category: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="customer">Customer</option>
              <option value="franchise">Franchise</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create User
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Users List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.primaryPhone || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.category === 'franchise' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.category}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingUser({
                          id: user.id,
                          email: user.email || '',
                          firstName: user.firstName || '',
                          lastName: user.lastName || '',
                          phone: user.phone || '',
                          category: user.category || 'customer'
                        })}
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      {user.category === 'customer' && (
                        <button
                          onClick={() => handleUpgradeToFranchise(user.id)}
                          className="bg-purple-500 text-white px-2 py-1 rounded text-sm hover:bg-purple-600 whitespace-nowrap"
                        >
                          Upgrade
                        </button>
                      )}
                      {user.category === 'franchise' && (
                        <button
                          onClick={() => handleRevertToCustomer(user.id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 whitespace-nowrap"
                        >
                          Revert
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)}
        onProductCreated={handleProductCreated}
      />
    </div>
  );
};

export default UserConsole;
