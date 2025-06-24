import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { toast } from 'react-toastify';

const CardPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const navigate = useNavigate();
  const { getCartAmount, delivery_fee } = useContext(ShopContext);

  const orderAmount = getCartAmount() + delivery_fee;

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
      toast.error('Please fill in all card details.');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast.success(`Payment successful and Order Placed!`);
      navigate('/order-confirmation');
    }, 3000);
  };

  return (
    <div className="card-payment-container">
      <div className="card-payment-box">
        <h2 className="card-payment-title">Enter Payment Detail :</h2>

        <div className="card-icons">
          <img src={assets.visa_logo} alt="Visa" />
          <img src={assets.mastercard_logo} alt="MasterCard" />
        </div>

        {!isProcessing ? (
          <form onSubmit={handlePayment} className="card-form">
            <input
              type="text"
              placeholder="Card Number"
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="CVV"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
              required
            />
            <button type="submit" className="pay-now-button">Pay Now</button>
          </form>
        ) : (
          <h3 className="processing-text">Processing Payment...</h3>
        )}
      </div>
    </div>
  );
};

export default CardPayment;
