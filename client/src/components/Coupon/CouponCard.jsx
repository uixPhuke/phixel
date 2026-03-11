import React from "react";

const CouponCard = ({ coupon, onApply }) => {

  const discountText =
    coupon.discountType === "percentage"
      ? `${coupon.discountPercentage}% OFF`
      : `₹${coupon.discountValue} OFF`;

  return (

    <div className="relative bg-yellow-400 text-white rounded-xl p-4 flex justify-between items-center shadow-md">

      {/* Left cut */}
      <div className="absolute -left-3 top-0 bottom-0 w-6 bg-white rounded-full"></div>

      {/* Right cut */}
      <div className="absolute -right-3 top-0 bottom-0 w-6 bg-secondary rounded-full"></div>

      <div>

        <p className="font-bold text-lg">
          {coupon.code}
        </p>

        <p className="text-sm">
          {discountText}
        </p>

      </div>

      <button
        onClick={() => onApply(coupon.code)}
        className="bg-white text-yellow-500 font-semibold px-3 py-1 rounded-md"
      >
        Apply
      </button>

    </div>

  );
};

export default CouponCard;