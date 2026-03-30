import React, { useState } from "react";
import {
  FaCheck,
  FaFileAlt,
  FaPlus,FaUpload
} from "react-icons/fa";

const sizes = ["XS", "S", "M", "XL", "XXL"];
const genders = ["Men", "Woman", "Unisex"];

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    size: "M",
    gender: "Woman",
    price: "",
    stock: "",
    discount: "",
    discountType: "",
    category: "Jacket",
  });

  const [images, setImages] = useState([]);

  const handleChange = (field, value) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">
          Add New Product
        </h1>

        <div className="flex gap-4">
          <button className="border px-6 py-3 rounded-full flex items-center gap-2">
            <FaFileAlt />
            Save Draft
          </button>

          <button className="bg-green-300 px-6 py-3 rounded-full flex items-center gap-2 font-semibold">
            <FaCheck />
            Add Product
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="col-span-2 space-y-6">
          {/* GENERAL INFO */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-md font-semibold mb-6">
              General Information
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-medium">
                  Name Product
                </label>
                <input
                  className="w-full bg-gray-50 rounded-xl p-4"
                  placeholder="Puffer Jacket With Pocket Detail"
                  onChange={(e) =>
                    handleChange("name", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Description Product
                </label>
                <textarea
  rows={6}
  className="w-full bg-gray-50 rounded-xl p-4 resize-none"
  placeholder="Product description..."
  onChange={(e) =>
    handleChange("description", e.target.value)
  }
/>
              </div>

              {/* SIZE + GENDER */}
              <div className="grid grid-cols-2 gap-8">
  <div>
    <p className="mb-3 font-medium">Size</p>

    <div className="flex gap-3 flex-wrap">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() =>
            handleChange("size", size)
          }
          className={`px-5 py-3 rounded-lg ${
            product.size === size
              ? "bg-green-300"
              : "bg-gray-100"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  </div>

  <div>
    <p className="mb-3 font-medium">Gender</p>

    <div className="flex items-center gap-6">
      {genders.map((gender) => (
        <label
          key={gender}
          className="flex items-center gap-2"
        >
          <input
            type="radio"
            checked={product.gender === gender}
            onChange={() =>
              handleChange("gender", gender)
            }
          />
          {gender}
        </label>
      ))}
    </div>
  </div>
</div>
            </div>
          </div>

          {/* PRICING */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-md font-semibold mb-6">
              Pricing And Stock
            </h2>

            <div className="grid grid-cols-2 gap-5">
              <input
                placeholder="$47.55"
                className="bg-gray-50 rounded-xl p-4"
              />

              <input
                placeholder="77"
                className="bg-gray-50 rounded-xl p-4"
              />

              <input
                placeholder="10%"
                className="bg-gray-50 rounded-xl p-4"
              />

              <input
                placeholder="Chinese New Year Discount"
                className="bg-gray-50 rounded-xl p-4"
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* UPLOAD */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-md font-semibold mb-5">
              Upload Img
            </h2>

            <label className="bg-gray-50 border-2 border-dashed rounded-2xl h-96 flex items-center justify-center cursor-pointer">
              {images[0] ? (
                <img
                  src={images[0].preview}
                  alt=""
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                 <FaUpload size={40} />
              )}

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {/* THUMBNAILS */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img.preview}
                  alt=""
                  className="w-20 h-20 rounded-xl object-cover"
                />
              ))}

              {images.length < 10 && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer">
                  <FaPlus />

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* CATEGORY */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-md font-semibold mb-4">
              Category
            </h2>

            <select className="w-full bg-gray-50 rounded-xl p-4">
              <option>Jacket</option>
              <option>Shoes</option>
              <option>Accessories</option>
            </select>

            <button className="mt-5 bg-green-300 px-6 py-3 rounded-full">
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;