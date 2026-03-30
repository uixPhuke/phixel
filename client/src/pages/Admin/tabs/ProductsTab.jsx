import React, { useState } from "react";
import { FaPlus, FaEdit, FaEye } from "react-icons/fa";

import AddProduct from "../AddProduct";
import ViewProduct from "../ViewProduct";
import EditProduct from "../EditProduct";

const ProductsTab = () => {
  const [activeTab, setActiveTab] = useState("add");

  const renderTab = () => {
    switch (activeTab) {
      case "add":
        return <AddProduct />;
      case "view":
        return <ViewProduct />;
      case "edit":
        return <EditProduct />;
      default:
        return <AddProduct />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">
        Product Management
      </h1>

      {/* Horizontal Tabs */}
      <div className="flex gap-4  pb-3">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === "add"
              ? "bg-black text-white"
              : "bg-gray-100"
          }`}
        >
          <FaPlus />
          Add Product
        </button>

        <button
          onClick={() => setActiveTab("view")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === "view"
              ? "bg-black text-white"
              : "bg-gray-100"
          }`}
        >
          <FaEye />
          View Products
        </button>

        <button
          onClick={() => setActiveTab("edit")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === "edit"
              ? "bg-black text-white"
              : "bg-gray-100"
          }`}
        >
          <FaEdit />
          Edit Product
        </button>
      </div>

      {/* Dynamic Component */}
      {renderTab()}
    </div>
  );
};

export default ProductsTab;