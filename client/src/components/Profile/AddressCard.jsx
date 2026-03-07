import { deleteAddress, setDefaultAddress } from "../../actions/addressActions";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";

const AddressCard = ({ address, onEdit }) => {

  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Delete this address?")) {
      dispatch(deleteAddress(address._id));
    }
  };

  const handleDefault = () => {
    dispatch(setDefaultAddress(address._id));
    setMenuOpen(false);
  };

  return (
    <div className="relative border rounded-xl p-5 bg-white hover:shadow-md transition">

      {/* Default label */}
      {address.isDefault && (
  <span className="absolute bottom-3 right-3 text-xs bg-black text-white px-2 py-1 rounded">
    Default
  </span>
)}

      {/* 3 dot menu */}
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-500"
        >
          <FiMoreVertical size={18} />
        </button>

        {menuOpen && !address.isDefault && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md">
            <button
              onClick={handleDefault}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
            >
              Set Default
            </button>
          </div>
        )}
      </div>

      {/* Address details */}
      <p className="font-semibold mt-4">{address.name}</p>

      <p className="text-sm text-gray-500">
        {address.address}
      </p>

      <p className="text-sm text-gray-500">
        {address.city}, {address.state}
      </p>

      <p className="text-sm text-gray-500">
        {address.country} - {address.pinCode}
      </p>

      <p className="text-sm text-gray-500">
        {address.mobileNo}
      </p>

      {/* Edit / Delete icons */}
      <div className="flex gap-4 mt-4">

        <button
          onClick={onEdit}
          className="text-primary hover:text-blue-800"
        >
          <FiEdit size={18} />
        </button>

        <button
          onClick={handleDelete}
          className="text-primary hover:text-red-700"
        >
          <FiTrash2 size={18} />
        </button>

      </div>

    </div>
  );
};

export default AddressCard;