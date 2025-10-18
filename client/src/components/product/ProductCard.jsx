import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { formatPrice, getProductStatus } from '../../utils/productHelpers';
import { addToCart } from '../../slices/cartSlice';
import { addToWishlist } from '../../slices/wishlistSlice';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  const handleAddToCart = () => {
    dispatch(addToCart({ 
      productId: product._id, 
      quantity: 1 
    }));
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(product._id));
  };

  const status = getProductStatus(product);
  const statusColor = status === 'Out of Stock' ? 'text-red-600' : 
                     status === 'Low Stock' ? 'text-orange-600' : 
                     'text-green-600';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative">
          <img 
            src={product.images[0]?.url} 
            alt={product.title}
            className="w-full h-64 object-cover"
          />
          {product.popular && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
              Popular
            </span>
          )}
          {product.madeToOrder && (
            <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
              Made to Order
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.sellingPrice)}
            </span>
            {product.totalPrice > product.sellingPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(product.totalPrice)}
              </span>
            )}
          </div>
          <span className={`text-sm font-medium ${statusColor}`}>
            {status}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>Size: {product.sizes.join(', ')}</span>
          <span>Color: {product.color}</span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.availableState || product.stock === 0}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Add to Cart
          </button>
          <button
            onClick={handleAddToWishlist}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Add to Wishlist"
          >
            ♡
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;