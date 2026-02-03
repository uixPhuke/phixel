import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllProducts, 
  getProduct, 
  getProductsAdmin,
  addProduct,
  updateProductAdmin,
  deleteProductAdmin 
} from '../actions/productActions';


export const useProducts = () => {
  const dispatch = useDispatch();
  const { 
    products, 
    product, 
    productsAdmin, 
    productAdmin, 
    loading, 
    error,
    pagination 
  } = useSelector(state => state.product);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('newest');

  // User actions
  const fetchProducts = (queryParams = {}) => {
    dispatch(getAllProducts({ ...queryParams, ...filters, sort }));
  };

  const fetchProduct = (productID) => {
    dispatch(getProduct(productID));
  };

  // Admin actions
  const fetchAdminProducts = () => {
    dispatch(getProductsAdmin());
  };

  const createProduct = (productData, formData, resetForm) => {
    dispatch(addProduct(productData, formData, resetForm));
  };

  const updateProduct = (productID, productData, formData) => {
    dispatch(updateProductAdmin(productID, productData, formData));
  };

  const deleteProduct = (productID) => {
    dispatch(deleteProductAdmin(productID));
  };

  // Filter and sort handlers
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const updateSort = (newSort) => {
    setSort(newSort);
  };

  return {
    // State
    products,
    product,
    productsAdmin,
    productAdmin,
    loading,
    error,
    pagination,
    filters,
    sort,
    
    // Actions
    fetchProducts,
    fetchProduct,
    fetchAdminProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateFilters,
    updateSort,
    
    // Helpers
    hasProducts: products.length > 0,
    hasAdminProducts: productsAdmin.length > 0,
  };
};