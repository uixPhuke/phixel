import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductForm from '../../components/product/ProductForm';
import { toast } from 'react-hot-toast';

const AdminProductFormPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { 
    productAdmin, 
    loading, 
    createProduct, 
    updateProduct, 
    fetchProductAdmin 
  } = useProducts();

  const isEdit = Boolean(productId);

  useEffect(() => {
    if (productId) {
      fetchProductAdmin(productId);
    }
  }, [productId]);

  const handleSubmit = async (formData, submitData) => {
    try {
      if (isEdit) {
        await updateProduct(productId, formData, submitData).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await createProduct(formData, submitData, () => {
          // Reset form callback
          document.querySelector('form').reset();
        }).unwrap();
        toast.success('Product created successfully!');
      }
      
      navigate('/admin/products');
    } catch (error) {
      toast.error(error || `Failed to ${isEdit ? 'update' : 'create'} product`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'Create New Product'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEdit 
            ? 'Update the product information below.' 
            : 'Fill in the details to create a new product.'
          }
        </p>
      </div>

      {isEdit && !productAdmin && loading ? (
        <div className="animate-pulse">
          <div className="bg-gray-300 h-8 rounded w-1/4 mb-4"></div>
          <div className="bg-gray-300 h-4 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-300 h-12 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <ProductForm
          product={productAdmin}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </div>
  );
};

export default AdminProductFormPage;