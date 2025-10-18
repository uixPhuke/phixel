import React, { useState } from 'react';

const ProductImages = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Main Image */}
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={images[selectedImage]?.url}
          alt={title}
          className="w-full h-full object-center object-cover rounded-lg"
        />
      </div>

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.public_id}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                selectedImage === index
                  ? 'ring-2 ring-blue-500'
                  : 'ring-1 ring-gray-200'
              }`}
            >
              <img
                src={image.url}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-center object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;