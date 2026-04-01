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

      setImages(product.images || []);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeChange = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
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

    Object.keys(formData).forEach((key) => {
      if (key === 'sizes') {
        submitData.append(key, JSON.stringify(formData[key]));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    images.forEach((image) => {
      submitData.append('images', image);
    });

    onSubmit(formData, submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">
          {product ? 'Edit Product' : 'Add New Product'}
        </h1>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="border px-6 py-3 rounded-full"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-300 px-6 py-3 rounded-full font-semibold"
          >
            {loading
              ? 'Saving...'
              : product
              ? 'Update Product'
              : 'Add Product'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="col-span-2 space-y-6">
          {/* GENERAL INFO */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-md font-semibold mb-6">
              General Information
            </h2>

            <div className="space-y-5">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Product Title"
                className="w-full bg-gray-50 rounded-xl p-4"
              />

              <textarea
                rows={6}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full bg-gray-50 rounded-xl p-4 resize-none"
              />

              {/* SIZE + GENDER */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="mb-3 font-medium">Size</p>

                  <div className="flex gap-3 flex-wrap">
                    {PRODUCT_SIZES.map((size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        className={`px-5 py-3 rounded-lg ${
                          formData.sizes.includes(size)
                            ? 'bg-green-300'
                            : 'bg-gray-100'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 font-medium">Gender</p>

                  <div className="flex gap-4">
                    {GENDER_TYPES.map((gender) => (
                      <label key={gender} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={handleInputChange}
                        />
                        {gender}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRICING */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-md font-semibold mb-6">
              Pricing And Stock
            </h2>

            <div className="grid grid-cols-2 gap-5">
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleInputChange}
                placeholder="Cost Price"
                className="bg-gray-50 rounded-xl p-4"
              />

              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                placeholder="Selling Price"
                className="bg-gray-50 rounded-xl p-4"
              />

              <input
                type="number"
                name="totalPrice"
                value={formData.totalPrice}
                onChange={handleInputChange}
                placeholder="Total Price"
                className="bg-gray-50 rounded-xl p-4"
              />

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="Stock"
                className="bg-gray-50 rounded-xl p-4"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* IMAGES */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-md font-semibold mb-5">Upload Images</h2>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-gray-50 rounded-xl p-4"
            />

            <div className="flex gap-3 mt-4 flex-wrap">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img.url || URL.createObjectURL(img)}
                  alt=""
                  className="w-20 h-20 rounded-xl object-cover"
                />
              ))}
            </div>
          </div>

          {/* CATEGORY */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full bg-gray-50 rounded-xl p-4"
            >
              <option value="">Select Category</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* EXTRA DETAILS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <input
              type="text"
              name="fabricType"
              value={formData.fabricType}
              onChange={handleInputChange}
              placeholder="Fabric Type"
              className="w-full bg-gray-50 rounded-xl p-4"
            />

            <select
              name="fitType"
              value={formData.fitType}
              onChange={handleInputChange}
              className="w-full bg-gray-50 rounded-xl p-4"
            >
              <option value="">Fit Type</option>
              {FIT_TYPES.map((fit) => (
                <option key={fit} value={fit}>
                  {fit}
                </option>
              ))}
            </select>

            <select
              name="pattern"
              value={formData.pattern}
              onChange={handleInputChange}
              className="w-full bg-gray-50 rounded-xl p-4"
            >
              <option value="">Pattern</option>
              {PATTERNS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="sleeveType"
              value={formData.sleeveType}
              onChange={handleInputChange}
              className="w-full bg-gray-50 rounded-xl p-4"
            >
              <option value="">Sleeve Type</option>
              {SLEEVE_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="collarType"
              value={formData.collarType}
              onChange={handleInputChange}
              className="w-full bg-gray-50 rounded-xl p-4"
            >
              <option value="">Collar Type</option>
              {COLLAR_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Color"
              className="w-full bg-gray-50 rounded-xl p-4"
            />

            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Country"
              className="w-full bg-gray-50 rounded-xl p-4"
            />

            <input
              type="text"
              name="productCode"
              value={formData.productCode}
              onChange={handleInputChange}
              placeholder="Product Code"
              className="w-full bg-gray-50 rounded-xl p-4"
            />

            <select
              name="active"
              value={formData.active}
              onChange={handleInputChange}
              className="w-full bg-gray-50 rounded-xl p-4"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="availableState"
                checked={formData.availableState}
                onChange={handleInputChange}
              />
              Available
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="madeToOrder"
                checked={formData.madeToOrder}
                onChange={handleInputChange}
              />
              Made To Order
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="popular"
                checked={formData.popular}
                onChange={handleInputChange}
              />
              Popular Product
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;