import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProductForm from "../../../components/product/ProductForm";
import AdminProductCard from "../../../components/product/AdminProductCard";

import {
  addProduct,
  updateProductAdmin,
  getProductsAdmin,
} from "../../../actions/productActions";

const ProductsTab = () => {
  const dispatch = useDispatch();

  const { productsAdmin, loading } =
    useSelector((state) => state.product);
    

  const [mode, setMode] =
    useState("list");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [category, setCategory] =
    useState("");

  useEffect(() => {
    dispatch(getProductsAdmin());
  }, [dispatch]);
const filteredProducts = productsAdmin.filter((product) => {
  const matchesSearch =
    product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productCode?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory =
    category === "" ||
    product.category?.toLowerCase() === category.toLowerCase();

  return matchesSearch && matchesCategory;
});

  const handleAdd = () => {
    setSelectedProduct(null);
    setMode("form");
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setMode("form");
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
    setMode("list");
    dispatch(getProductsAdmin());
  };

  const handleSubmit = async (
    formData,
    submitData
  ) => {
    if (selectedProduct) {
      await dispatch(
        updateProductAdmin(
          selectedProduct._id,
          formData,
          submitData
        )
      );
    } else {
      await dispatch(
        addProduct(
          formData,
          submitData
        )
      );
    }

    handleBackToList();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h1 className="text-5xl font-bold mb-8">
        Product Management
      </h1>

      {mode === "list" ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <input
            type="text"
            placeholder="Search products by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />

              <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="border rounded-lg px-4 py-2"
>
  <option value="">All Categories</option>

  {[...new Set(productsAdmin.map((p) => p.category))].map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>
            </div>

            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Add New Product
            </button>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {filteredProducts.map(
              (product) => (
                <AdminProductCard
                  key={product._id}
                  product={product}
                  onEdit={() =>
                    handleEdit(
                      product
                    )
                  }
                />
              )
            )}
          </div>
        </>
      ) : (
        <ProductForm
          product={selectedProduct}
          onSubmit={handleSubmit}
          onCancel={handleBackToList}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ProductsTab;