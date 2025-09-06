import axios from "axios";
import {
  productRequest,
  getProductsSuccess,
  getProductSuccess,
  getProductsAdminSuccess,
  getProductAdminSuccess,
  createProductSuccess,
  updateProductAdminSuccess,
  deleteProductAdminSuccess,
  productFail
} from "../slices/productSlice";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_KEY;

// Helper function to get auth config
const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }
});

// Admin Route - Create Product
export const addProduct = (productData, formData, resetForm) => async (dispatch) => {
  try {
    dispatch(productRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const { data } = await axios.post(
      `${API_URL}/product/admin/product/create`,
      formData,
      config
    );

    dispatch(createProductSuccess());

    // Clear cached products after update
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("products_")) {
        localStorage.removeItem(key);
      }
    });

    toast.success("Product Added Successfully!");
    
    // Reset form if provided
    if (resetForm && typeof resetForm === 'function') {
      resetForm();
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         'Failed to create product';
    
    dispatch(productFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Admin Route - Get All Products
export const getProductsAdmin = () => async (dispatch) => {
  try {
    dispatch(productRequest());

    const { data } = await axios.get(
      `${API_URL}/product/admin/products`,
      getAuthConfig()
    );

    dispatch(getProductsAdminSuccess(data.products));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 
                         'Failed to fetch products';
    
    dispatch(productFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Admin Route - Delete Product
export const deleteProductAdmin = (productID) => async (dispatch) => {
  try {
    dispatch(productRequest());

    const { data } = await axios.delete(
      `${API_URL}/product/admin/product/delete/${productID}`,
      getAuthConfig()
    );

    dispatch(deleteProductAdminSuccess());
    toast.success("Product removed successfully!");
    
    // Refresh the products list
    dispatch(getProductsAdmin());
  } catch (err) {
    const errorMessage = err.response?.data?.message || 
                         'Failed to delete product';
    
    dispatch(productFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Admin Route - Get Single Product
export const getProductAdmin = (productID) => async (dispatch) => {
  try {
    dispatch(productRequest());

    const { data } = await axios.get(
      `${API_URL}/product/admin/product/${productID}`,
      getAuthConfig()
    );

    dispatch(getProductAdminSuccess(data.product));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 
                         'Failed to fetch product';
    
    dispatch(productFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Admin Route - Update Product
export const updateProductAdmin = (productID, productData, formData) => async (dispatch) => {
  try {
    dispatch(productRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': formData ? 'multipart/form-data' : 'application/json'
      }
    };

    // Use formData if provided, otherwise use productData
    const requestData = formData || productData;

    const { data } = await axios.put(
      `${API_URL}/product/admin/product/${productID}`,
      requestData,
      config
    );

    dispatch(updateProductAdminSuccess());
    
    // Clear cached products after update
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("products_")) {
        localStorage.removeItem(key);
      }
    });

    // Update cache version to notify all users of new data
    localStorage.setItem("products_cache_version", Date.now());

    toast.success("Product updated successfully!");
    
    // Refresh the product data
    dispatch(getProductAdmin(productID));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 
                         'Failed to update product';
    
    dispatch(productFail(errorMessage));
    toast.error(errorMessage);
  }
};

// User Route - Get Single Product
export const getProduct = (productID) => async (dispatch) => {
  try {
    // Check cache first
    const cachedData = localStorage.getItem(`product_${productID}`);
    const cacheTime = localStorage.getItem(`product_${productID}_timestamp`);
    const CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutes

    if (cachedData && cacheTime && Date.now() - cacheTime < CACHE_EXPIRATION) {
      dispatch(getProductSuccess(JSON.parse(cachedData)));
      return;
    }

    dispatch(productRequest());

    const { data } = await axios.get(
      `${API_URL}/product/product/${productID}`,
      getAuthConfig()
    );

    dispatch(getProductSuccess(data.product));

    // Store in cache
    localStorage.setItem(`product_${productID}`, JSON.stringify(data.product));
    localStorage.setItem(`product_${productID}_timestamp`, Date.now());
  } catch (err) {
    const errorMessage = err.response?.data?.message || 
                         'Failed to fetch product';
    
    dispatch(productFail(errorMessage));
  }
};

// User Route - Get All Products with filters
export const getAllProducts = (queryParams = {}) => async (dispatch) => {
  try {
    dispatch(productRequest());

    // Build query string
    const queryString = new URLSearchParams(queryParams).toString();
    const cacheKey = `products_${queryString}`;

    // Check cache
    const cachedProducts = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
    const cacheVersion = localStorage.getItem("products_cache_version") || 0;
    const CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutes

    if (cachedProducts && cachedTimestamp && 
        Date.now() - cachedTimestamp < CACHE_EXPIRATION && 
        Number(cachedTimestamp) >= Number(cacheVersion)) {
      dispatch(getProductsSuccess(JSON.parse(cachedProducts)));
      return;
    }

    const { data } = await axios.get(
      `${API_URL}/product/products?${queryString}`,
      getAuthConfig()
    );

    const responseData = {
      products: data.products,
      pagination: data.pagination
    };

    dispatch(getProductsSuccess(responseData));

    // Cache the response
    localStorage.setItem(cacheKey, JSON.stringify(responseData));
    localStorage.setItem(`${cacheKey}_timestamp`, Date.now());
  } catch (err) {
    const errorMessage = err.response?.data?.message || 
                         'Failed to fetch products';
    
    dispatch(productFail(errorMessage));
  }
};