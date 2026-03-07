import { deleteAddress, setDefaultAddress } from "../../actions/addressActions";
import { useDispatch } from "react-redux";

const AddressCard = ({ address, onEdit }) => {

  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm("Delete this address?")) {
      dispatch(deleteAddress(address._id));
    }
  };

  const handleDefault = () => {
    dispatch(setDefaultAddress(address._id));
  };

  return (
    <div className="border rounded-xl p-5 bg-white hover:shadow-md">

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

       <button
  onClick={onEdit}
  className="text-blue-600"
>
  Edit
</button>
{address.isDefault && (
  <span className="inline-block mb-2 text-xs bg-black text-white px-2 py-1 rounded">
    Default Address
  </span>
)}
        {!address.isDefault && (
          <button
            onClick={handleDefault}
            className="text-green-600"
          >
            Set Default
          </button>
        )}

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