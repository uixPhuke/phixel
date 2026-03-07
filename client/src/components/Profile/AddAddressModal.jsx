import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addAddress, updateAddress, getAddresses } from "../../actions/addressActions";

const AddAddressModal = ({ close, address }) => {

  const dispatch = useDispatch();

  const [addressData, setAddressData] = useState({
    name: "",
    mobileNo: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    landmark: ""
  });


  useEffect(() => {
    if (address) {
      setAddressData(address);
    }
  }, [address]);

  const handleChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (address) {
      await dispatch(updateAddress(address._id, addressData));
    } else {
      await dispatch(addAddress(addressData));
    }

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
          {address ? "Edit Address" : "Add Address"}
        </h2>

        <input name="name" value={addressData.name} onChange={handleChange} placeholder="Full Name" className="w-full border p-2 rounded" />

        <input name="mobileNo" value={addressData.mobileNo} onChange={handleChange} placeholder="Mobile Number" className="w-full border p-2 rounded" />

        <input name="address" value={addressData.address} onChange={handleChange} placeholder="Street Address" className="w-full border p-2 rounded" />

        <input name="city" value={addressData.city} onChange={handleChange} placeholder="City" className="w-full border p-2 rounded" />

        <input name="state" value={addressData.state} onChange={handleChange} placeholder="State" className="w-full border p-2 rounded" />

        <input name="pinCode" value={addressData.pinCode} onChange={handleChange} placeholder="Pin Code" className="w-full border p-2 rounded" />

        <input name="country" value={addressData.country} onChange={handleChange} placeholder="Country" className="w-full border p-2 rounded" />

        <input name="landmark" value={addressData.landmark} onChange={handleChange} placeholder="Landmark" className="w-full border p-2 rounded" />

        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-black text-white px-4 py-2 rounded">
            {address ? "Update Address" : "Save Address"}
          </button>

          <button type="button" onClick={close} className="border px-4 py-2 rounded">
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddAddressModal;