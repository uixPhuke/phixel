import { createSlice } from '@reduxjs/toolkit';

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    loading: false,
    error: null,
    addresses: [],
  },
  reducers: {
    // Generic request action
    addressRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // Add address success
    addAddressSuccess: (state, action) => {
      state.loading = false;
      state.addresses.push(action.payload);
    },
    
    // Get addresses success
    getAddressesSuccess: (state, action) => {
      state.loading = false;
      state.addresses = action.payload;
    },
    
    // Update address success
    updateAddressSuccess: (state, action) => {
      state.loading = false;
      const index = state.addresses.findIndex(address => address._id === action.payload._id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },
    
    // Delete address success
    deleteAddressSuccess: (state, action) => {
      state.loading = false;
      state.addresses = state.addresses.filter(address => address._id !== action.payload);
    },
    
    // Failure action
    addressFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Clear error
    clearAddressError: (state) => {
      state.error = null;
    },
    
    // Clear addresses
    clearAddresses: (state) => {
      state.addresses = [];
    }
  },
});

export const {
  addressRequest,
  addAddressSuccess,
  getAddressesSuccess,
  updateAddressSuccess,
  deleteAddressSuccess,
  addressFail,
  clearAddressError,
  clearAddresses
} = addressSlice.actions;

export default addressSlice.reducer;