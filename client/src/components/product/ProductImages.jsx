import React, { useState } from 'react';

const ProductImages = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[420px] bg-gray-100 flex items-center justify-center">
        No Image
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="hidden lg:flex flex-col gap-3 w-20">
        {images.map((img, i) => (
          <button
            key={img.public_id}
            onClick={() => setSelectedImage(i)}
            className={`border rounded-md overflow-hidden ${
              selectedImage === i ? 'border-black' : 'border-gray-200'
            }`}
          >
            <img
              src={img.url}
              alt={title}
              className="w-full h-20 object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1">
        <img
          src={images[selectedImage].url}
          alt={title}
          className="w-full max-h-[680px] object-cover rounded-lg"
        />

        {/* Mobile thumbnails */}
        <div className="flex gap-2 mt-3 lg:hidden overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.public_id}
              onClick={() => setSelectedImage(i)}
              className={`border rounded-md min-w-[64px] ${
                selectedImage === i ? 'border-black' : 'border-gray-200'
              }`}
            >
              <img
                src={img.url}
                alt=""
                className="w-16 h-16 object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
