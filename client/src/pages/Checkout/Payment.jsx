import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, confirmOrder } from "../../actions/orderActions";
import { getCart } from "../../actions/cartActions";

const Payment = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [bagOpen, setBagOpen] = useState(false);
const [addressOpen, setAddressOpen] = useState(true);
const [priceOpen, setPriceOpen] = useState(false);
const { appliedCoupon } = useSelector((state) => state.coupon);

  const { selectedAddress, totalPrice } = location.state || {};

  const { cartItems } = useSelector((state) => state.cart);

  const [method, setMethod] = useState("upi");

  useEffect(() => {
    if (!selectedAddress) {
      navigate("/checkout");
    }
      dispatch(getCart());
  }, [selectedAddress, navigate]);

  if (!selectedAddress) return null;

  const cartId = cartItems?._id;
  const addressId = selectedAddress?._id;

  const handlePayment = async () => {

    try {

      const razorpayOrder = await dispatch(
        createOrder(cartId, addressId, {
          paymentMethod: "razorpay"
        })
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: "INR",
        order_id: razorpayOrder.id,

        handler: async function (response) {

          await dispatch(
            confirmOrder(
              cartId,
              addressId,
              {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              }
            )
          );

          alert("Order placed successfully");

        }
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error(error);
    }

  };
  const bagTotal = cartItems?.reduce(
  (sum, item) => sum + item.priceSnapshot * item.quantity,
  0
);
let discountAmount = 0;

if (appliedCoupon) {
  if (appliedCoupon.discountType === "percentage") {
    discountAmount =
      (bagTotal * appliedCoupon.discountPercentage) / 100;
  } else {
    discountAmount = appliedCoupon.discountValue;
  }
}
const finalPrice = bagTotal - discountAmount;

  return (

    <div className="max-w-[1200px] mx-auto px-4 py-16 grid lg:grid-cols-[65%_35%] gap-10">

      {/* LEFT SIDE */}

      <div>

        <h1 className="text-3xl font-semibold mb-2">
          Choose payment method
        </h1>

        <p className="text-gray-500 mb-8">
          Choose the payment method you prefer
        </p>


        <div className="border rounded-2xl overflow-hidden grid md:grid-cols-[260px_1fr]">

          {/* PAYMENT OPTIONS */}

          <div className="border-r">

            <div
              onClick={() => setMethod("upi")}
              className={`p-5 cursor-pointer ${
                method === "upi" ? "bg-gray-100" : ""
              }`}
            >
              <p className="font-medium">UPI</p>
              <p className="text-sm text-gray-500">
                Google Pay, PhonePe, Paytm & more
              </p>
            </div>


            <div
              onClick={() => setMethod("card")}
              className={`p-5 cursor-pointer ${
                method === "card" ? "bg-gray-100" : ""
              }`}
            >
              <p className="font-medium">Credit / Debit Card</p>
              <p className="text-sm text-gray-500">
                Visa, Mastercard, Rupay
              </p>
            </div>


            <div
              onClick={() => setMethod("netbanking")}
              className={`p-5 cursor-pointer ${
                method === "netbanking" ? "bg-gray-100" : ""
              }`}
            >
              <p className="font-medium">Net Banking</p>
              <p className="text-sm text-gray-500">
                Pay through your bank
              </p>
            </div>

          </div>


          {/* PAYMENT PANEL */}

          <div className="p-8">

            {method === "upi" && (

              <>
                <h2 className="text-xl font-semibold mb-4">
                  Pay with UPI
                </h2>

                <p className="text-gray-500 mb-6">
                  Scan QR code or use UPI apps
                </p>

                <button
                  onClick={handlePayment}
                  className="bg-black text-white px-8 py-3 rounded-full mt-6"
                >
                  Scan & Pay ₹{finalPrice}
                </button>
              </>
            )}

            {method === "card" && (

              <>
                <h2 className="text-xl font-semibold mb-4">
                  Pay with Card
                </h2>

                <button
                  onClick={handlePayment}
                  className="bg-black text-white px-8 py-3 rounded-full mt-6"
                >
                  Pay ₹{totalPrice}
                </button>
              </>
            )}

            {method === "netbanking" && (

              <>
                <h2 className="text-xl font-semibold mb-4">
                  Net Banking
                </h2>

                <button
                  onClick={handlePayment}
                  className="bg-black text-white px-8 py-3 rounded-full mt-6"
                >
                  Pay ₹{totalPrice}
                </button>
              </>
            )}

          </div>

        </div>

      </div>



      {/* RIGHT SIDE */}

      <div className="space-y-4">

  {/* BAG */}

  <div className="border rounded-xl overflow-hidden">

    <div
      onClick={() => setBagOpen(!bagOpen)}
      className="flex justify-between items-center p-5 cursor-pointer"
    >
      <span className="font-medium">Bag</span>
      <span>{cartItems?.length} Items</span>
    </div>

    {bagOpen && (

      <div className="border-t p-5 space-y-4">

        {cartItems?.map((item) => {

          const product = item.product;

          return (

            <div
              key={`${product._id}-${item.size}`}
              className="flex gap-3 border-t pt-4"
            >

              <img
                src={product?.images?.[0]?.url}
                className="w-14 h-14 object-cover rounded"
              />

              <div className="flex-1 text-sm">

                <p className="font-medium">
                  {product.title}
                </p>

                <p className="text-gray-500">
                  Size {item.size}
                </p>

                <p className="text-gray-500">
                  Qty {item.quantity}
                </p>

              </div>

              <div className="text-sm font-semibold">
                ₹{item.priceSnapshot}
              </div>

            </div>

          );

        })}

      </div>

    )}

  </div>



  {/* DELIVER TO */}

  <div className="border rounded-xl overflow-hidden">

    <div
      onClick={() => setAddressOpen(!addressOpen)}
      className="flex justify-between items-center p-5 cursor-pointer"
    >

      <span className="font-medium">
        Deliver to
      </span>

      <span className="text-sm text-gray-500">
        {selectedAddress.name}, {selectedAddress.pinCode}
      </span>

    </div>

    {addressOpen && (

      <div className="border-t p-5 text-sm text-gray-600">

        <p>{selectedAddress.address}</p>
        <p>{selectedAddress.city}</p>
        <p>{selectedAddress.state}</p>
        <p>{selectedAddress.mobileNo}</p>

      </div>

    )}

  </div>



  {/* PRICE DETAILS */}

  <div className="border rounded-xl overflow-hidden">

    <div
      onClick={() => setPriceOpen(!priceOpen)}
      className="flex justify-between items-center p-5 cursor-pointer"
    >

      <span className="font-medium">
        Price Details
      </span>

      <span>₹{finalPrice}</span>

    </div>

    {priceOpen && (

  <div className="border-t p-5 space-y-3 text-sm">

    <div className="flex justify-between">
      <span>Bag Total</span>
      <span>₹{bagTotal}</span>
    </div>

    {appliedCoupon && (
      <div className="flex justify-between text-green-600">
        <span>Coupon ({appliedCoupon.code})</span>
        <span>- ₹{discountAmount}</span>
      </div>
    )}

    <div className="flex justify-between">
      <span>Shipping</span>
      <span className="text-green-600">Free</span>
    </div>

    <div className="flex justify-between font-semibold border-t pt-3">
      <span>You Pay</span>
      <span>₹{finalPrice}</span>
    </div>

  </div>

)}
  </div>



  {/* FOOTER */}

  <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded text-center">
    Powered by UiX Fashion Limited
  </div>

</div>

    </div>

  );

};

export default Payment;