import React, { useEffect, useState } from "react";
import CouponCard from "./CouponCard";
import { useDispatch, useSelector } from "react-redux";
import {
  applyCoupon,
  removeCoupon,
  getAllCoupons
} from "../../actions/couponActions";

const CouponSection = () => {

  const dispatch = useDispatch();

  const { coupons, appliedCoupon } = useSelector(
    (state) => state.coupon
  );

  const [manualCode, setManualCode] = useState("");

  // Load coupons
  useEffect(() => {
    dispatch(getAllCoupons());
  }, [dispatch]);

  const handleApply = (code) => {
    dispatch(applyCoupon(code));
  };

  const handleManualApply = () => {
    if (!manualCode.trim()) return;
    dispatch(applyCoupon(manualCode));
  };

  const handleRemove = () => {
    dispatch(removeCoupon());
  };

  return (

    <div className="border rounded-2xl p-6 mt-6">

      <h2 className="font-semibold mb-4">
        Available Coupons
      </h2>

      {/* COUPON LIST */}

      <div className="space-y-3">

        {coupons.map((coupon) => (

          <CouponCard
            key={coupon._id}
            coupon={coupon}
            onApply={handleApply}
          />

        ))}

      </div>

      {/* MANUAL COUPON */}

      <div className="mt-6">

        <p className="text-sm font-medium mb-2">
          Enter Coupon Code
        </p>

        <div className="flex gap-2">

          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Enter coupon code"
            className="border px-3 py-2 rounded w-full"
          />

          <button
            onClick={handleManualApply}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Apply
          </button>

        </div>

      </div>

      {/* APPLIED COUPON */}

      {appliedCoupon && (

        <div className="mt-4 bg-green-100 p-3 rounded flex justify-between">

          <span>
            Applied: {appliedCoupon.code}
          </span>

          <button
            onClick={handleRemove}
            className="text-red-500"
          >
            Remove
          </button>

        </div>

      )}

    </div>

  );

};

export default CouponSection;