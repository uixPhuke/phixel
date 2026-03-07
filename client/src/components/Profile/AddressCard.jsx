import React from "react";
import { useDispatch } from "react-redux";
import { deleteAddress } from "../../actions/addressActions";

const AddressCard = ({ address }) => {

  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm("Delete this address?")) {
      dispatch(deleteAddress(address._id));
    }
  };

  return (
    <div className="border rounded-xl p-5 bg-white hover:shadow-md transition">

      {address.isDefault && (
        <span className="text-xs bg-black text-white px-2 py-1 rounded">
          Default
        </span>
      )}

      <p className="font-semibold mt-2">{address.name}</p>

      <p className="text-sm text-gray-500">{address.address}</p>

      <p className="text-sm text-gray-500">
        {address.city}, {address.state}
      </p>

      <p className="text-sm text-gray-500">
        {address.country} - {address.pinCode}
      </p>

      <p className="text-sm text-gray-500">
        {address.mobileNo}
      </p>

      <div className="flex gap-4 mt-4 text-sm">
        <button className="text-blue-600">
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="text-red-500"
        >
          Remove
        </button>
      </div>

    </div>
  );
};

export default AddressCard;