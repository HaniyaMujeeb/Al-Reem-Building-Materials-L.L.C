import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { InquiryContext } from '../Context/InquiryContext.jsx';
import { assets } from '../assets/assets';
import ProductReviews from '../Component/ProductReview';
import RelatedProducts from '../Component/RelatedProducts';

const Item = () => {
  const { productID } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const { addToInquiry } = useContext(InquiryContext);
  const navigate = useNavigate();

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productID) {
        setProductData(item);
        setImage(item.image[0]);

        // Set default size
        if (item.sizes && item.sizes.length > 0) {
          setSize(item.sizes[0]);
        } else {
          setSize(null); // Ensure size is not set if there are no sizes
        }

        return null;
      }
    })
  }


  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productID);

    if (selectedProduct) {
      setProductData(selectedProduct);
      setImage(selectedProduct.image[0]);
      setSize(null);
    }
  }, [productID, products]);


  const getPrice = () => {
    if (productData && productData.price) {

      if (typeof productData.price === 'object' && size) {
        return productData.price[size] || Math.min(...Object.values(productData.price));
      }

      return typeof productData.price === 'number' ? productData.price : 'N/A';
    }
    return 'N/A';
  };



  const handleInquiry = () => {
    if (!productData) return;

    const item = {
      productId: productData._id,
      productName: productData.name,
      size: size || 'N/A',
      quantity: 1,
    };

    addToInquiry(item);
    navigate("/inquiry"); // Redirect to inquiry page
  };


  return productData ? (
    <div className="item-container">
      {/* --- Product Data --- */}
      <div className="product-content">
        {/* --- Product Images --- */}
        <div className="product-images">
          <div className="thumbnail-container">
            {productData.image.map((item, index) => (
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
            <img className="main-image" src={image} alt="" />
          </div>
        </div>

        {/* --- Product Info --- */}
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

          {/* <p className='product-price'>
            {currency}{' '}
            {Array.isArray(productData?.sizes) && productData.sizes.length > 0
              ? typeof size === 'string'
                ? productData.sizes.find(s => s.size === size)?.price ?? 'N/A'
                : productData.sizes[0]?.price ?? 'N/A'
              : typeof productData?.price === 'number'
                ? productData.price
                : 'N/A'}
          </p> */}


          <p className="product-description">{productData.description}</p>

          {productData.sizes?.length > 0 && (
            <div className="size-container">
              <p>Select Size</p>
              <div className="size-options">

                {productData.sizes.map((item, index) => {
                  const sizeValue = typeof item === 'object' ? item.size : item;
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

          <button
            onClick= {handleInquiry}
            className="inquire-button"
          >
            INQUIRE
          </button>

          { /* <button
            onClick={() => addToCart(productData._id, size)}
            className="addtocart-button"
          >
            ADD TO CART
          </button> */}

          <hr className="divider" />

          <div className="productinfo-text">
            <p>100% Original Product.</p>
            <p>Cash on Delivery available on this product.</p>
            <p>Easy return and exchange policy of 7 days.</p>
          </div>
        </div>
      </div>

      {/* --- Description & Reviews --- */}
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
              Al Reem Building Materials L.L.C is a trusted supplier of high-quality construction materials, builders, and homeowners
              across the region. The company offers a wide range of products, including steel, wood, plumbing, electrical fittings,
              paints, and adhesives. With a strong commitment to quality and reliability, Al Reem Building Materials ensures that customers
              receive durable and cost-effective materials for their construction and renovation needs.
            </p>
          ) : (
            <ProductReviews />
          )}
        </div>
      </div>

      {/* --- Related Products --- */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className="opacity-0"> </div>
  );
};

export default Item;
