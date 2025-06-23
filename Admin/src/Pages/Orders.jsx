import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendURL, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {

      const response = await axios.post(backendURL + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())

      } else {
        toast.error(response.data)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }


  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;

    // Find the current order
    const currentOrder = orders.find(order => order._id === orderId);
    if (!currentOrder) return;

    // Check if it's COD and status is Delivered
    const shouldMarkPaymentDone =
      newStatus.trim() === "Delivered" &&
      currentOrder.paymentMethod.trim().toLowerCase() === "cash on delivery";

    try {
      const response = await axios.post(
        backendURL + '/api/order/status',
        {
          orderId,
          status: newStatus,
          paymentDone: shouldMarkPaymentDone
        },
        { headers: { token } }
      );

      if (response.data.success) {
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update order status.");
      }

    } catch (error) {
      console.error(error);
      toast.error("Error updating order status.");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token])


  return (
    <div className='orders-page'>
      <h3> Orders Page : </h3>
      <div className='orders-list'>
        {
          orders.map((order, index) => (
            <div className='order-card' key={index}>
              <img className='parcel-icon' src={assets.parcel_icon} alt='' />

              <div className='order-details'>
                <div className='items-list'>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return <p className='item-line' key={index}> {item.name} x {item.quantity + " " + " - "} <span>  {item.size} </span> </p>
                    }
                    else {
                      return <p className='item-line' key={index}> {item.name} x {item.quantity + " " + " - "} <span> {item.size} </span> </p>
                    }
                  })}
                </div>
                <p className='customer-name'> Name:- {order.address.firstName + " " + order.address.lastName} </p>
                <div>
                  <p> Address:- {order.address.street + ","} </p>
                  <p> {order.address.city + " , " + order.address.state + " , " + order.address.country + " , " + order.address.zipcode} </p>
                </div>
                <p> Phone Number:- {order.address.phoneNumber} </p>
              </div>

              <div>
                <p className='meta-info'> Order Items: {order.items.length} </p>
                <p className='meta-info'> Payment Method: {order.paymentMethod} </p>
                <p className={order.payment ? 'payment-status done' : 'payment-status pending'}>
                  Payment Status: {order.payment ? 'Done' : 'Pending'}
                </p>
                <p> Order Date: {new Date(order.date).toDateString()} </p>
              </div>
              <p className='order-amount'> {currency + ":"} {order.amount} </p>

              <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='order-status'>
                <option value=" Order Placed "> Order Placed </option>
                <option value=" Packing "> Packing </option>
                <option value=" Shipped "> Shipped </option>
                <option value=" Out for Delivery "> Out for Delivery </option>
                <option value=" Delivered "> Delivered </option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders
