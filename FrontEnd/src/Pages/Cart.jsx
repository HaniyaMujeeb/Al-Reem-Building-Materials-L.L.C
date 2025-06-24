import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from '../Component/Title';
import { assets } from '../assets/assets';
import CartTotal from '../Component/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const itemId in cartItems) {
        const itemData = cartItems[itemId];

        if (typeof itemData === "object") {
          // Product with sizes
          for (const size in itemData) {
            if (itemData[size] > 0) {
              tempData.push({
                _id: itemId,
                size,
                quantity: itemData[size],
              });
            }
          }
        } else if (typeof itemData === "number" && itemData > 0) {
          // Product without sizes
          tempData.push({
            _id: itemId,
            size: null,
            quantity: itemData,
          });
        }
      }

      setCartData(tempData);
    }


  }, [cartItems]);




  return (
    <div className='cart-container'>

      {/* --- Page Title --- */}
      <div className='cart-title'>
        <Title text1={'YOUR'} text2={'CART :'} />
      </div>

      {/* --- Cart Items --- */}
      <div className='cart-items'>
        {cartData.length > 0 ? (
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);

            // Handle cases where product is not found
            if (!productData) return null;

            return (
              <div key={index} className='cart-item'>
                <div className='cart-item-info'>

                  {/* --- Product Image --- */}
                  <img className='cart-item-image' src={productData.image[0]} alt='' />

                  {/* --- Product Details --- */}
                  <div>
                    <p className='cart-item-name'> {productData.name} </p>

                    <div className='cart-price-container'>

                      {/* --- Display Correct Price Based on Size --- */}
                      <p className="cart-price">
                        {currency}{" "}
                        {Array.isArray(productData.sizes) && productData.sizes.length > 0 && item.size
                          ? (() => {
                            const sizeObj = productData.sizes.find(s => s.size === item.size);
                            return sizeObj ? sizeObj.price : 'N/A';
                          })()
                          : typeof productData.price === "number"
                            ? productData.price
                            : 'N/A'}
                        {item.size ? <span>{item.size}</span> : <span>No Size</span>}


                      </p>

                    </div>
                  </div>
                </div>

                <input
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || value === '0') return;
                    updateQuantity(item._id, item.size, Number(value));
                  }}
                  className="cart-quantity"
                  type="number"
                  min={1}
                  value={item.quantity} // Controlled input
                  onBlur={(e) => {
                    if (e.target.value === '') e.target.value = 1;
                  }}
                />


                <img onClick={() => updateQuantity(item._id, item.size, 0)} className='cart-remove' src={assets.trash_bin_icon} alt='' />
              </div>
            );
          })
        ) : (
          <p className="cart-empty" > Your cart is empty. </p>
        )}
      </div>

      <div className='cart-total-wrapper'>
        <div className='cart-total-container'>

          <CartTotal />

          <div className='checkout-container'>
            <button onClick={() => navigate('/place-order')} className='checkout-button' > PROCEED TO CHECKOUT </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Cart;
