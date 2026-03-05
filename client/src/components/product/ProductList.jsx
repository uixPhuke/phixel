import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-4
          gap-x-4
          gap-y-8
        "
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-3 animate-pulse"
          >
            <div className="bg-gray-200 aspect-[4/5] mb-3"></div>
            <div className="bg-gray-200 h-4 w-3/4 mb-2"></div>
            <div className="bg-gray-200 h-4 w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          Error loading products: {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!loading && (!products || products.length === 0)) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No products found.</p>
        <p className="text-gray-400">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4
        gap-x-4
        gap-y-8
      "
    >
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
