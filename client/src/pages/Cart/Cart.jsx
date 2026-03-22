import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  removeFromCart,
  syncGuestCart,
} from "../../actions/cartActions";
import {
  removeFromGuestCart,
  updateGuestQuantity,
} from "../../slices/cartSlice";
import { formatPrice } from "../../utils/productHelpers";
import { IoTrashBinOutline } from "react-icons/io5";
import { FaPlus, FaMinus, FaRegHeart } from "react-icons/fa";
import {
  applyCoupon,
  removeCoupon,
  getAllCoupons,
  removeAppliedCoupon,
  checkCoupon,
 
} from "../../actions/couponActions";
import { checkCouponSuccess } from "../../slices/couponSlice";
import { addToCart } from "../../actions/cartActions";
 import { setShowLoginModalTrue } from "../../slices/userSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleCheckout = () => {
  if (!isLogin) {
    dispatch(setShowLoginModalTrue()); // open modal
    return;
  }
  const totalPrice = subtotalToShow - discountAmount;

  navigate("/checkout", {
    state: {
      totalPrice,
      couponCode: appliedCoupon?.code || null
    }
  });

};

  const { cartItems, guestCartItems, loading } = useSelector(
    (state) => state.cart,
  );

  const token = localStorage.getItem("token");
  const { appliedCoupon, coupons } = useSelector((state) => state.coupon);
  const [couponCode, setCouponCode] = useState("");
  const [showCoupons, setShowCoupons] = useState(false);
  const { isLogin } = useSelector((state) => state.user);
  console.log("LOGIN STATE:", isLogin);
//  const handleApplyCoupon = () => {

//   if (!couponCode.trim()) return;

//   if (isLogin) {
//     dispatch(applyCoupon(couponCode));
//   } else {
//     dispatch(checkCoupon(couponCode));
//   }

// };


// useEffect(() => {

//   dispatch(getAllCoupons()); // always load coupons

//   if (isLogin) {
//     dispatch(getCart());
//   }

// }, [dispatch, isLogin]);

const handleApplyCoupon = () => {

  if (!couponCode.trim()) return;

  if (isLogin) {
    dispatch(applyCoupon(couponCode));
  } else {
    dispatch(checkCoupon(couponCode));
  }

};

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponCode("");
  };

  // ============================
  // AUTO LOAD + AUTO SYNC
  // ============================
useEffect(() => {

  dispatch(getAllCoupons()); // always load coupons

  if (isLogin) {
    dispatch(getCart());
  }
  const savedCoupon = localStorage.getItem("appliedCoupon");

  if (savedCoupon) {
    dispatch(checkCouponSuccess(JSON.parse(savedCoupon)));
  }

}, [dispatch, isLogin]);
  // ============================
  // Decide cart source
  // ============================
  const itemsToShow = isLogin ? cartItems : guestCartItems;

  // ============================
  // UI SAFE TOTALS
  // ============================
  const itemCountToShow = itemsToShow.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const subtotalToShow = itemsToShow.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity,
    0,
  );
let discountAmount = 0;

