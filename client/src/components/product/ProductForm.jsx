import React, { useState, useEffect } from 'react';
import { 
  PRODUCT_CATEGORIES, 
  PRODUCT_SIZES, 
  FIT_TYPES, 
  PATTERNS, 
  SLEEVE_TYPES, 
  COLLAR_TYPES, 
  GENDER_TYPES 
} from '../../constants/productConstants';
import { validateProductForm } from '../../utils/productHelpers';

const ProductForm = ({ product, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    totalPrice: '',
    sellingPrice: '',
    costPrice: '',
    category: '',
    sizes: [],
    fabricType: '',
    fitType: '',
    pattern: '',
    sleeveType: '',
    collarType: '',
    gender: '',
    color: '',
    stock: '',
    availableState: true,
    madeToOrder: false,
    popular: false,
    country: '',
    active: 'active',
    productCode: ''
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        totalPrice: product.totalPrice || '',
        sellingPrice: product.sellingPrice || '',
        costPrice: product.costPrice || '',
        category: product.category || '',
        sizes: product.sizes || [],
        fabricType: product.fabricType || '',
        fitType: product.fitType || '',
        pattern: product.pattern || '',
        sleeveType: product.sleeveType || '',
        collarType: product.collarType || '',
        gender: product.gender || '',
        color: product.color || '',
        stock: product.stock || '',
        availableState: product.availableState ?? true,
        madeToOrder: product.madeToOrder || false,
        popular: product.popular || false,
        country: product.country || '',
        active: product.active || 'active',
        productCode: product.productCode || ''
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateProductForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const submitData = new FormData();
    
    // Append form data
    Object.keys(formData).forEach(key => {
      if (key === 'sizes') {
        submitData.append(key, JSON.stringify(formData[key]));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Append images
    images.forEach(image => {
      submitData.append('images', image);
    });

    onSubmit(formData, submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Code *
            </label>
            <input
              type="text"
              name="productCode"
              value={formData.productCode}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.productCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product code"
            />
            {errors.productCode && <p className="text-red-500 text-sm mt-1">{errors.productCode}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full p-2 border rounded-md ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Pricing</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost Price *
            </label>
            <input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleInputChange}
              step="0.01"
              className={`w-full p-2 border rounded-md ${
                errors.costPrice ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.costPrice && <p className="text-red-500 text-sm mt-1">{errors.costPrice}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selling Price *
            </label>
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleInputChange}
              step="0.01"
              className={`w-full p-2 border rounded-md ${
                errors.sellingPrice ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Price *
            </label>
            <input
              type="number"
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleInputChange}
              step="0.01"
              className={`w-full p-2 border rounded-md ${
                errors.totalPrice ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.totalPrice && <p className="text-red-500 text-sm mt-1">{errors.totalPrice}</p>}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Product Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Category</option>
              {PRODUCT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Gender</option>
              {GENDER_TYPES.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fit Type *
            </label>
            <select
              name="fitType"
              value={formData.fitType}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.fitType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Fit Type</option>
              {FIT_TYPES.map(fit => (
                <option key={fit} value={fit}>{fit}</option>
              ))}
            </select>
            {errors.fitType && <p className="text-red-500 text-sm mt-1">{errors.fitType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pattern *
            </label>
            <select
              name="pattern"
              value={formData.pattern}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.pattern ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Pattern</option>
              {PATTERNS.map(pattern => (
                <option key={pattern} value={pattern}>{pattern}</option>
              ))}
            </select>
            {errors.pattern && <p className="text-red-500 text-sm mt-1">{errors.pattern}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleeve Type
            </label>
            <select
              name="sleeveType"
              value={formData.sleeveType}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Sleeve Type</option>
              {SLEEVE_TYPES.map(sleeve => (
                <option key={sleeve} value={sleeve}>{sleeve}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collar Type
            </label>
            <select
              name="collarType"
              value={formData.collarType}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Collar Type</option>
              {COLLAR_TYPES.map(collar => (
                <option key={collar} value={collar}>{collar}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fabric Type *
            </label>
            <input
              type="text"
              name="fabricType"
              value={formData.fabricType}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.fabricType ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Cotton, Polyester"
            />
            {errors.fabricType && <p className="text-red-500 text-sm mt-1">{errors.fabricType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.color ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter color"
            />
            {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Sizes *</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PRODUCT_SIZES.map(size => (
            <label key={size} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.sizes.includes(size)}
                onChange={() => handleSizeChange(size)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{size}</span>
            </label>
          ))}
        </div>
        {errors.sizes && <p className="text-red-500 text-sm mt-2">{errors.sizes}</p>}
      </div>

      {/* Inventory & Status */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Inventory & Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter country"
            />
            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="availableState"
                checked={formData.availableState}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Available for Sale</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="madeToOrder"
                checked={formData.madeToOrder}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Made to Order</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="popular"
                checked={formData.popular}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Mark as Popular</span>
            </label>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Product Images</h3>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <p className="text-sm text-gray-500 mt-2">
          Select multiple images for the product
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;