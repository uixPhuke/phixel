import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getCart } from "../../actions/cartActions";

const API = import.meta.env.VITE_API_KEY;

const CouponPage = () => {

  const dispatch = useDispatch();

  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualC      ode, setManualCode] = useState("");

  const config = {
    withCredentials: true
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // ==============================
  // FETCH ALL COUPONS
  // ==============================

  const fetchCoupons = async () => {

    try {

      const { data } = await axios.get(
        `${API}/api/v7/discount`,
        config
      );

      setCoupons(data.discounts || []);

    } catch (err) {

      toast.error("Failed to load coupons");

    }

  };

  // ==============================
  // APPLY COUPON
  // ==============================

  const applyCoupon = async (code) => {

    try {

      setLoading(true);

      const { data } = await axios.post(
        `${API}/api/v7/discount/apply`,
        { code },
        config
      );

      toast.success(data.message || "Coupon applied");

      setAppliedCoupon(data.discount);

      dispatch(getCart());

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Failed to apply coupon"
      );

    } finally {

      setLoading(false);

    }

  };

  // ==============================
  // REMOVE COUPON
  // ==============================

  const removeCoupon = async () => {

    try {

      const { data } = await axios.post(
        `${API}/api/v7/discount/remove`,
        {},
        config
      );

      toast.success(data.message || "Coupon removed");

      setAppliedCoupon(null);

      dispatch(getCart());

    } catch (err) {

      toast.error("Failed to remove coupon");

    }

  };

  // ==============================
  // APPLY MANUAL CODE
  // ==============================

  const handleManualApply = () => {

    if (!manualCode.trim()) {
      toast.error("Enter coupon code");
      return;
    }

    applyCoupon(manualCode);

  };

  return (

    <div className="max-w-[1200px] mx-auto py-20">

      <h1 className="text-3xl font-semibold mb-10">
        Available Coupons
      </h1>

      {/* ================= APPLIED COUPON ================= */}

      {appliedCoupon && (

        <div className="bg-green-100 border border-green-300 p-4 rounded mb-10 flex justify-between items-center">

          <div>

            <p className="font-semibold">
              Applied Coupon
            </p>

            <p>
              {appliedCoupon.code}
            </p>

          </div>

          <button
            onClick={removeCoupon}
            className="text-red-500"
          >
            Remove
          </button>

        </div>

      )}

      {/* ================= MANUAL COUPON INPUT ================= */}

      <div className="border rounded-lg p-5 mb-10">

        <p className="font-medium mb-2">
          Enter Coupon Code
        </p>

        <div className="flex gap-2">

          <input
            type="text"
            placeholder="Enter coupon code"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />

          <button
            onClick={handleManualApply}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Apply
          </button>

        </div>

      </div>

      {/* ================= COUPON LIST ================= */}

      <div className="grid md:grid-cols-3 gap-6">

        {coupons.map((coupon) => (

          <div
            key={coupon._id}
            className="relative bg-yellow-400 text-white p-6 rounded-xl shadow-md"
          >

            {/* cut edges */}
            <div className="absolute -left-3 top-0 bottom-0 w-6 bg-white rounded-full"></div>
            <div className="absolute -right-3 top-0 bottom-0 w-6 bg-white rounded-full"></div>

            <h2 className="text-xl font-bold">
              {coupon.code}
            </h2>

            <p className="mt-2 text-sm">
              {coupon.description}
            </p>

            <p className="mt-2 font-semibold">

              {coupon.discountType === "percentage"
                ? `${coupon.discountPercentage}% OFF`
                : `₹${coupon.discountValue} OFF`}

            </p>

            <button
              onClick={() => applyCoupon(coupon.code)}
              disabled={loading}
              className="mt-4 bg-white text-yellow-500 font-semibold px-4 py-2 rounded"
            >
              Apply
            </button>

          </div>

        ))}

      </div>

    </div>

  );

};

export default CouponPage;