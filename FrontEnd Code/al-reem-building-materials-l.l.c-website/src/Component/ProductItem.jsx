import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  const getImageSrc = () => {
    if (typeof image === 'string') return image;
    if (Array.isArray(image)) return image[0];
    if (typeof image === 'object' && image?.url) return image.url;
    return '/placeholder.jpg'; // fallback image
  };

  return (
    <Link className="product-link" to={`/products/${id}`}>
      <div className="product-image-container">
        <img className="product-image" src={getImageSrc()} alt={name} />
      </div>
      <p className="product-name">{name}</p>
      <p className="product-price">{currency} {typeof price === 'number' ? price.toFixed(2) : '0'}</p>
    </Link>
  );
};

export default ProductItem;

