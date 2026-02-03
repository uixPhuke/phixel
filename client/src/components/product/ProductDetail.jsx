import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCartSuccess } from '../../slices/cartSlice';
import { addToWishlistSuccess } from '../../slices/wishlistSlice';
import { formatPrice, getProductStatus } from '../../utils/productHelpers';
import ProductImages from './ProductImages';
import { toast } from 'react-hot-toast';

const ProductDetail = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(addToCartSuccess({
      productID: product._id,
      quantity,
      size: selectedSize
    }));
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlistSuccess(product._id));
    toast.success('Added to wishlist!');
  };

  const status = getProductStatus(product);
  const canAddToCart = product.availableState && product.stock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Product Images */}
        <div className="flex-1">
          <ProductImages images={product.images} title={product.title} />
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {product.title}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <div className="flex items-center space-x-4">
              <p className="text-3xl text-gray-900">
                {formatPrice(product.sellingPrice)}
              </p>
              {product.totalPrice > product.sellingPrice && (
                <p className="text-xl text-gray-500 line-through">
                  {formatPrice(product.totalPrice)}
                </p>
              )}
            </div>
            <p className={`mt-2 text-sm font-medium ${
              status === 'Out of Stock' ? 'text-red-600' : 
              status === 'Low Stock' ? 'text-orange-600' : 
              'text-green-600'
            }`}>
              {status}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <dl className="space-y-4">
              <div className="flex">
                <dt className="text-sm font-medium text-gray-500 w-24">Category</dt>
                <dd className="text-sm text-gray-900 capitalize">{product.category}</dd>
              </div>
              <div className="flex">
                <dt className="text-sm font-medium text-gray-500 w-24">Gender</dt>
                <dd className="text-sm text-gray-900">{product.gender}</dd>
              </div>
              <div className="flex">
                <dt className="text-sm font-medium text-gray-500 w-24">Color</dt>
                <dd className="text-sm text-gray-900">{product.color}</dd>
              </div>
              <div className="flex">
                <dt className="text-sm font-medium text-gray-500 w-24">Fit Type</dt>
                <dd className="text-sm text-gray-900">{product.fitType}</dd>
              </div>
              <div className="flex">
                <dt className="text-sm font-medium text-gray-500 w-24">Fabric</dt>
                <dd className="text-sm text-gray-900">{product.fabricType}</dd>
              </div>
              <div className="flex">
                <dt className="text-sm font-medium text-gray-500 w-24">Pattern</dt>
                <dd className="text-sm text-gray-900">{product.pattern}</dd>
              </div>
            </dl>
          </div>

          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="text-sm text-gray-900 font-medium">Size</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[50px] py-2 px-3 border rounded-md text-sm font-medium ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="mt-8 flex space-x-4">
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:text-gray-700"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:text-gray-700"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="flex-1 bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>

            <button
              onClick={handleAddToWishlist}
              className="p-3 border border-gray-300 rounded-md text-gray-400 hover:text-gray-500"
              title="Add to Wishlist"
            >
              <span className="sr-only">Add to wishlist</span>
              ♡
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="space-y-4 text-sm text-gray-500">
              {product.madeToOrder && (
                <p>✓ This is a made-to-order item</p>
              )}
              <p>✓ Free shipping on orders over ₹999</p>
              <p>✓ 30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;