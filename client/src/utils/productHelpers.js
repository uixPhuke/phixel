import { PRODUCT_CATEGORIES, PRODUCT_SIZES, FIT_TYPES, PATTERNS, SLEEVE_TYPES, COLLAR_TYPES, GENDER_TYPES } from '../constants/productConstants';

export const validateProductForm = (formData) => {
  const errors = {};

  if (!formData.title?.trim()) errors.title = 'Title is required';
  if (!formData.description?.trim()) errors.description = 'Description is required';
  if (!formData.totalPrice || formData.totalPrice < 0) errors.totalPrice = 'Valid total price is required';
  if (!formData.sellingPrice || formData.sellingPrice < 0) errors.sellingPrice = 'Valid selling price is required';
  if (!formData.costPrice || formData.costPrice < 0) errors.costPrice = 'Valid cost price is required';
  if (!formData.category) errors.category = 'Category is required';
  if (!formData.fabricType?.trim()) errors.fabricType = 'Fabric type is required';
  if (!formData.fitType) errors.fitType = 'Fit type is required';
  if (!formData.pattern) errors.pattern = 'Pattern is required';
  if (!formData.gender) errors.gender = 'Gender is required';
  if (!formData.color?.trim()) errors.color = 'Color is required';
  if (!formData.stock || formData.stock < 0) errors.stock = 'Valid stock quantity is required';
  if (!formData.country?.trim()) errors.country = 'Country is required';
  if (!formData.productCode?.trim()) errors.productCode = 'Product code is required';
  if (!formData.sizes?.length) errors.sizes = 'At least one size is required';

  return errors;
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

export const getProductStatus = (product) => {
  if (!product.availableState) return 'Out of Stock';
  if (product.madeToOrder) return 'Made to Order';
  if (product.stock === 0) return 'Out of Stock';
  if (product.stock < 10) return 'Low Stock';
  return 'In Stock';
};

export const filterProducts = (products, filters) => {
  return products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.gender && product.gender !== filters.gender) return false;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (product.sellingPrice < min || product.sellingPrice > max) return false;
    }
    if (filters.size && !product.sizes.includes(filters.size)) return false;
    if (filters.inStock && product.stock === 0) return false;
    return true;
  });
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price':
      return sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'newest':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};