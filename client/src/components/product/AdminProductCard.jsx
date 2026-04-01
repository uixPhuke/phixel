import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteProductAdmin } from '../../actions/productActions';
import { formatPrice, getProductStatus } from '../../utils/productHelpers';
import { toast } from 'react-hot-toast';

const AdminProductCard = ({ product, onEdit }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProductAdmin(product._id));
        toast.success('Product deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const status = getProductStatus(product);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* IMAGE */}
      <div className="relative">
        <img
          src={product.images?.[0]?.url || '/placeholder.jpg'}
          alt={product.title}
          className="w-full h-56 object-cover"
        />

        {/* TOP BADGES */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {product.popular && (
            <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-full">
              Popular
            </span>
          )}

          {product.madeToOrder && (
            <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded-full">
              Made To Order
            </span>
          )}

          {!product.availableState && (
            <span className="bg-gray-500 text-white px-2 py-1 text-xs rounded-full">
              Disabled
            </span>
          )}

          {product.active === 'inactive' && (
            <span className="bg-yellow-500 text-white px-2 py-1 text-xs rounded-full">
              Inactive
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-3">
        {/* TITLE */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
            {product.title}
          </h3>

          <p className="text-sm text-gray-500">
            Code: {product.productCode || 'N/A'}
          </p>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        {/* PRICE */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Selling Price</p>
            <p className="font-semibold text-green-600">
              {formatPrice(product.sellingPrice)}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Cost Price</p>
            <p className="font-semibold">
              {formatPrice(product.costPrice)}
            </p>
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <p>
            <span className="font-medium">Category:</span>{' '}
            {product.category}
          </p>

          <p>
            <span className="font-medium">Gender:</span>{' '}
            {product.gender}
          </p>

          <p>
            <span className="font-medium">Color:</span>{' '}
            {product.color}
          </p>

          <p>
            <span className="font-medium">Stock:</span>{' '}
            {product.stock}
          </p>

          <p>
            <span className="font-medium">Fabric:</span>{' '}
            {product.fabricType}
          </p>

          <p>
            <span className="font-medium">Fit:</span>{' '}
            {product.fitType}
          </p>

          <p>
            <span className="font-medium">Pattern:</span>{' '}
            {product.pattern}
          </p>

          <p>
            <span className="font-medium">Collar:</span>{' '}
            {product.collarType}
          </p>

          <p>
            <span className="font-medium">Sleeve:</span>{' '}
            {product.sleeveType}
          </p>

          <p>
            <span className="font-medium">Country:</span>{' '}
            {product.country}
          </p>
        </div>

        {/* SIZES */}
        <div>
          <p className="text-sm font-medium mb-1">Sizes</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes?.map((size) => (
              <span
                key={size}
                className="px-2 py-1 bg-gray-100 rounded-lg text-xs"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* STATUS */}
        <div className="flex justify-between items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === 'Out of Stock'
                ? 'bg-red-100 text-red-700'
                : status === 'Low Stock'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {status}
          </span>

          <span className="text-xs text-gray-400">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-3">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;