import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getUser } from "../../actions/userActions";
import { getUserOrders } from "../../actions/orderActions";

import { Loader } from "../../components/Global/Loader";
import { UnAuthorized } from "../../components/Global/UnAuthorized";
import { getWishlist } from "../../actions/wishlistActions";
import { addAddress,getAddresses } from "../../actions/addressActions";
import AddressSection from "../../components/Profile/AddressSection";

import {
  FiHome,
  FiUser,
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiHeart,
  FiShoppingCart,
  FiTrendingUp,
} from "react-icons/fi";


const getInitials = (firstName, lastName) => {
  if (!firstName || !lastName) return "";
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

const firstUpper = (name) => {
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
};

const OrderTimeline = ({ order }) => {
  return (
    <div className="relative pl-8 border-l border-gray-200 py-4">
      <div className="absolute -left-2 top-4 w-4 h-4 bg-black rounded-full"></div>

      <p className="font-medium">Order #{order._id.slice(-6)}</p>

      <p className="text-sm text-[var(--color-accent)]">
        {new Date(order.placedAt).toLocaleDateString()}
      </p>

      <p className="text-sm mt-1">₹{order.totalAmount}</p>

      <p
        className={`text-xs mt-1 capitalize ${
          order.orderStatus === "delivered"
            ? "text-green-600"
            : order.orderStatus === "cancelled"
            ? "text-red-600"
            : "text-yellow-600"
        }`}
      >
        {order.orderStatus}
      </p>
      {/* VIEW DETAILS LINK */}
      <Link
        to={`/order/${order._id}`}
        className="text-blue-500 text-xs mt-2 inline-block hover:underline"
      >
        View Details
      </Link>
    </div>
  );
};


const Profile = () => {
  const dispatch = useDispatch();

  const {
    isLogin,
    user = {},
    loading,
    authLoading,
  } = useSelector((state) => state.user);




const addresses = useSelector((state) => state.address?.addresses) || [];
console.log("Addresses from Redux:", addresses);
const wishlist = useSelector((state) => state.wishlist?.wishlistItems) || [];

const orders = useSelector((state) => state.order?.orders) || [];

  const [activeSection, setActiveSection] = useState("dashboard");

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    dispatch(getUser());
    dispatch(getUserOrders());
     dispatch(getWishlist());
     dispatch(getAddresses());
     console.log("Fetching addresses...",user)
  }, [dispatch]);

  useEffect(() => {
    if (!authLoading) {
      setAuthChecked(true);
    }
  }, [authLoading]);

  if (!authChecked || authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  

  const samplePaymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4235",
      expiry: "12/25",
      isDefault: true,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary py-8 px-4 pt-36">
      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : isLogin ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-primary mb-8">My Account</h1>

          <div className="flex flex-col md:flex-row gap-8 text-sm">
            {/* SIDEBAR */}

            <div className=" ">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full font-semibold">
                    {getInitials(user.firstName, user.lastName)}
                  </div>

                  <div>
                    <p className="font-semibold">
                      {firstUpper(user.firstName)} {firstUpper(user.lastName)}
                    </p>

                    <p className="text-sm text-[var(--color-accent)]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
                    { id: "profile", label: "Profile", icon: <FiUser /> },
                    { id: "orders", label: "Orders", icon: <FiPackage /> },
                    { id: "addresses", label: "Addresses", icon: <FiMapPin /> },
                    {
                      id: "payments",
                      label: "Payments",
                      icon: <FiCreditCard />,
                    },
                    { id: "wishlist", label: "Wishlist", icon: <FiHeart /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition
${activeSection === item.id ? "bg-black text-white" : "hover:bg-gray-100"}`}
                    >
                      {item.icon}

                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <Link
                to="/cart"
                className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl mt-6 hover:opacity-80 transition"
              >
                <FiShoppingCart />
                View Cart
              </Link>
            </div>

            {/* MAIN */}

            <div className="flex-1">
              {/* DASHBOARD */}

              {activeSection === "dashboard" && (
                <div className="space-y-8">
                  {/* ACCOUNT STATS */}

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white border rounded-xl p-6 flex gap-4">
                      <FiPackage size={22} />

                      <div>
                        <p className="text-xl font-semibold">{orders.length}</p>

                        <p className="text-sm text-[var(--color-accent)]">
                          Orders
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border rounded-xl p-6 flex gap-4">
                      <FiHeart size={22} />

                      <div>
                        <p className="text-xl font-semibold">{wishlist.length}</p>

                        <p className="text-sm text-[var(--color-accent)]">
                          Wishlist
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border rounded-xl p-6 flex gap-4">
                      <FiTrendingUp size={22} />

                      <div>
                        <p className="text-xl font-semibold">
  ₹{orders.reduce((acc, o) => acc + o.totalAmount, 0)}
</p>

                        <p className="text-sm text-[var(--color-accent)]">
                          Spent
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RECENT ORDERS */}

                  <div className="bg-white border rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Recent Orders
                    </h2>

                    {orders.length > 0 ? (
                      orders.slice(0, 3).map((order) => (
  <OrderTimeline key={order._id} order={order} />
))
                    ) : (
                      <p className="text-[var(--color-accent)]">
                        No recent orders
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* PROFILE */}

              {activeSection === "profile" && (
                <div className="bg-white border rounded-xl p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[var(--color-accent)]">
                      First Name
                    </p>

                    <p>{firstUpper(user.firstName)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--color-accent)]">
                      Last Name
                    </p>

                    <p>{firstUpper(user.lastName)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--color-accent)]">Email</p>

                    <p>{user.email}</p>
                  </div>
                </div>
              )}

              {/* ORDERS */}

              {activeSection === "orders" && (
                <div className="bg-white border rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-6">Order History</h2>

                  {orders.length > 0 ? (
                   orders.map((order) => (
  <OrderTimeline key={order._id} order={order} />
))
                  ) : (
                    <p className="text-[var(--color-accent)]">No orders yet</p>
                  )}
                </div>
              )}

              {/* ADDRESSES */}

              {activeSection === "addresses" && (
   <AddressSection addresses={addresses} />
   
)}

              {/* PAYMENTS */}

              {activeSection === "payments" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {samplePaymentMethods.map((card) => (
                    <div key={card.id} className="border rounded-xl p-5">
                      <p className="font-medium">**** **** **** {card.last4}</p>

                      <p className="text-sm text-[var(--color-accent)]">
                        Expires {card.expiry}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* WISHLIST */}

              {activeSection === "wishlist" && (
  <div className="grid md:grid-cols-3 gap-6">

    {wishlist.length > 0 ? (
      wishlist.map((item) => (

        <div
          key={item._id}
          className="border rounded-xl p-4 bg-white"
        >
          <img
            src={item.images[0]?.url}
            alt={item.title}
            className="w-full h-40 object-cover rounded"
          />

          <h3 className="mt-3 font-semibold">
            {item.title}
          </h3>

          <p className="text-sm text-gray-500">
            ₹{item.sellingPrice}
          </p>

          <Link
            to={`/products/${item._id}`}
            className="text-blue-500 text-sm"
          >
            View Product
          </Link>

        </div>

      ))
    ) : (

      <div className="text-center col-span-3 py-12">
        <FiHeart size={28} className="mx-auto mb-4" />

        <p className="text-[var(--color-accent)] mb-4">
      Your wishlist is empty
    </p>

    <Link
      to="/products"
      className="bg-black text-white px-6 py-2 rounded-lg"
    >
      Browse Products
    </Link>
      </div>

    )}

  </div>
)}
            </div>
          </div>
        </div>
      ) : (
        <UnAuthorized />
      )}
    </div>
  );
};

export default Profile;
