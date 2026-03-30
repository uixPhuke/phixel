import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaBoxOpen,
  FaUsers,
  FaFileInvoice,
  FaBars,
} from "react-icons/fa";

import DashboardTab from "./tabs/DashboardTab";
import OrdersTab from "./tabs/OrdersTab";
import ProductsTab from "./tabs/ProductsTab";
import CustomersTab from "./tabs/CustomersTab";
import InvoicesTab from "./tabs/InvoicesTab";
import {  FaTimes } from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FaTachometerAlt size={20} /> },
  { name: "Orders", icon: <FaShoppingCart size={20} /> },
  { name: "Products", icon: <FaBoxOpen size={20} /> },
  { name: "Customers", icon: <FaUsers size={20} /> },
  { name: "Invoices", icon: <FaFileInvoice size={20} /> },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardTab />;
      case "Orders":
        return <OrdersTab />;
      case "Products":
        return <ProductsTab />;
      case "Customers":
        return <CustomersTab />;
      case "Invoices":
        return <InvoicesTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
  className={`bg-white transition-all duration-300 ${
    sidebarOpen ? "w-64" : "w-20"
  } min-h-screen`}
>
  {/* Header */}
  <div className="h-16 px-4 flex items-center justify-between">
  <div className="overflow-hidden whitespace-nowrap">
    <h1
      className={`font-bold transition-all duration-300 ${
        sidebarOpen
          ? "opacity-100 text-3xl w-32"
          : "opacity-0 w-0"
      }`}
    >
      UiX
    </h1>
  </div>

  <button
    onClick={() => setSidebarOpen(!sidebarOpen)}
    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 shrink-0 transition-all duration-300"
  >
    {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
  </button>
</div>

  {/* Menu */}
  <nav className="mt-6 space-y-2 px-2">
    {menuItems.map((item) => (
      <div
        key={item.name}
        onClick={() => setActiveTab(item.name)}
        className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all
          ${
            activeTab === item.name
              ? "bg-gray-100 font-semibold"
              : "hover:bg-gray-50"
          }`}
      >
        <span className="text-xl w-6 flex justify-center">
          {item.icon}
        </span>

        {/* Stable text width */}
        <span
          className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
            sidebarOpen
              ? "opacity-100 w-32"
              : "opacity-0 w-0"
          }`}
        >
          {item.name}
        </span>
      </div>
    ))}
  </nav>
</aside>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 ">{renderTab()}</main>
    </div>
  );
};

export default AdminDashboard;