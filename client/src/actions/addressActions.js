import axios from 'axios';
import {
  addressRequest,
  addAddressSuccess,
  getAddressesSuccess,
  updateAddressSuccess,
  deleteAddressSuccess,
  addressFail
} from '../slices/addressSlice';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_KEY;

// Helper function to get auth config
const getAuthConfig = () => ({
headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
   },
  withCredentials: true// Include cookies for authentication
});

// Action to add a new address
export const addAddress = (addressData) => async (dispatch) => {
  try {
    dispatch(addressRequest());

    // Validate required fields (matching your controller validation)
    const requiredFields = ['name', 'mobileNo', 'address', 'city', 'state', 'pinCode', 'country', 'landmark'];
    const missingFields = requiredFields.filter(field => !addressData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Please fill all required fields: ${missingFields.join(', ')}`);
    }

    const { data } = await axios.post(
      `${API_URL}/api/v2/address/add`,
      addressData,
      getAuthConfig()
    );

    dispatch(addAddressSuccess(data.address));
    toast.success('Address added successfully!');
  } catch (err) {
    console.error('Add Address Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         err.message || 
                         'Failed to add the address. Please try again.';
    
    dispatch(addressFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Action to get all addresses
export const getAddresses = () => async (dispatch) => {
  try {
    dispatch(addressRequest());

    const { data } = await axios.get(
      `${API_URL}/api/v2/address`,
      getAuthConfig()
    );

    dispatch(getAddressesSuccess(data.addresses));
  } catch (err) {
    console.error('Get Addresses Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Failed to fetch addresses. Please try again.';
    
    dispatch(addressFail(errorMessage));
    
    // Don't show toast for 404 (no addresses found) as it's not an error
    if (err.response?.status !== 404) {
      toast.error(errorMessage);
    }
  }
};

// Action to update an existing address
export const updateAddress = (addressId, addressData) => async (dispatch) => {
  try {
    dispatch(addressRequest());

    const { data } = await axios.put(
      `${API_URL}/api/v2/address/${addressId}`,
      addressData,
      getAuthConfig()
    );

    dispatch(updateAddressSuccess(data.address));
    toast.success('Address updated successfully!');
  } catch (err) {
    console.error('Update Address Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Failed to update the address. Please try again.';
    
    dispatch(addressFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Action to delete an address
export const deleteAddress = (addressId) => async (dispatch) => {
  try {
    dispatch(addressRequest());

    await axios.delete(
      `${API_URL}/api/v2/address/${addressId}`,
      getAuthConfig()
    );

    dispatch(deleteAddressSuccess(addressId));
    toast.success('Address deleted successfully!');
  } catch (err) {
    console.error('Delete Address Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Failed to delete the address. Please try again.';
    
    dispatch(addressFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Action to set default address (if you implement this later)
export const setDefaultAddress = (addressId) => async (dispatch) => {
  try {
    dispatch(addressRequest());

    // This would call your setDefaultAddress endpoint when implemented
    // const { data } = await axios.patch(
    //   `${API_URL}/address/${addressId}/default`,
    //   {},
    //   getAuthConfig()
    // );

    // For now, we'll update the local state
    // dispatch(updateAddressSuccess(data.address));
    toast.success('Default address set successfully!');
    
    // Refresh addresses to get updated default status
    dispatch(getAddresses());
  } catch (err) {
    console.error('Set Default Address Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Failed to set default address. Please try again.';
    
    dispatch(addressFail(errorMessage));
    toast.error(errorMessage);
  }
};