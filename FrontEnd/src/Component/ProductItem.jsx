import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  // Get the correct image URL or fallback to placeholder
  const getImageSrc = () => {
    // No image or empty array
    if (!image || (Array.isArray(image) && image.length === 0)) {
      return '/placeholder.jpg'; // make sure this exists in public folder
    }

    // Single string URL
    if (typeof image === 'string') {
      return image;
    }

    // Array of URLs
    if (Array.isArray(image)) {
      return image[0]; // take first one
    }

    // Object with url property
    if (typeof image === 'object' && image?.url) {
      return image.url;
    }

    // Default fallback
    return '/placeholder.jpg';
  };

  return (
    <Link className="product-link" to={`/products/${id}`}>
      <div className="product-image-container">
        <img
          src={getImageSrc()}
          alt={name || 'Product'}
          onError={(e) => {
            e.target.src = '/placeholder.jpg'; // fallback if URL fails
          }}
        />
      </div>
      <p className="product-name">{name || 'Unnamed Product'}</p>
      <p className="product-price">
        {/* {currency} {typeof price === 'number' ? price.toFixed(2) : '0.00'} --- IGNORE --- */}
      </p>
    </Link>
  );
};

export default ProductItem;

