import React, { useState, useContext } from 'react';
import Title from '../Component/Title';
import CartTotal from '../Component/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, vat_rate, products } = useContext(ShopContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phoneNumber: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value })); // Update form data state
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validation
    for (const key in formData) {
      if (!formData[key].trim()) {
        toast.error("Please fill out all delivery fields before proceeding.");
        return;
      }
    }

    try {
      let orderItems = [];

      for (const productId in cartItems) {
        const productEntry = cartItems[productId];
        const productInfo = structuredClone(products.find(p => p._id === productId));

        if (!productInfo) continue;

        if (typeof productEntry === 'number') {
          // Product without size
          if (productEntry > 0) {
            productInfo.quantity = productEntry;
            orderItems.push(productInfo);
          }
        } else {
          // Product with sizes
          for (const size in productEntry) {
            if (productEntry[size] > 0) {
              const itemInfo = structuredClone(productInfo);
              itemInfo.size = size;
              const sizeObj = productInfo.sizes?.find(s => s.size === size);
              itemInfo.price = sizeObj?.price ?? 0;
              itemInfo.quantity = productEntry[size];
              orderItems.push(itemInfo);
            }
          }

        }
      }


      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee + vat_rate,
      }


      switch (method) {

        // API Call for Cash On Delivery
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })

          if (response.data.success) {
            setCartItems({});
            navigate('/order-confirmation');

          } else {
            toast.error(response.data.message);
          }
          break;

        // API Call for Visa Card Payment
        case 'visa':
          const responseCard = await axios.post(backendUrl + '/api/order/card', orderData, { headers: { token } })
          if (responseCard.data.success) {
            setCartItems({});
            navigate('/card-payment');

          } else {
            toast.error(responseCard.data.message);
          }

          break;

        // API Call for MasterCard Payment
        case 'mastercard':
          const responseMasterCard = await axios.post(backendUrl + '/api/order/card', orderData, { headers: { token } })
          if (responseMasterCard.data.success) {
            setCartItems({});
            navigate('/card-payment');

          } else {
            toast.error(responseMasterCard.data.message);
          }

          break;

      }

    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };



  return (
    <form className="place-order-container" onSubmit={onSubmitHandler}>
      {/* --- Delivery Information --- */}
      <div className="delivery-info">
        <div className="delivery-title">
          <Title text1="DELIVERY" text2="INFORMATION :" />
        </div>

        <div className="input-group">
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className="input-field" type="text" placeholder="First Name" />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className="input-field" type="text" placeholder="Last Name" />
        </div>

        <input required onChange={onChangeHandler} name='email' value={formData.email} className="input-field" type="email" placeholder="Email Address [ example@example.com ]" />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className="input-field" type="text" placeholder="Street" />

        <div className="input-group">
          <input required onChange={onChangeHandler} name='city' value={formData.city} className="input-field" type="text" placeholder="City" />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className="input-field" type="text" placeholder="State" />
        </div>

        <div className="input-group">
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className="input-field" type="number" placeholder="Zipcode" />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className="input-field" type="text" placeholder="Country" />
        </div>

        <input required onChange={onChangeHandler} name='phoneNumber' value={formData.phoneNumber} className="input-field" type="number" placeholder="Phone Number" />
      </div>

      {/* --- Order Total Amount --- */}
      <div className="order-total-container">
        <div className="cart-payment-total">
          <CartTotal />
        </div>

        <div className="payment-method">
          <Title text1="PAYMENT" text2="METHOD" />

          {/* --- Payment Method Selection --- */}
          <div className="payment-options">
            <div onClick={() => setMethod('visa')} className="payment-option">
              <p className={`radio-button ${method === 'visa' ? 'radio-selected' : ''}`}></p>
              <img className="payment-logo" src={assets.visa_logo} alt="Visa" />
            </div>

            <div onClick={() => setMethod('mastercard')} className="payment-option">
              <p className={`radio-button ${method === 'mastercard' ? 'radio-selected' : ''}`}></p>
              <img className="payment-logo" src={assets.mastercard_logo} alt="Mastercard" />
            </div>

            <div onClick={() => setMethod('cod')} className="payment-option">
              <p className={`radio-button ${method === 'cod' ? 'radio-selected' : ''}`}></p>
              <p className="cod-text text:sm font-medium mx-4"> CASH ON DELIVERY </p>
            </div>
          </div>

          {/* --- Place Order Button --- */}
          <div className="placeorder-container">
            <button type='submit' className="place-order-button">
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;