import React, { useState } from "react";
import AddressCard from "./AddressCard";
import AddAddressModal from "./AddAddressModal";

const AddressSection = ({ addresses, checkoutMode = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Addresses</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-80"
        >
          + Add Address
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {addresses?.length > 0 ? (
          addresses.map((address) => (
           <AddressCard
  key={address._id}
  address={address}
  checkoutMode={checkoutMode}
  onEdit={() => {
    setEditingAddress(address);
    setShowModal(true);
  }}
/>
          ))
        ) : (
          <p className="text-gray-500">
            No addresses added yet
          </p>
        )}
      </div>

      {showModal && (
  <AddAddressModal
    close={() => {
      setShowModal(false);
      setEditingAddress(null);
    }}
    address={editingAddress}
  />
)}

    </div>
  );
};

export default AddressSection;