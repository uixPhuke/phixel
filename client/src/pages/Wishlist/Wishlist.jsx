import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeFromWishlist } from "../../actions/wishlistActions";
import {  useState } from "react";
import { formatPrice } from "../../utils/productHelpers";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { setShowLoginModalTrue } from "../../slices/userSlice";
import { addToCart } from "../../actions/cartActions";
import { addToGuestCart } from "../../slices/cartSlice";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlistItems, loading } = useSelector((state) => state.wishlist);
   const { isLogin } = useSelector((state) => state.user);
   const [movedItems, setMovedItems] = useState([]);

  useEffect(() => {
    if (isLogin) {
      dispatch(getWishlist());
    }
  }, [dispatch, isLogin]);

      const handleAddToCart = (product) => {

  const token = localStorage.getItem("token");

  if (!token) {
    dispatch(
      addToGuestCart({
        productID: product._id,
        quantity: 1,
        size: product.sizes?.[0],
        priceSnapshot: product.sellingPrice,
        product,
      })
    );
  } else {
    dispatch(
      addToCart({
        productID: product._id,
        quantity: 1,
        size: product.sizes?.[0],
      })
    );
  }
  setMovedItems((prev) => [...prev, product._id]);
};
   
  // ==============================
  // NOT LOGGED IN UI
  // ==============================
  if (!isLogin) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
        <h2 className="text-xl font-medium mb-3">
          Please login to view your wishlist
        </h2>

        <p className="text-gray-500 mb-6">
          Save your favourite products and access them anytime.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-black text-white text-sm rounded"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-xl font-medium">
          Favourites{" "}
          <span className="text-gray-500 text-sm">
            · {wishlistItems?.length || 0} products
          </span>
        </h1>
      </div>

      {/* ==============================
          LOADING STATE
      ============================== */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 w-full rounded"></div>
              <div className="mt-4 h-4 bg-gray-200 w-3/4"></div>
              <div className="mt-2 h-4 bg-gray-200 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : wishlistItems?.length === 0 ? (

        /* ==============================
            EMPTY WISHLIST
        ============================== */

        <p className="text-gray-500">Your wishlist is empty.</p>

      ) : (

        /* ==============================
            WISHLIST GRID
        ============================== */

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
          {wishlistItems.map((product) => (
            <div key={product._id} className="relative group">

              {/* REMOVE BUTTON */}
              <button
                onClick={() => dispatch(removeFromWishlist(product._id))}
                className="absolute top-0 right-0 z-10 w-9 h-9 flex items-center justify-center"
              >
                <IoClose className="text-black" size={18} />
              </button>

              {/* IMAGE */}
              <div className="w-full aspect-[4/3] flex items-center justify-center bg-white">
                <img
                  src={product.images?.[0]?.url}
                  alt={product.title}
                  className="max-h-[220px] object-contain"
                />
              </div>

              {/* PRODUCT INFO */}
              <div className="mt-6 space-y-1">
                <p className="text-sm font-medium">{product.title}</p>

                <p className="text-sm text-gray-600 leading-snug">
                  {product.description?.length > 100
                    ? product.description.substring(0, 100) + "..."
                    : product.description}
                </p>

                {/* PRICE */}
                <div className="flex items-baseline gap-3">
                  <span className="text-[clamp(1.5rem,2.4vw,1.9rem)] font-semibold text-gray-900 leading-none">
                    {formatPrice(product.sellingPrice)}
                  </span>

                  {product.totalPrice > product.sellingPrice && (
                    <span className="text-sm text-gray-400 line-through leading-none">
                      {formatPrice(product.totalPrice)}
                    </span>
                  )}
                </div>

                {/* MOVE TO BAG */}
               <button
  onClick={() => handleAddToCart(product)}
  disabled={movedItems.includes(product._id)}
  className={`
    mt-4 px-6 py-2 rounded-full text-sm transition
    ${
      movedItems.includes(product._id)
        ? "bg-black text-white border-black"
        : "border hover:border-black"
    }
  `}
>
  {movedItems.includes(product._id) ? "Moved" : "Move to Bag"}
</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;