import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  if (!product) {
    return null;
  }

  const { 
    id, 
    image, 
    name, 
    description, 
    category, 
    features = [], 
    tags = [], 
    isFeatured, 
    price 
  } = product;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div key={id} className="card group">
      <div className="w-[250px] h-[150px] overflow-hidden rounded-lg mx-auto bg-gray-200 flex items-center justify-center">
        {!imageError ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <span className="text-gray-400">Image not available</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="heading-medium">{name || 'Unnamed Product'}</h3>
        <p className="mt-1 text-sm text-gray-500">{description || 'No description available'}</p>
        <p className="mt-1 text-sm text-gray-500">Category: {category || 'N/A'}</p>
        <p className="mt-1 text-sm text-gray-500">Features: {features.length ? features.join(', ') : 'N/A'}</p>
        <p className="mt-1 text-sm text-gray-500">Tags: {tags.length ? tags.join(', ') : 'N/A'}</p>
        <p className="mt-1 text-sm text-gray-500">Is Featured: {isFeatured ? 'Yes' : 'No'}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900">
            ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
          </p>
          <button 
            className="btn-primary"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
