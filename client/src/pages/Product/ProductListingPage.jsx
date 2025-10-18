import React, { useEffect } from 'react';
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

  useEffect(() => {
    fetchProducts();
  }, [filters, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <ProductFilters
            filters={filters}
            sort={sort}
            onFilterChange={updateFilters}
            onSortChange={updateSort}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            {pagination.total > 0 && (
              <p className="text-gray-600 mt-2">
                Showing {products.length} of {pagination.total} products
              </p>
            )}
          </div>

          <ProductList
            products={products}
            loading={loading}
            error={error}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex space-x-2">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => fetchProducts({ page: i + 1 })}
                    className={`px-4 py-2 border rounded-md ${
                      pagination.page === i + 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;