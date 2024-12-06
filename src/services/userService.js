import { 
  collection, 
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  runTransaction,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const USERS_COLLECTION = 'users';
const COUNTERS_COLLECTION = 'counters';
const CUSTOMER_COUNTER_DOC = 'customerCounter';
const FRANCHISE_COUNTER_DOC = 'franchiseCounter';

export const userService = {
  // Generate next user ID based on category
  async generateNextUserId(category = 'cu') {
    const counterDoc = category === 'cu' ? CUSTOMER_COUNTER_DOC : FRANCHISE_COUNTER_DOC;
    const counterRef = doc(db, COUNTERS_COLLECTION, counterDoc);

    try {
      return await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        
        let nextNumber;
        if (!counterDoc.exists()) {
          // Initialize counter if it doesn't exist
          nextNumber = 1;
        } else {
          nextNumber = counterDoc.data().currentCount + 1;
        }

        // Update the counter
        transaction.set(counterRef, { currentCount: nextNumber });

        // Format the user ID with leading zeros (6 digits)
        return `${category}${String(nextNumber).padStart(6, '0')}`;
      });
    } catch (error) {
      console.error('Error generating user ID:', error);
      throw new Error(`Failed to generate user ID: ${error.message}`);
    }
  },

  // Detect user category from ID
  detectCategory(userId) {
    if (!userId) return null;
    if (userId.startsWith('cu')) return 'customer';
    if (userId.startsWith('fr')) return 'franchise';
    return null;
  },

  // Create a new user
  async createUser(userData) {
    try {
      console.log('8. UserService received userData:', {
        primaryPhone: userData.primaryPhone,
        secondaryPhone: userData.secondaryPhone
      });

      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Generate user ID (default to customer)
      const userId = await this.generateNextUserId('cu');
      
      // Create user document with explicit phone numbers
      const userDoc = {
        ...userData,
        primaryPhone: userData.primaryPhone || '',
        secondaryPhone: userData.secondaryPhone || '',
        id: userId,
        userId: userId,
        category: this.detectCategory(userId),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('9. Final userDoc before Firestore:', {
        primaryPhone: userDoc.primaryPhone,
        secondaryPhone: userDoc.secondaryPhone
      });

      const userRef = doc(db, USERS_COLLECTION, userId);
      await setDoc(userRef, userDoc);

      // Verify the data was stored correctly
      const storedUser = await getDoc(userRef);
      console.log('10. Stored user data:', {
        primaryPhone: storedUser.data().primaryPhone,
        secondaryPhone: storedUser.data().secondaryPhone
      });

      return { userId, success: true };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  // Update user data
  async updateUser(userId, updateData) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      
      // Ensure we don't override the category based on ID
      const category = this.detectCategory(userId);
      if (category) {
        updateData.category = category;
      }

      await updateDoc(userRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }
  },

  // Update user's active status
  async updateUserActiveStatus(userId, isActive) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        isActive: isActive,
        lastActiveAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user active status:', error);
      throw new Error(`Failed to update user active status: ${error.message}`);
    }
  },

  // Upgrade customer to franchise
  async upgradeToFranchise(userId) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const currentCategory = this.detectCategory(userId);

      // Only allow upgrading customers
      if (currentCategory !== 'customer') {
        throw new Error('Only customers can be upgraded to franchise');
      }

      // Check if this customer was previously a franchise
      let newFranchiseId;
      if (userData.previousFranchiseId && userData.previousFranchiseId.startsWith('fr')) {
        newFranchiseId = userData.previousFranchiseId;
      } else {
        newFranchiseId = await this.generateNextUserId('fr');
      }

      // Create new franchise user with old data
      const newUserRef = doc(db, USERS_COLLECTION, newFranchiseId);
      const updatedUserData = {
        ...userData,
        id: newFranchiseId,
        userId: newFranchiseId,
        category: this.detectCategory(newFranchiseId),
        previousId: userId,
        previousFranchiseId: null,
        updatedAt: serverTimestamp()
      };

      await runTransaction(db, async (transaction) => {
        const oldUserDoc = await transaction.get(userRef);
        if (!oldUserDoc.exists()) {
          throw new Error('Original user no longer exists');
        }
        transaction.set(newUserRef, updatedUserData);
        transaction.delete(userRef);
      });

      return { userId: newFranchiseId, success: true };
    } catch (error) {
      console.error('Error upgrading user to franchise:', error);
      throw new Error(`Failed to upgrade user to franchise: ${error.message}`);
    }
  },

  // Revert franchise back to customer
  async revertToCustomer(userId) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const currentCategory = this.detectCategory(userId);

      // Only allow reverting franchises
      if (currentCategory !== 'franchise') {
        throw new Error('Only franchises can be reverted to customer');
      }

      // Check if we have the original customer ID
      if (!userData.previousId || !userData.previousId.startsWith('cu')) {
        throw new Error('Original customer ID not found or invalid');
      }

      const originalCustomerId = userData.previousId;

      // Create new customer user with old data
      const newUserRef = doc(db, USERS_COLLECTION, originalCustomerId);
      const updatedUserData = {
        ...userData,
        id: originalCustomerId,
        userId: originalCustomerId,
        category: this.detectCategory(originalCustomerId),
        previousFranchiseId: userId,
        previousId: null,
        updatedAt: serverTimestamp()
      };

      await runTransaction(db, async (transaction) => {
        const oldUserDoc = await transaction.get(userRef);
        if (!oldUserDoc.exists()) {
          throw new Error('Original user no longer exists');
        }
        transaction.set(newUserRef, updatedUserData);
        transaction.delete(userRef);
      });

      return { userId: originalCustomerId, success: true };
    } catch (error) {
      console.error('Error reverting user to customer:', error);
      throw new Error(`Failed to revert user to customer: ${error.message}`);
    }
  },

  // Get user by email
  async getUserByEmail(email) {
    if (!email) {
      console.error('Email is required');
      throw new Error('Email is required');
    }

    try {
      console.log('Querying Firestore for email:', email);
      const q = query(
        collection(db, USERS_COLLECTION),
        where('email', '==', email.toLowerCase())
      );
      
      const querySnapshot = await getDocs(q);
      console.log('Query snapshot:', querySnapshot.size, 'documents found');
      
      if (querySnapshot.empty) {
        console.log('No user found with email:', email);
        return null;
      }

      const doc = querySnapshot.docs[0];
      const userData = {
        id: doc.id,
        ...doc.data()
      };
      console.log('User data retrieved:', { id: userData.id, email: userData.email });
      
      return userData;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw new Error(`Failed to get user: ${error.message}`);
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return null;
      }

      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw new Error(`Failed to get user: ${error.message}`);
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const usersRef = collection(db, USERS_COLLECTION);
      const querySnapshot = await getDocs(usersRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error(`Failed to get all users: ${error.message}`);
    }
  }
};

export default userService;
