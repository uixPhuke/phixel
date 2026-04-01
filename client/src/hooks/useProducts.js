import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllProducts,
  getProduct,
  getProductsAdmin,
  getProductAdmin,
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

  const navigate = useNavigate();
const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('newest');

  // User actions
  const fetchProducts = (queryParams = {}) => {
    dispatch(getAllProducts({ ...queryParams, ...filters, sort }));
  };

  const fetchProduct = (productID) => {
    return dispatch(getProduct(productID));
  };

  // Admin actions
  const fetchAdminProducts = () => {
    return dispatch(getProductsAdmin());
  };
const fetchProductAdmin = (productID) => {
  return dispatch(getProductAdmin(productID));
};

  const createProduct = (productData, formData, resetForm) => {
    return dispatch(addProduct(productData, formData, resetForm));
  };

  const updateProduct = (productID, productData, formData) => {
    return dispatch(updateProductAdmin(productID, productData, formData));
  };

  const deleteProduct = (productID) => {
    return dispatch(deleteProductAdmin(productID));
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
    fetchProductAdmin,
    
    // Helpers
    hasProducts: products.length > 0,
    hasAdminProducts: productsAdmin.length > 0,
  };
};