import React from "react";

const products = [
  {
    id: 1,
    name: "Puffer Jacket",
    price: "$47.55",
    stock: 77,
    category: "Jacket",
  },
  {
    id: 2,
    name: "Nike Shoes",
    price: "$99.99",
    stock: 30,
    category: "Shoes",
  },
];

const ViewProduct = () => {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-xl p-4 flex justify-between"
        >
          <div>
            <h2 className="font-semibold text-lg">
              {product.name}
            </h2>
            <p className="text-gray-500">
              {product.category}
            </p>
          </div>

          <div className="text-right">
            <p>{product.price}</p>
            <p>Stock: {product.stock}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewProduct;