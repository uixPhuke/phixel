import React from "react";

const EditProduct = () => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Update Product Name"
        className="w-full border p-3 rounded-xl"
      />

      <input
        type="text"
        placeholder="Update Price"
        className="w-full border p-3 rounded-xl"
      />

      <button className="bg-black text-white px-5 py-3 rounded-xl">
        Update Product
      </button>
    </div>
  );
};

export default EditProduct;