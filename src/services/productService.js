import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import app from '../firebaseConfig';

const db = getFirestore(app);
const PRODUCTS_COLLECTION = 'products';

export const productService = {
  // Create a new product
  async createProduct(productData) {
    try {
      // Prepare product data
      const finalProductData = {
        ...productData,
        price: parseFloat(productData.price),
        features: productData.features.split(',').map(f => f.trim()).filter(f => f),
        tags: productData.tags.split(',').map(t => t.trim()).filter(t => t),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), finalProductData);
      return { id: docRef.id, ...finalProductData };
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  },

  // Get all products
  async getAllProducts() {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const querySnapshot = await getDocs(productsRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
    } catch (error) {
      console.error('Error getting products:', error);
      throw new Error('Failed to fetch products');
    }
  },

  // Get featured products
  async getFeaturedProducts(limit = 10) {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(
        productsRef,
        where('isFeatured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
    } catch (error) {
      console.error('Error getting featured products:', error);
      throw new Error('Failed to fetch featured products');
    }
  },

  // Update a product
  async updateProduct(productId, updateData) {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);

      // Prepare update data
      const finalUpdateData = {
        ...updateData,
        updatedAt: serverTimestamp()
      };

      // Update in Firestore
      await updateDoc(productRef, finalUpdateData);
      return { id: productId, ...finalUpdateData };
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  },

  // Delete a product
  async deleteProduct(productId) {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      await deleteDoc(productRef);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }
};
