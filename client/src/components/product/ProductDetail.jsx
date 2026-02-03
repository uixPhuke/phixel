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
  const [pincode, setPincode] = useState('');
  const [openSection, setOpenSection] = useState(null);

  const status = getProductStatus(product);
  const canAddToCart = product.availableState && product.stock > 0;

  const toggleSection = (key) => {
    setOpenSection(openSection === key ? null : key);
  };
  const handleAddToCart = () => {
    
    toast.success('Product added to cart');
  }
  const handleAddToWishlist = () => {
    
    toast.success('Product added to wishlist');
  }

  return (
  <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-10">
    <div className="grid lg:grid-cols-[55%_45%] gap-8 items-start">

      {/* LEFT – IMAGES (CONSTRAINED WIDTH) */}
      <div className="max-w-[520px]">
        <ProductImages images={product.images} title={product.title} />
      </div>

      {/* RIGHT – PRODUCT INFO */}
      <div className="space-y-6 lg:sticky lg:top-24">

        {/* Title */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {product.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {product.gender} {product.category}
          </p>
        </div>

        {/* PRICE (REDUCED SIZE) */}
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[1.75rem] font-medium text-gray-900">
              {formatPrice(product.sellingPrice)}
            </span>

            {product.totalPrice > product.sellingPrice && (
              <span className="text-base text-gray-400 line-through">
                {formatPrice(product.totalPrice)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Inclusive of all taxes
          </p>
        </div>

        {/* SIZE */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Select Size</span>
            <button className="text-sm underline text-gray-600">
              Size Guide
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2.5 border rounded-md text-sm ${
                  selectedSize === size
                    ? 'border-black'
                    : 'border-gray-300 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          disabled={!canAddToCart}
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-900 disabled:bg-gray-300"
        >
          Add to Bag
        </button>

        <button
          onClick={handleAddToWishlist}
          className="w-full border py-3 rounded-full text-sm hover:border-black flex items-center justify-center gap-2"
        >
          Favourite ♡
        </button>

        {/* DESCRIPTION */}
        <div className="text-sm text-gray-700 leading-relaxed">
          {product.description}
        </div>

        {/* PRODUCT META (NEW – REQUESTED) */}
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Category: {product.category}</li>
          <li>• Gender: {product.gender}</li>
          <li>• Fit Type: {product.fitType}</li>
          <li>• Fabric: {product.fabricType}</li>
          <li>• Pattern: {product.pattern}</li>
          <li>• Colour Shown: {product.color}</li>
          <li>• Article: {product._id}</li>
        </ul>

        {/* PINCODE */}
        <div className="pt-4">
          <p className="text-sm font-medium">Check delivery date</p>
          <p className="text-xs text-gray-500 mb-2">
            Enter pincode to know delivery dates/charges
          </p>

          <div className="flex gap-2">
            <input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Pincode"
              className="border px-3 py-2 rounded-md text-sm flex-1"
            />
            <button className="border px-4 py-2 rounded-md text-sm text-gray-600">
              Check
            </button>
          </div>
        </div>

        {/* DELIVERY INFO */}
        <div className="space-y-2 text-sm text-gray-600 pt-4">
          <div className="flex justify-between">
            <span>14-day return & size exchange</span>
            <button className="underline">Know More</button>
          </div>
          <div className="flex justify-between">
            <span>Free delivery available</span>
            <button className="underline">Know More</button>
          </div>
        </div>

        {/* ACCORDIONS */}
        <div className="border-t pt-4">
          <button
            onClick={() => toggleSection('vendor')}
            className="w-full flex justify-between py-3 text-sm font-medium"
          >
            Vendor Details
            <span>{openSection === 'vendor' ? '−' : '+'}</span>
          </button>

          {openSection === 'vendor' && (
            <p className="text-sm text-gray-600 pb-3">
              Sold by authorised vendor. 100% authentic products.
            </p>
          )}

          <button
            onClick={() => toggleSection('return')}
            className="w-full flex justify-between py-3 text-sm font-medium border-t"
          >
            Return & Exchange Policy
            <span>{openSection === 'return' ? '−' : '+'}</span>
          </button>

          {openSection === 'return' && (
            <p className="text-sm text-gray-600 pb-3">
              Easy 14-day returns and size exchanges.
            </p>
          )}
        </div>

      </div>
    </div>
  </div>
);

};

export default ProductDetail;
