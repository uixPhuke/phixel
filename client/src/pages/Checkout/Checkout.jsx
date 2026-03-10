import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAddresses } from "../../actions/addressActions";
import { useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import AddressSection from "../../components/Profile/AddressSection";
import { getCart } from "../../actions/cartActions";

const Checkout = () => {

  const dispatch = useDispatch();
  const location = useLocation();

  const { totalPrice } = location.state || {};

  const { addresses } = useSelector((state) => state.address);
  const { cartItems, guestCartItems } = useSelector((state) => state.cart);
  const { isLogin } = useSelector((state) => state.user);
  const { appliedCoupon } = useSelector((state) => state.coupon);

  const itemsToShow = isLogin ? cartItems : guestCartItems;

  const [bagOpen, setBagOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(false);
useEffect(() => {
  dispatch(getAddresses());

  if (isLogin) {
    dispatch(getCart());
  }
}, [dispatch, isLogin]);



  // BAG TOTAL

  const bagTotal = itemsToShow?.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity,
    0
  );



  // COUPON DISCOUNT

  let discountAmount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount =
        (bagTotal * appliedCoupon.discountPercentage) / 100;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }



  return (

    <div className="max-w-[1280px] mx-auto px-4 py-10 grid lg:grid-cols-[65%_35%] gap-10">

      {/* LEFT SIDE */}

      <div>

        <h1 className="text-xl md:text-3xl font-semibold mb-2">
          Choose Address
        </h1>

        <p className="text-gray-500 mb-6 text-sm md:text-base">
          Detailed address will help our delivery partner reach your doorstep quickly
        </p>

        <AddressSection
          addresses={addresses}
          checkoutMode={true}
          totalPrice={totalPrice}
        />

      </div>



      {/* RIGHT SIDE */}

      <div className="space-y-4 lg:sticky  lg:top-24 h-fit">

        {/* BAG */}

        <div className="border rounded-xl overflow-hidden">

          <div
            onClick={() => setBagOpen(!bagOpen)}
            className="flex justify-between items-center p-4 cursor-pointer"
          >

            <span className="font-medium">
              Bag
            </span>

            <div className="flex items-center gap-2 text-sm text-gray-500">

              {itemsToShow?.length} Items

              {bagOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}

            </div>

          </div>


          {bagOpen && (

            <div className="max-h-[320px] overflow-y-auto px-4 pb-4 space-y-4">

              {itemsToShow?.map((item) => {

                const product = item.product;

                return (

                  <div
                    key={`${product?._id}-${item.size}`}
                    className="flex gap-3 border-t pt-4"
                  >

                    <img
                      src={product?.images?.[0]?.url}
                      className="w-16 h-16 object-cover rounded"
                      alt={product?.title}
                    />

                    <div className="flex-1 text-sm">

                      <p className="font-medium line-clamp-1">
                        {product?.title}
                      </p>

                      <p className="text-gray-500 text-xs">
                        Size {item.size}
                      </p>

                      <p className="text-gray-500 text-xs">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <div className="text-sm font-medium">

                      ₹{item.priceSnapshot}

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </div>



        {/* PRICE DETAILS */}

        <div className="border rounded-xl overflow-hidden">

          <div
            onClick={() => setPriceOpen(!priceOpen)}
            className="flex justify-between items-center p-4 cursor-pointer"
          >

            <span className="font-medium">
              Price Details
            </span>

            <div className="flex items-center gap-2">

              ₹{totalPrice}

              {priceOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}

            </div>

          </div>


          {priceOpen && (

            <div className="px-4 pb-4 text-sm space-y-3 border-t">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Bag Total
                </span>
                <span>₹{bagTotal}</span>
              </div>


              {appliedCoupon && (

                <div className="flex justify-between text-green-600">

                  <span>
                    Coupon ({appliedCoupon.code})
                  </span>

                  <span>
                    - ₹{discountAmount}
                  </span>

                </div>

              )}


              <div className="flex justify-between">
                <span className="text-gray-500">
                  Shipping Charges
                </span>
                <span className="text-green-600">
                  Free
                </span>
              </div>


              <div className="flex justify-between font-semibold pt-2 border-t">

                <span>You Pay</span>

                <span>₹{totalPrice}</span>

              </div>

            </div>

          )}

        </div>


        {/* FOOTER */}

        <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded text-center">

          Powered by uix Fashion Limited

        </div>

      </div>

    </div>

  );

};

export default Checkout;