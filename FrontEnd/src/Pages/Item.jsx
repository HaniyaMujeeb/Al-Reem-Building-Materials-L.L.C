import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { InquiryContext } from '../Context/InquiryContext.jsx';
import { assets } from '../assets/assets';
import ProductReviews from '../Component/ProductReview';
import RelatedProducts from '../Component/RelatedProducts';
import { toast } from 'react-toastify';

const Item = () => {
  const { productID } = useParams();
  const { products = [], currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('/placeholder.jpg');
  const [size, setSize] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const { addToInquiry } = useContext(InquiryContext);
  const navigate = useNavigate();

  // Update productData when products load
  useEffect(() => {
    if (!products || products.length === 0) return;

    const selectedProduct = products.find(item => item._id === productID);
    if (selectedProduct) {
      setProductData(selectedProduct);
      setImage(selectedProduct.image?.[0] || '/placeholder.jpg');
      setSize(selectedProduct.sizes?.[0]?.size || null);
    }
  }, [productID, products]);

  const getPrice = () => {
    if (!productData) return 'N/A';

    if (Array.isArray(productData.sizes) && size) {
      const selectedSizeObj = productData.sizes.find(s => s.size === size);
      return selectedSizeObj?.price ?? 'N/A';
    }

    return typeof productData.price === 'number' ? productData.price : 'N/A';
  };

  const handleInquiry = () => {
    if (!productData) return;

    addToInquiry({
      productId: productData._id,
      productName: productData.name,
      size: size || null,
      quantity: 1,
      productImage: productData.image?.[0] || '/placeholder.jpg'
    });

    toast.success("Item added to inquiry!", {
      position: "top-right",
      theme: "colored",
    });

    navigate("/inquiry");
  };

  if (!productData) {
    return <div className="opacity-0">Loading product...</div>;
  }

  return (
    <div className="item-container">
      <div className="product-content">
        <div className="product-images">
          <div className="thumbnail-container">
            {productData.image?.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="thumbnail"
                alt=""
              />
            ))}
          </div>
          <div className="main-image-container">
            <img className="main-image" src={image} alt={productData.name} />
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{productData.name}</h1>

          <div className="product-ratings">
            <img src={assets.rating_icon} alt="" className="rating-icon" />
            <img src={assets.rating_icon} alt="" className="rating-icon" />
            <img src={assets.rating_icon} alt="" className="rating-icon" />
            <img src={assets.rating_icon} alt="" className="rating-icon" />
            <img src={assets.less_rating_icon} alt="" className="rating-icon" />
            <p className="review-count">(122)</p>
          </div>

          <p className="product-description">{productData.description}</p>

          {productData.sizes?.length > 0 && (
            <div className="size-container">
              <p>Select Size :</p>
              <div className="size-options">
                {productData.sizes.map((item, index) => {
                  const sizeValue = item.size;
                  return (
                    <button
                      onClick={() => setSize(sizeValue)}
                      className={`size-button ${size === sizeValue ? 'active' : ''}`}
                      key={index}
                    >
                      {sizeValue}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button onClick={handleInquiry} className="inquire-button">
            INQUIRE
          </button>

          <hr className="divider" />

          <div className="productinfo-text">
            <p>100% Original Product.</p>
            <p>Cash on Delivery available on this product.</p>
            <p>Easy return and exchange policy of 7 days.</p>
          </div>
        </div>
      </div>

      <div className="description-reviews-container">
        <div className="tabs">
          <button
            className={activeTab === 'company-description' ? 'active' : ''}
            onClick={() => setActiveTab('company-description')}
          >
            Description
          </button>
          <button
            className={activeTab === 'reviews' ? 'active' : ''}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews (10)
          </button>
        </div>

        <div className="company-info">
          {activeTab === 'company-description' ? (
            <p>
              Al Reem Building Materials L.L.C is a trusted supplier of high-quality construction materials...
            </p>
          ) : (
            <ProductReviews />
          )}
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Item;