if (appliedCoupon) {
  if (appliedCoupon.discountType === "percentage") {
    discountAmount =
      (subtotalToShow * appliedCoupon.discountPercentage) / 100;
  } else {
    discountAmount = appliedCoupon.discountValue;
  }
}
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 sm:py-10">
      <div className="grid lg:grid-cols-[65%_35%] gap-10 items-start">
        {/* ================= LEFT — CART ITEMS ================= */}
        <div>
          <h1 className="text-2xl font-semibold mb-1">
            YOUR BAG{" "}
            <span className="text-gray-500 text-md">
              ({itemCountToShow} items)
            </span>
          </h1>

          <p className="text-sm text-gray-600 mb-6">
            Items in your bag are not reserved — check out now.
          </p>

          {/*loading && <p>Loading...</p>*/}

          {itemsToShow.length === 0 && (
            <p className="text-gray-500">Your cart is empty.</p>
          )}

          <div className="space-y-6">
            {itemsToShow.map((item) => {
              const product = item.product;

              return (
                <div
                  key={`${isLogin ? product._id : item.productID}-${item.size}`}
                  className="flex flex-col sm:flex-row gap-4 border rounded-2xl  p-4 sm:p-6"
                >
                  {/* IMAGE */}
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.title}
                    className="w-full sm:w-40 sm:h-40 object-cover bg-gray-100 rounded"
                  />

                  {/* CONTENT */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-sm sm:text-md">
                        {product.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Size: {item.size}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center justify-between mt-4 gap-3 flex-wrap">
                      {/* QUANTITY CONTROL */}
                      <div className="flex items-center border rounded-full px-4 py-2 gap-4">
                        {/* LEFT (FIXED WIDTH) */}
                        <button
                          className="w-6 h-6 flex items-center justify-center text-gray-700"
                          onClick={() =>
                            item.quantity === 1
                              ? isLogin
                                ? dispatch(
                                    addToCart({
                                      productID: product._id,
                                      size: item.size,
                                      quantity: 0,
                                    }),
                                  )
                                : dispatch(
                                    removeFromGuestCart({
                                      productID: item.productID,
                                      size: item.size,
                                    }),
                                  )
                              : isLogin
                                ? dispatch(
                                    addToCart({
                                      productID: product._id,
                                      size: item.size,
                                      quantity: item.quantity - 1,
                                    }),
                                  )
                                : dispatch(
                                    updateGuestQuantity({
                                      productID: item.productID,
                                      size: item.size,
                                      quantity: item.quantity - 1,
                                    }),
                                  )
                          }
                        >
                          {item.quantity === 1 ? (
                            <IoTrashBinOutline className="w-5 h-5" />
                          ) : (
                            <FaMinus className="w-4 h-4" />
                          )}
                        </button>

                        {/* QTY (FIXED WIDTH) */}
                        <span className="w-6 text-center text-sm font-medium select-none">
                          {item.quantity}
                        </span>

                        {/* RIGHT (FIXED WIDTH) */}
                        <button
                          className="w-6 h-6 flex items-center justify-center text-gray-900"
                          onClick={() =>
                            isLogin
                              ? dispatch(
                                  addToCart({
                                    productID: product._id,
                                    size: item.size,
                                    quantity: item.quantity + 1,
                                  }),
                                )
                              : dispatch(
                                  updateGuestQuantity({
                                    productID: item.productID,
                                    size: item.size,
                                    quantity: item.quantity + 1,
                                  }),
                                )
                          }
                        >
                          <FaPlus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* WISHLIST — BOTTOM RIGHT 
                      <button
                        className="
                           absolute
                            bottom-4
                            right-4
                            w-9
                            h-9
                            
                            flex
                            items-center
                            justify-center
                            
                            hover:border-black
                            bg-white
                          "
                      >
                        <FaRegHeart className="text-xl" />
                      </button>*/}
                    </div>
                  </div>

                  {/* PRICE + WISHLIST COLUMN */}
                  <div className="flex flex-col items-end justify-between h-full min-h-[140px] ">
                    {/* PRICE */}
                    <div className="text-right font-medium text-sm sm:text-md">
                      {formatPrice(item.priceSnapshot * item.quantity)}
                    </div>

                    {/* HEART */}
                    <button
                      className="
      w-9 h-9
      flex items-center justify-center
      
      hover:border-black
      bg-white
    "
                    >
                      <FaRegHeart className="text-xl leading-none" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT — ORDER SUMMARY ================= */}
        <div className="border rounded-2xl p-6 sticky top-24 h-fit">
          <h2 className="text-xl font-semibold mb-6">ORDER SUMMARY</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>{itemCountToShow} items</span>
              <span>{formatPrice(subtotalToShow)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600">Free</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Coupon ({appliedCoupon.code})</span>
               <span>- {formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="border-t pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>
                {appliedCoupon
                  ? formatPrice(subtotalToShow - discountAmount)
                  : formatPrice(subtotalToShow)}
              </span>
            </div>

            <p className="text-xs text-gray-500">Inclusive of all taxes</p>
          </div>

          {/* COUPON DROPDOWN */}
          <div className="mt-6 border-t pt-6">
            <button
              onClick={() => setShowCoupons(!showCoupons)}
              className="w-full flex justify-between items-center text-sm font-medium"
            >
              <span>Apply Coupon</span>
              <span>{showCoupons ? "▲" : "▼"}</span>
            </button>

            {showCoupons && (
              <div className="mt-4 space-y-3">
                {/* MANUAL COUPON INPUT */}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full"
                  />

                  <button
                    onClick={handleApplyCoupon}
                    className="bg-black text-white px-4 py-2 rounded-lg"
                  >
                    Apply
                  </button>
                </div>

                {/* AVAILABLE COUPONS */}

                {coupons.map((coupon) => (
                  <div
                    key={coupon._id}
                    className="flex justify-between items-center border rounded-lg p-3 bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold text-sm">{coupon.code}</p>

                      <p className="text-xs text-gray-500">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountPercentage}% OFF`
                          : `₹${coupon.discountValue} OFF`}
                      </p>
                    </div>

                    <button
 
   onClick={() =>
  appliedCoupon?.code === coupon.code
    ? dispatch(removeAppliedCoupon())
    : isLogin
      ? dispatch(applyCoupon(coupon.code))
      : dispatch(checkCoupon(coupon.code))
}
  
  className="text-xs bg-black text-white px-3 py-1 rounded"
>
  {appliedCoupon?.code === coupon.code ? "Remove" : "Apply"}
</button>
                  </div>
                ))}

              </div>
            )}
          </div>

          <button
  onClick={handleCheckout}
  className="w-full bg-black text-white text-sm py-4 mt-6 rounded-full hover:bg-gray-900"
>
  Checkout
</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
