import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: 'product',
  initialState: {
    loading: true,
    error: null,
    product: null,
    products: [],
    productsAdmin: [],
    productAdmin: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1
    }
  },
  reducers: {
    // Generic request action
    productRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // Get all products (for users)
    getProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.pagination = action.payload.pagination;
    },
    
    // Get single product (for users)
    getProductSuccess: (state, action) => {
      state.loading = false;
      state.product = action.payload;
    },
    
    // Get all products (for admin)
    getProductsAdminSuccess: (state, action) => {
      state.loading = false;
      state.productsAdmin = action.payload;
    },
    
    // Get single product (for admin)
    getProductAdminSuccess: (state, action) => {
      state.loading = false;
      state.productAdmin = action.payload;
    },
    
    // Create product (admin)
    createProductSuccess: (state) => {
      state.loading = false;
    },
    
    // Update product (admin)
    updateProductAdminSuccess: (state) => {
      state.loading = false;
    },
    
    // Delete product (admin)
    deleteProductAdminSuccess: (state) => {
      state.loading = false;
    },
    
    // Failure action
    productFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Clear product state
    clearProductState: (state) => {
      state.product = null;
      state.error = null;
    },
    
    // Clear admin product state
    clearProductAdminState: (state) => {
      state.productAdmin = null;
      state.error = null;
    }
  }
});

export const {
  productRequest,
  getProductsSuccess,
  getProductSuccess,
  getProductsAdminSuccess,
  getProductAdminSuccess,
  createProductSuccess,
  updateProductAdminSuccess,
  deleteProductAdminSuccess,
  productFail,
  clearProductState,
  clearProductAdminState
} = productSlice.actions;

export default productSlice.reducer;