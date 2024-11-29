import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/Product_card';
import CreateProductModal from '../components/CreateProductModal';
import { productService } from '../services/productService';

const Products = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await productService.getAllProducts();
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductCreated = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-red-600 py-8">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/cart')}
            className="btn-secondary flex items-center gap-2"
          >
            Cart
            {cartItems.length > 0 && (
              <span className="bg-primary-600 text-white rounded-full px-2 py-1 text-sm">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            Add New Product
          </button>
        </div>
      </div>
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No products available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <CreateProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onProductCreated={handleProductCreated}
      />
    </div>
  );
};

export default Products;
