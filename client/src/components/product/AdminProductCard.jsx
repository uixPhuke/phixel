import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteProductAdmin } from '../../slices/productSlice';
import { formatPrice, getProductStatus } from '../../utils/productHelpers';
import { toast } from 'react-hot-toast';

const AdminProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProductAdmin(product._id)).unwrap();
        toast.success('Product deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const status = getProductStatus(product);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="relative">
        <img 
          src={product.images[0]?.url} 
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 flex space-x-1">
          {product.popular && (
            <span className="bg-red-500 text-white px-2 py-1 text-xs rounded">
              Popular
            </span>
          )}
          {product.madeToOrder && (
            <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded">
              Made to Order
            </span>
          )}
          {!product.availableState && (
            <span className="bg-gray-500 text-white px-2 py-1 text-xs rounded">
              Disabled
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="space-y-2 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.sellingPrice)}
            </span>
            <span className={`text-sm font-medium px-2 py-1 rounded ${
              status === 'Out of Stock' ? 'bg-red-100 text-red-800' : 
              status === 'Low Stock' ? 'bg-orange-100 text-orange-800' : 
              'bg-green-100 text-green-800'
            }`}>
              {status}
            </span>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>Stock: {product.stock}</span>
            <span>Code: {product.productCode}</span>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>Category: {product.category}</span>
            <span>Gender: {product.gender}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/admin/products/edit/${product._id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Created: {new Date(product.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;