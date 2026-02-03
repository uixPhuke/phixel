import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductDetail from '../../components/product/ProductDetail';

const ProductDetailPage = () => {
  const { productID } = useParams();
  const { product, loading, error, fetchProduct } = useProducts();

  useEffect(() => {
    if (productID) {
      fetchProduct(productID);
    }
  }, [productID]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div className="bg-gray-300 h-96 rounded"></div>
            <div className="space-y-4 mt-8 lg:mt-0">
              <div className="bg-gray-300 h-8 rounded w-3/4"></div>
              <div className="bg-gray-300 h-6 rounded w-1/4"></div>
              <div className="bg-gray-300 h-4 rounded w-full"></div>
              <div className="bg-gray-300 h-4 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.history.back()}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
      </div>
    );
  }

  return <ProductDetail product={product} />;
};

export default ProductDetailPage;