import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from '../Component/Title';
import axios from 'axios';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            allOrdersItem.push(item);
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error('Failed to load orders:', error.message);
    }
  };

  const handleTrackOrder = async (item) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const updatedOrder = response.data.orders.find(order =>
          order.items.some(orderItem => orderItem._id === item._id)
        );

        if (updatedOrder) {
          const updatedItems = updatedOrder.items.map(orderItem => ({
            ...orderItem,
            status: updatedOrder.status,
            payment: updatedOrder.payment,
            paymentMethod: updatedOrder.paymentMethod,
            date: updatedOrder.date,
          }));

          const updatedOrderData = orderData.map(existingItem =>
            updatedItems.find(updated => updated._id === existingItem._id) || existingItem
          );

          setOrderData(updatedOrderData);
          alert(`Current Status: ${updatedOrder.status}`);
        }
      }
    } catch (error) {
      console.error('Failed to fetch updated order:', error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className='orders-container main-content'>
      <div className='orders-title'>
        <Title text1={'MY'} text2={'ORDERS :'} />
      </div>

      {orderData.length === 0 ? (
        <div className="no-orders-message">
          <p>No orders found.</p>
        </div>
      ) : (
        orderData.map((item, index) => (
          <div key={item._id || index} className='order-item'>
            <div className='order-details'>
              <img className='order-image' src={item.image[0]} alt='' />
              <div>
                <p className='order-name'>{item.name}</p>
                <div className='order-info'>
                  <p className='order-price'>
                    {currency}{' '}
                    {typeof item.price === 'object' && item.size
                      ? item.price[item.size] || 'N/A'
                      : item.price}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  {item.size && <p>Size: {item.size}</p>}
                </div>
                <p className='order-date'>
                  Date:{' '}
                  <span className='order-date-text'>
                    {new Date(item.date).toDateString()}
                  </span>
                </p>
                <p className='order-date'>
                  Payment: <span className='order-date-text'>{item.paymentMethod}</span>
                </p>
              </div>
            </div>

            <div className='order-status-container'>
              <div className='status'>
                <p className='indicator'></p>
                <p className='order-status-text'>{item.status}</p>
              </div>

              <div className='button-container'>
                <button
                  className='track-button'
                  onClick={() => handleTrackOrder(item)}
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
