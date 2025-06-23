import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Title from './Title';

const CartTotal = () => {

  const {currency, delivery_fee, getCartAmount, vat_rate} = useContext(ShopContext);

  return (
    <div className = 'cart-total'>

      <div className = 'cart-total-title'>
        <Title text1 = {'TOTAL'} text2 = {'AMOUNT :'} />
      </div>

      <div className = 'cart-summary'>

        <div className = 'cart-row'>
          <p> Subtotal Amount </p>
          <p> {currency} {getCartAmount()} </p>
        </div>

        <hr />
        <div className = 'cart-row'>
          <p> Shipping Fees </p>
          <p> {currency} {delivery_fee}.00 </p>
        </div>

        <hr />
        <div className = 'cart-row'>
          <p> VAT Fees </p>
          <p> {currency} {vat_rate}% </p>
        </div>

        <hr />
        <div className = 'cart-row'>
          <p> Total </p> 
          <p> {currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee + vat_rate}.00 </p>

        </div>

      </div>
      
    </div>
  )
}

export default CartTotal
