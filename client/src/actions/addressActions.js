import axios from 'axios';
import {
  addAddressRequest, addAddressSuccess, addAddressFail,
  getAddressesRequest, getAddressesSuccess, getAddressesFail,
  updateAddressRequest, updateAddressSuccess, updateAddressFail,
  deleteAddressRequest, deleteAddressSuccess, deleteAddressFail
} from '.././slices/addresSlice';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_KEY;

// Action to add a new address
export const addAddress = (addressData) => async (dispatch) => {
  try {
    dispatch(addAddressRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const { data } = await axios.post(`${API_URL}/api/v5/address/add-address`, addressData, config);

    dispatch(addAddressSuccess(data.address));
    toast.success('Address added successfully!', {
      className: 'custom-toast-enter',
    });
  } catch (err) {
    console.error('Add Address Error:', err);
    const errorMessage = err.response?.data?.message || 'Failed to add the address. Please try again.';
    dispatch(addAddressFail(errorMessage));
    toast.error(errorMessage, {
      className: 'custom-toast-enter',
    });
  }
};

// Action to get all addresses
export const getAddresses = () => async (dispatch) => {
  try {
    dispatch(getAddressesRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/v5/address/get-addresses`, config);

    dispatch(getAddressesSuccess(data.addresses));
  } catch (err) {
    console.error('Get Addresses Error:', err);
    const errorMessage = err.response?.data?.message || 'Failed to fetch addresses. Please try again.';
    dispatch(getAddressesFail(errorMessage));
    toast.error(errorMessage, {
      className: 'custom-toast-enter',
    });
  }
};

// Action to update an existing address
export const updateAddress = (addressId, addressData) => async (dispatch) => {
  try {
    dispatch(updateAddressRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const { data } = await axios.put(`${API_URL}/api/v5/address/update-address/${addressId}`, addressData, config);

    dispatch(updateAddressSuccess(data.address));
    toast.success('Address updated successfully!', {
      className: 'custom-toast-enter',
    });
  } catch (err) {
    console.error('Update Address Error:', err);
    const errorMessage = err.response?.data?.message || 'Failed to update the address. Please try again.';
    dispatch(updateAddressFail(errorMessage));
    toast.error(errorMessage, {
      className: 'custom-toast-enter',
    });
  }
};

// Action to delete an address
export const deleteAddress = (addressId) => async (dispatch) => {
  try {
    dispatch(deleteAddressRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    await axios.delete(`${API_URL}/api/v5/address/delete-address/${addressId}`, config);

    dispatch(deleteAddressSuccess(addressId));
    toast.success('Address deleted successfully!', {
      className: 'custom-toast-enter',
    });
  } catch (err) {
    console.error('Delete Address Error:', err);    
    const errorMessage = err.response?.data?.message || 'Failed to delete the address. Please try again.';
    dispatch(deleteAddressFail(errorMessage));
    toast.error(errorMessage, {
      className: 'custom-toast-enter',
    });
  }
};
