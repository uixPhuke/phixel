import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getWishlist,
  removeFromWishlist,
} from "../../actions/wishlistActions";
import { addToCart } from "../../actions/cartActions";
import { formatPrice } from "../../utils/productHelpers";

const WishlistPage = () => {
  const dispatch = useDispatch();

  const { wishlistItems, loading } = useSelector(
    (state) => state.wishlist
  );

  const token = localStorage.getItem("token");

  // ============================
  // LOAD WISHLIST ON PAGE LOAD
  // ============================
  useEffect(() => {
    if (token) {
      dispatch(getWishlist());
    }
  }, [dispatch, token]);

  if (!token) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-medium mb-2">
          Please login to view your wishlist
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-wide">
          MY WISHLIST{" "}
          <span className="text-gray-500 text-base">
            ({wishlistItems.length} items)
          </span>
        </h1>
      </div>

      {loading && <p>Loading...</p>}

      {wishlistItems.length === 0 && (
        <p className="text-gray-500">Your wishlist is empty.</p>
      )}

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((product) => (
          <div
            key={product._id}
            className="relative border bg-white flex flex-col"
          >
            {/* REMOVE (X) */}
            <button
              onClick={() => dispatch(removeFromWishlist(product._id))}
              className="
                absolute
                top-3
                right-3
                w-8
                h-8
                border
                bg-white
                flex
                items-center
                justify-center
                text-lg
                hover:border-black
              "
            >
              ✕
            </button>

            {/* IMAGE */}
            <div className="bg-gray-100 aspect-square flex items-center justify-center">
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="object-contain w-full h-full"
              />
            </div>

            {/* INFO */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">
                  {product.name}
                </h3>

                <p className="text-sm">
                  {formatPrice(product.price)}
                </p>

                {product.originalPrice && (
                  <p className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)} Original price
                  </p>
                )}

                {product.color && (
                  <p className="text-xs text-gray-500">
                    Colour: {product.color}
                  </p>
                )}
              </div>

              {/* ADD TO BAG */}
              <button
                onClick={() =>
                  dispatch(
                    addToCart({
                      productID: product._id,
                      quantity: 1,
                      size: product.sizes?.[0],
                    })
                  )
                }
                className="
                  mt-4
                  w-full
                  bg-black
                  text-white
                  py-3
                  px-4
                  flex
                  items-center
                  justify-between
                  text-sm
                  hover:bg-gray-900
                "
              >
                Add to bag
                <span className="text-lg">👜</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
