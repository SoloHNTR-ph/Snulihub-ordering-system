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



import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import app from '../firebaseConfig';

const db = getFirestore(app);

export const createOrder = async (orderData) => {
  try {
    const ordersCollection = collection(db, 'orders');
    const orderWithTimestamp = {
      ...orderData,
      createdAt: new Date(),
      status: 'pending'
    };
    
    const docRef = await addDoc(ordersCollection, orderWithTimestamp);
    return { orderId: docRef.id, success: true };
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
