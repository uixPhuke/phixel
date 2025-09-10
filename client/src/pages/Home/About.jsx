import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UnAuthorized } from "../../components/Global/UnAuthorized";
import { getUser, getOrders } from "../../actions/userActions";
import { Loader } from "../../components/Global/Loader";

const getInitials = (firstName, lastName) => {
  const str = firstName.charAt(0) + lastName.charAt(0);
  return str.toUpperCase();
};

const firstUpper = (name) => {
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
};

// Order Item Component
const OrderItem = ({ order }) => {
  return (
    <div className="border-b border-[#EAE3D4] py-3 last:border-b-0">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-[#232222]">Order #{order.id}</p>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.date).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">${order.total.toFixed(2)}</p>
          <p
            className={`text-xs font-medium ${
              order.status === "Delivered"
                ? "text-green-600"
                : order.status === "Processing"
                ? "text-yellow-600"
                : "text-blue-600"
            }`}
          >
            {order.status}
          </p>
        </div>
      </div>
      <div className="mt-2 flex justify-between">
        <Link
          to={`/orders/${order.id}`}
          className="text-sm text-[#b87253] hover:underline"
        >
          View Details
        </Link>
        {order.status === "Delivered" && (
          <button className="text-sm text-[#b87253] hover:underline">
            Return Item
          </button>
        )}
      </div>
    </div>
  );
};

// Address Item Component
const AddressItem = ({ address, isDefault }) => {
  return (
    <div className="border border-[#EAE3D4] rounded-md p-4 bg-white">
      {isDefault && (
        <span className="bg-[#EAE3D4] text-[#232222] text-xs px-2 py-1 rounded-full mb-2 inline-block">
          Default
        </span>
      )}
      <p className="font-medium">{address.name}</p>
      <p className="text-sm">{address.street}</p>
      <p className="text-sm">
        {address.city}, {address.state} {address.zipCode}
      </p>
      <p className="text-sm">{address.country}</p>
      <p className="text-sm mt-2">Phone: {address.phone}</p>
      <div className="mt-3 flex space-x-2">
        <button className="text-xs text-[#b87253] hover:underline">Edit</button>
        {!isDefault && (
          <button className="text-xs text-red-600 hover:underline">
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export const Profile = () => {
  const dispatch = useDispatch();
  const { isLogin, user, loading, authLoading } = useSelector(
    (state) => state.user
  );
  const orders = useSelector((state) => state.orders?.recentOrders || []);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    dispatch(getUser());
    dispatch(getOrders());
  }, [dispatch]);

  useEffect(() => {
    if (!authLoading) {
      setAuthChecked(true);
    }
  }, [authLoading]);

  if (!authChecked || authLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // Sample data for demonstration
  const sampleAddresses = [
    {
      id: 1,
      name: `${firstUpper(user.firstName)} ${firstUpper(user.lastName)}`,
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: user.phoneNo || "+1 (555) 123-4567",
      isDefault: true,
    },
    {
      id: 2,
      name: "Work Address",
      street: "456 Office Blvd",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      country: "United States",
      phone: "+1 (555) 987-6543",
      isDefault: false,
    },
  ];

  const samplePaymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4235",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "MasterCard",
      last4: "6789",
      expiry: "08/24",
      isDefault: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9f7f5] py-10 px-5 pt-36 md:pt-48">
      {loading ? (
        <div className="flex items-center justify-center mt-36">
          <Loader />
        </div>
      ) : isLogin ? (
        <div className="max-w-6xl mx-auto">
          <h1 className="heading-font text-2xl font-bold text-[#232222] mb-6">
            My Account
          </h1>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-1/4">
              <div className="bg-white shadow-md rounded-lg p-5 mb-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="cursive-font w-12 h-12 flex items-center justify-center text-lg font-bold bg-[#EAE3D4] text-[#232222] rounded-full shadow-md">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <div>
                    <h2 className="heading-font font-semibold text-[#232222]">
                      {firstUpper(user.firstName)} {firstUpper(user.lastName)}
                    </h2>
                    <p className="text-xs text-gray-500">{user.email.toLowerCase()}</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: "dashboard", label: "Dashboard", icon: "📊" },
                    { id: "profile", label: "Profile Information", icon: "👤" },
                    { id: "orders", label: "Order History", icon: "📦" },
                    { id: "addresses", label: "Addresses", icon: "🏠" },
                    { id: "payments", label: "Payment Methods", icon: "💳" },
                    { id: "wishlist", label: "Wishlist", icon: "❤️" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 ${
                        activeSection === item.id
                          ? "bg-[#EAE3D4] text-[#232222] font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <Link
                to="/cart"
                className="heading-font block text-center bg-[#b87253] text-white font-semibold px-4 py-3 rounded-md shadow hover:bg-[#a15a3e] transition mb-6"
              >
                View Cart
              </Link>
            </div>

            {/* Main Content Area */}
            <div className="w-full md:w-3/4">
              {/* Dashboard Section */}
              {activeSection === "dashboard" && (
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="heading-font text-xl font-semibold text-[#232222] mb-6">
                    Account Summary
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#f9f7f5] border border-[#EAE3D4] rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-[#b87253]">5</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="bg-[#f9f7f5] border border-[#EAE3D4] rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-[#b87253]">12</p>
                      <p className="text-sm text-gray-600">Wishlist Items</p>
                    </div>
                    <div className="bg-[#f9f7f5] border border-[#EAE3D4] rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-[#b87253]">2</p>
                      <p className="text-sm text-gray-600">Addresses</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="heading-font font-medium text-[#232222] mb-3">
                      Recent Orders
                    </h3>
                    <div className="border border-[#EAE3D4] rounded-md p-4 bg-[#f9f7f5]">
                      {orders.length > 0 ? (
                        orders.slice(0, 3).map((order) => (
                          <OrderItem key={order.id} order={order} />
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500">No recent orders</p>
                          <Link
                            to="/products"
                            className="inline-block mt-2 text-[#b87253] hover:underline"
                          >
                            Start Shopping
                          </Link>
                        </div>
                      )}
                    </div>
                    {orders.length > 0 && (
                      <Link
                        to="/orders"
                        className="inline-block mt-3 text-sm text-[#b87253] hover:underline"
                      >
                        View All Orders
                      </Link>
                    )}
                  </div>

                  <div>
                    <h3 className="heading-font font-medium text-[#232222] mb-3">
                      Default Address
                    </h3>
                    <div className="border border-[#EAE3D4] rounded-md p-4 bg-[#f9f7f5]">
                      {sampleAddresses
                        .filter((addr) => addr.isDefault)
                        .map((address) => (
                          <div key={address.id}>
                            <p className="font-medium">{address.name}</p>
                            <p className="text-sm">
                              {address.street}, {address.city}, {address.state}{" "}
                              {address.zipCode}
                            </p>
                            <p className="text-sm">{address.country}</p>
                            <Link
                              to="/addresses"
                              className="inline-block mt-2 text-sm text-[#b87253] hover:underline"
                            >
                              Manage Addresses
                            </Link>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Information Section */}
              {activeSection === "profile" && (
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="heading-font text-xl font-semibold text-[#232222] mb-6">
                    Profile Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="cursive-font text-sm text-[#b87253] font-medium">
                        First Name
                      </p>
                      <p className="cursive-font bg-[#f9f7f5] border border-[#EAE3D4] rounded-md px-4 py-2 mt-1 text-[#232222]">
                        {firstUpper(user.firstName)}
                      </p>
                    </div>
                    <div>
                      <p className="cursive-font text-sm text-[#b87253] font-medium">
                        Last Name
                      </p>
                      <p className="cursive-font bg-[#f9f7f5] border border-[#EAE3D4] rounded-md px-4 py-2 mt-1 text-[#232222]">
                        {firstUpper(user.lastName)}
                      </p>
                    </div>
                    <div>
                      <p className="cursive-font text-sm text-[#b87253] font-medium">
                        Email ID
                      </p>
                      <p className="cursive-font bg-[#f9f7f5] border border-[#EAE3D4] rounded-md px-4 py-2 mt-1 text-[#232222]">
                        {user.email.toLowerCase()}
                      </p>
                    </div>
                    <div>
                      <p className="cursive-font text-sm text-[#b87253] font-medium">
                        Username
                      </p>
                      <p className="cursive-font bg-[#f9f7f5] border border-[#EAE3D4] rounded-md px-4 py-2 mt-1 text-[#232222]">
                        {user.username ?? "Not Added"}
                      </p>
                    </div>
                    <div>
                      <p className="cursive-font text-sm text-[#b87253] font-medium">
                        Date of Birth
                      </p>
                      <p className="cursive-font bg-[#f9f7f5] border border-[#EAE3D4] rounded-md px-4 py-2 mt-1 text-[#232222]">
                        {user.dob
                          ? new Date(user.dob).toLocaleDateString("en-GB")
                          : "Not Added"}
                      </p>
                    </div>
                    <div>
                      <p className="cursive-font text-sm text-[#b87253] font-medium">
                        Country
                      </p>
                      <p className="cursive-font bg-[#f9f7f5] border border-[#EAE3D4] rounded-md px-4 py-2 mt-1 text-[#232222]">
                        {user.country ?? "Not Added"}
                      </p>
                    </div>
                    <div>
                      <p className="cursive-font text-sm text-[#b87253] font-medium">
                        Mobile Number
                      </p>
                      <p className="cursive-font bg-[#f9f7f5] border border-[#EAE3D4] rounded-md px-4 py-2 mt-1 text-[#232222]">
                        {user.phoneNo ?? "Not Added"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link
                      to="/profile/edit"
                      className="heading-font inline-block bg-[#b87253] text-white font-semibold px-6 py-2 rounded-md shadow hover:bg-[#a15a3e] transition"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              )}

              {/* Order History Section */}
              {activeSection === "orders" && (
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="heading-font text-xl font-semibold text-[#232222] mb-6">
                    Order History
                  </h2>

                  <div className="border border-[#EAE3D4] rounded-md divide-y divide-[#EAE3D4]">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <OrderItem key={order.id} order={order} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
                        <Link
                          to="/products"
                          className="heading-font inline-block bg-[#b87253] text-white font-semibold px-6 py-2 rounded-md shadow hover:bg-[#a15a3e] transition"
                        >
                          Start Shopping
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Addresses Section */}
              {activeSection === "addresses" && (
                <div className="bg-white shadow-md rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="heading-font text-xl font-semibold text-[#232222]">
                      Saved Addresses
                    </h2>
                    <button className="heading-font bg-[#b87253] text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-[#a15a3e] transition text-sm">
                      Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sampleAddresses.map((address) => (
                      <AddressItem
                        key={address.id}
                        address={address}
                        isDefault={address.isDefault}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods Section */}
              {activeSection === "payments" && (
                <div className="bg-white shadow-md rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="heading-font text-xl font-semibold text-[#232222]">
                      Payment Methods
                    </h2>
                    <button className="heading-font bg-[#b87253] text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-[#a15a3e] transition text-sm">
                      Add New Card
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {samplePaymentMethods.map((payment) => (
                      <div
                        key={payment.id}
                        className="border border-[#EAE3D4] rounded-md p-4 bg-white"
                      >
                        {payment.isDefault && (
                          <span className="bg-[#EAE3D4] text-[#232222] text-xs px-2 py-1 rounded-full mb-2 inline-block">
                            Default
                          </span>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-6 bg-gray-200 rounded-sm flex items-center justify-center">
                            {payment.type === "Visa" ? "VISA" : "MC"}
                          </div>
                          <p className="font-medium">
                            **** **** **** {payment.last4}
                          </p>
                        </div>
                        <p className="text-sm">Expires: {payment.expiry}</p>
                        <div className="mt-3 flex space-x-2">
                          <button className="text-xs text-[#b87253] hover:underline">
                            Edit
                          </button>
                          {!payment.isDefault && (
                            <button className="text-xs text-red-600 hover:underline">
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist Section */}
              {activeSection === "wishlist" && (
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="heading-font text-xl font-semibold text-[#232222] mb-6">
                    Your Wishlist
                  </h2>

                  <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">
                      Your wishlist is currently empty
                    </p>
                    <Link
                      to="/products"
                      className="heading-font inline-block bg-[#b87253] text-white font-semibold px-6 py-2 rounded-md shadow hover:bg-[#a15a3e] transition"
                    >
                      Browse Products
                    </Link>
                  </div>
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