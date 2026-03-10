import React from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from "../../actions/cartActions";
import { addToGuestCart } from "../../slices/cartSlice";
import { formatPrice, getProductStatus } from '../../utils/productHelpers';

import { addToCartSuccess } from '../../slices/cartSlice';
//import { addToWishlistSuccess } from '../../slices/wishlistSlice';

import { toggleWishlistItem } from "../../actions/wishlistActions";
import { FaHeart, FaRegHeart } from "react-icons/fa";


const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const { cartItems } = useSelector((state) => state.cart);
const { isLogin } = useSelector((state) => state.user);
const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
const isWishlisted = wishlistItems.some(w => w._id === product._id);

  
   const handleAddToCart = (e) => {
  e.preventDefault();

  const existingItem = cartItems.find(
    (item) =>
      (item.product?._id || item.productID) === product._id &&
      item.size === selectedSize
  );

  const quantityToSend = existingItem
    ? existingItem.quantity + 1
    : 1;

  if (!isLogin) {
    dispatch(
      addToGuestCart({
        productID: product._id,
        quantity: quantityToSend,
        size: selectedSize,
        priceSnapshot: product.sellingPrice,
        product
      })
    );
  } else {
    dispatch(
      addToCart({
        productID: product._id,
        quantity: quantityToSend,
        size: selectedSize
      })
    );
  }
};
 

const handleAddToWishlist = (e) => {
  e.preventDefault();
  console.log("Wishlist toggle for product:", product._id);
  dispatch(toggleWishlistItem(product._id));
};

  const status = getProductStatus(product);
  const statusColor =
    status === 'Out of Stock'
      ? 'text-red-600'
      : status === 'Low Stock'
      ? 'text-orange-600'
      : 'text-green-600';

  return (
    <div className="bg-white flex flex-col relative group">
      <Link to={`/products/${product._id}`} className="block">

        {/* IMAGE */}
        <div className="relative overflow-hidden">
          {/* Main image */}
          <img
            src={product.images[0]?.url}
            alt={product.title}
            className="w-full aspect-[4/5] object-cover transition-opacity duration-300 group-hover:opacity-0"
          />

          {/* Hover image */}
          {product.images[1]?.url && (
            <img
              src={product.images[1].url}
              alt={product.title}
              className="absolute inset-0 w-full aspect-[4/5] object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}

          {/* Wishlist (hover desktop, always mobile) */}
          <button
  onClick={handleAddToWishlist}
  className="
    absolute top-3 right-3 z-10
    backdrop-blur
    p-2
    opacity-100 lg:opacity-0
    lg:group-hover:opacity-100
    transition-opacity
  "
  title="Add to Wishlist"
>
  {isWishlisted ? (
    <FaHeart className="text-sm text-red-500" />
  ) : (
    <FaRegHeart className="text-sm" />
  )}
</button>

          {/* Badge */}
          {product.popular && (
            <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs">
              Popular
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-3 space-y-2">
          

          <h3 className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
            {product.title}
          </h3>

<div className="flex items-baseline gap-3">
  {/* Selling Price — Primary */}
  <span className="text-[clamp(1.5rem,2.4vw,1.9rem)] font-semibold text-gray-900 leading-none">
    {formatPrice(product.sellingPrice)}
  </span>

  {/* Original Price — Secondary */}
  {product.totalPrice > product.sellingPrice && (
    <span className="text-sm text-gray-400 line-through leading-none">
      {formatPrice(product.totalPrice)}
    </span>
  )}
</div>



          <p className="text-xs text-gray-500 capitalize">
            {product.category}
          </p>

          <p className={`text-xs ${statusColor}`}>
            {status}
          </p>
        </div>
      </Link>

      {/* CTA */}
      <div className="px-3 pb-3">
        <button
          onClick={handleAddToCart}
          disabled={!product.availableState || product.stock === 0}
          className="
            w-full py-1.5 text-sm
            border border-gray-300
            hover:border-black
            transition-colors
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
