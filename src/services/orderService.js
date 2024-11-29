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



import { getFirestore, collection, addDoc } from 'firebase/firestore';
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
    return { success: true, orderId: docRef.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
};
