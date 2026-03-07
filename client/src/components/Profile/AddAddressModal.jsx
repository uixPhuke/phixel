import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addAddress,getAddresses } from "../../actions/addressActions"

const AddAddressModal = ({ close }) => {

  const dispatch = useDispatch();

  const [addressData, setAddressData] = useState({
    name: "",
    mobileNo: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    landmark: "",
  });

  const handleChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  dispatch(addAddress(addressData));
  dispatch(getAddresses());

  close();
};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-[420px] space-y-4"
      >

        <h2 className="text-lg font-semibold">
          Add New Address
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="mobileNo"
          placeholder="Mobile Number"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="address"
          placeholder="Street Address"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="state"
          placeholder="State"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="pinCode"
          placeholder="Pin Code"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="country"
          placeholder="Country"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="landmark"
          placeholder="Landmark"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Save Address
          </button>

          <button
            type="button"
            onClick={close}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>

      </form>

    </div>
  );
};

export default AddAddressModal;