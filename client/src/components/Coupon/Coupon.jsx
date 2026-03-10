import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  applyCoupon,
  removeCoupon,
  checkCoupon
} from "../../actions/couponActions";

import { IoCloseCircle } from "react-icons/io5";

const Coupon = () => {

  const dispatch = useDispatch();

  const { appliedCoupon, loading } = useSelector(
    (state) => state.coupon
  );

  const [code, setCode] = useState("");

  const handleApply = () => {

    if (!code.trim()) {
      alert("Enter coupon code");
      return;
    }

    dispatch(checkCoupon(code));

    dispatch(applyCoupon(code));

  };

  const handleRemove = () => {

    dispatch(removeCoupon());

    setCode("");

  };

  return (

    <div className="border rounded-lg p-5 mt-6 bg-white">

      <h2 className="font-semibold mb-3">
        Coupon Code
      </h2>

      {/* INPUT */}

      <div className="flex gap-3">

        <input
          type="text"
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <button
          onClick={handleApply}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Apply
        </button>

      </div>


      {/* APPLIED COUPON */}

      {appliedCoupon && (

        <div className="mt-4 flex justify-between items-center bg-green-100 p-3 rounded">

          <div>

            <p className="font-semibold">
              Coupon Applied
            </p>

            <p className="text-sm">
              {appliedCoupon.code}
            </p>

          </div>

          <IoCloseCircle
            onClick={handleRemove}
            className="text-2xl cursor-pointer"
          />

        </div>

      )}

    </div>

  );

};

export default Coupon;