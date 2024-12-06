// place order 

// {
//     customer: {
//       firstName: string,
//       lastName: string,
//       email: string,
//       address: string,
//       city: string,
//       state: string,
//       zipCode: string
//     },
//     items: [
//       {
//         id: string,
//         name: string,
//         price: number,
//         quantity: number
//       }
//     ],
//     totalAmount: number,
//     createdAt: timestamp,
//     status: string
//   }



import { getFirestore, collection, addDoc, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import app from '../firebaseConfig';

const db = getFirestore(app);

// Helper function to get customer's order count
async function getCustomerOrderCount(userId) {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size + 1; // Add 1 for the new order
  } catch (error) {
    console.error('Error getting customer order count:', error);
    throw error;
  }
}

// Helper function to generate product codes
function generateProductCodes(items) {
  return items.map(item => {
    // Get first two letters of product name, convert to lowercase
    const productCode = item.name.slice(0, 2).toLowerCase();
    return productCode;
  });
}

// Generate order code
async function generateOrderCode(userId, zipCode, countryCode, items, orderNumber, franchiseId) {
  try {
    // Format: cu5001phsn1fr000456
    // Get product codes
    const productCodes = generateProductCodes(items);
    
    // Format postal code - keep as is since it can be any format
    const postalCode = zipCode;
    
    // Country code is already in 2 letters format
    const country = countryCode.toLowerCase();
    
    // Combine all product codes
    const productCodesString = productCodes.join('');
    
    // Create the order code with franchise ID if present
    const franchisePart = franchiseId ? franchiseId : 'none';
    const orderCode = `cu${postalCode}${country}${productCodesString}${orderNumber}${franchisePart}`;
    
    return orderCode;
  } catch (error) {
    console.error('Error generating order code:', error);
    throw error;
  }
}

export const createOrder = async (orderData) => {
  try {
    const ordersCollection = collection(db, 'orders');
    
    // Get customer's order count
    const orderNumber = await getCustomerOrderCount(orderData.userId);
    
    // Generate order code
    const orderCode = await generateOrderCode(
      orderData.userId,
      orderData.shippingAddress.zipCode,
      orderData.shippingAddress.country,
      orderData.items,
      orderNumber,
      orderData.franchiseId
    );
    
    const orderWithTimestamp = {
      ...orderData,
      orderCode,
      orderNumber,
      createdAt: new Date(),
      status: 'pending',
      totalAmount: orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    };
    
    const docRef = await addDoc(ordersCollection, orderWithTimestamp);
    return { 
      orderId: docRef.id,
      orderCode,
      success: true 
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      return null;
    }
    
    return {
      id: orderDoc.id,
      ...orderDoc.data()
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const getOrdersByCode = async (orderCode, userId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('orderCode', '==', orderCode),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting order by code:', error);
    throw error;
  }
};
