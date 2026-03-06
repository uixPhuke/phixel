import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

const CartPage = () => {
  const dispatch = useDispatch();

  const { cartItems, guestCartItems, loading } = useSelector(
    (state) => state.cart,
  );

  const token = localStorage.getItem("token");

  // ============================
  // AUTO LOAD + AUTO SYNC
  // ============================
  useEffect(() => {
    if (token && guestCartItems.length > 0) {
      dispatch(syncGuestCart(guestCartItems));
    } else if (token) {
      dispatch(getCart());
    }
  }, [dispatch, token]);

  // ============================
  // Decide cart source
  // ============================
  const itemsToShow = token ? cartItems : guestCartItems;

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

          {loading && <p>Loading...</p>}

          {itemsToShow.length === 0 && (
            <p className="text-gray-500">Your cart is empty.</p>
          )}

          <div className="space-y-6">
            {itemsToShow.map((item) => {
              const product = item.product;

              return (
                <div
                  key={`${token ? product._id : item.productID}-${item.size}`}
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
                              ? token
                                ? dispatch(
                                    removeFromCart(product._id, item.size),
                                  )
                                : dispatch(
                                    removeFromGuestCart({
                                      productID: item.productID,
                                      size: item.size,
                                    }),
                                  )
                              : token
                                ? dispatch(
                                    updateCartQuantity(
                                      product._id,
                                      item.size,
                                      item.quantity - 1,
                                    ),
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
                            token
                              ? dispatch(
                                  updateCartQuantity(
                                    product._id,
                                    item.size,
                                    item.quantity + 1,
                                  ),
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

            <div className="border-t pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(subtotalToShow)}</span>
            </div>

            <p className="text-xs text-gray-500">Inclusive of all taxes</p>
          </div>

          <button className="w-full bg-black text-white text-sm py-4 mt-6 rounded-full hover:bg-gray-900">
            Checkout
          </button>

          <div className="mt-6">
            <p className="text-xs text-gray-500 mb-2">
              ACCEPTED PAYMENT METHODS
            </p>
            <div className="flex gap-2 text-sm">
              <span>VISA</span>
              <span>Mastercard</span>
              <span>RuPay</span>
              <span>UPI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
