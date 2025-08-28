import { createSlice } from '@reduxjs/toolkit';

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    loading: false,
    error: null,
    addresses: [],
    updatedAt: null,
  },
  reducers: {
    // Actions for adding/updating/removing/fetching addresses
    addAddressRequest: (state) => {
      state.loading = true;
    },
    addAddressSuccess: (state, action) => {
      state.loading = false;
      state.addresses.push(action.payload);
      state.updatedAt = action.payload.updatedAt;
    },
    addAddressFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getAddressesRequest: (state) => {
      state.loading = true;
    },
    getAddressesSuccess: (state, action) => {
      state.loading = false;
      state.addresses = action.payload;
    },
    getAddressesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateAddressRequest: (state) => {
      state.loading = true;
    },
    updateAddressSuccess: (state, action) => {
      state.loading = false;
      const index = state.addresses.findIndex(address => address._id === action.payload._id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },
    updateAddressFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteAddressRequest: (state) => {
      state.loading = true;
    },
    deleteAddressSuccess: (state, action) => {
      state.loading = false;
      state.addresses = state.addresses.filter(address => address._id !== action.payload);
    },
    deleteAddressFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  addAddressRequest,
  addAddressSuccess,
  addAddressFail,
  getAddressesRequest,
  getAddressesSuccess,
  getAddressesFail,
  updateAddressRequest,
  updateAddressSuccess,
  updateAddressFail,
  deleteAddressRequest,
  deleteAddressSuccess,
  deleteAddressFail,
} = addressSlice.actions;

export default addressSlice.reducer;
