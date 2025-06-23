import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
    const navigate = useNavigate();

    return (
        <div className="order-confirmation-container">
            <div className="order-box">
                <h2 className="confirmation-title">🎉 Order Confirmed!</h2>
                <p className="confirmation-text">Thank you for your purchase. Your order has been successfully placed.</p>
                
                {/* Buttons for Navigation */}
                <div className="button-group">
                    <button className="home-button" onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                    <button className="orders-button" onClick={() => navigate('/orders')}>
                        Go to Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;


