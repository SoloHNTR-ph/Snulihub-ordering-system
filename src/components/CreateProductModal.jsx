import React, { useState } from 'react';
import { productService } from '../services/productService';
import '../styles/modal.css';

const CreateProductModal = ({ isOpen, onClose, onProductCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    features: '',
    tags: '',
    image: '',
    isFeatured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      features: '',
      tags: '',
      image: '',
      isFeatured: false
    });
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newProduct = await productService.createProduct(formData);
      resetForm();
      if (onProductCreated) {
        onProductCreated(newProduct);
      }
      onClose();
    } catch (err) {
      setError('Failed to create product. Please try again.');
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-backdrop bg-gray-900/50 overflow-y-auto h-full w-full z-50">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="modal-content relative w-full max-w-2xl bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h3 className="modal-title">Create New Product</h3>
            <p className="mt-2 text-gray-500">Fill in the details below to create a new product listing.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter product category"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input min-h-[120px]"
                    placeholder="Enter product description"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Features</label>
                  <input
                    type="text"
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Feature 1, Feature 2, ..."
                  />
                  <p className="mt-1 text-xs text-gray-500">Separate features with commas</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Tag 1, Tag 2, ..."
                  />
                  <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
                </div>

                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="custom-checkbox"
                  />
                  <label className="ml-3 text-sm text-gray-700">Featured Product</label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
