import React, { useEffect, useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductList from '../../components/product/ProductList';
import ProductFilters from '../../components/product/ProductFilters';

const ProductListingPage = () => {
  const {
    products,
    loading,
    error,
    pagination,
    filters,
    sort,
    fetchProducts,
    updateFilters,
    updateSort
  } = useProducts();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters, sort]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">

      <div className="flex gap-8">

        {/* DESKTOP FILTER */}
        <aside className="w-80 xl:w-96 shrink-0 hidden lg:block">
          <ProductFilters
            filters={filters}
            sort={sort}
            onFilterChange={updateFilters}
            onSortChange={updateSort}
          />
        </aside>

        {/* PRODUCTS */}
        <main className="flex-1 min-w-0">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              All Products
            </h1>

            {pagination.total > 0 && (
              <p className="text-gray-600 mt-2">
                Showing {products.length} of {pagination.total} products
              </p>
            )}
          </div>

          {/* MOBILE FILTER BAR */}
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <span className="text-sm text-gray-600">
              {pagination.total} Results
            </span>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="
                flex items-center gap-2
                border px-4 py-2 rounded-full
                text-sm font-medium
              "
            >
              Filter ⚙️
            </button>
          </div>

          {/* PRODUCT GRID */}
          <ProductList
            products={products}
            loading={loading}
            error={error}
          />
        </main>
      </div>

      {/* MOBILE FILTER OVERLAY */}
      <div
        onClick={() => setMobileFilterOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/40
          transition-opacity duration-300
          ${mobileFilterOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      />

      {/* MOBILE FILTER SHEET */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-white rounded-t-2xl
          max-h-[85vh] overflow-y-auto
          transform transition-transform duration-300 ease-out
          ${mobileFilterOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-md font-semibold">Filter</h2>
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="text-sm"
          >
            ✕
          </button>
        </div>

        {/* FILTER CONTENT */}
        <div className="p-4">
          <ProductFilters
            filters={filters}
            sort={sort}
            onFilterChange={updateFilters}
            onSortChange={updateSort}
          />
        </div>

        {/* APPLY BUTTON */}
        <div className="sticky bottom-0 bg-white p-4 border-t">
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="
              w-full py-3
              bg-black text-white
              rounded-full
              text-sm font-medium
            "
          >
            Apply Filters
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductListingPage;
