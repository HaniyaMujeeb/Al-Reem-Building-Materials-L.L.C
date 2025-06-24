import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const OurPolicy = () => {
  return (
    <div className = 'ourpolicy-container'>
      
      <div className = 'exchange-item'>

        <a href="../src/assets/policy.pdf" target="_blank" rel="noopener noreferrer">
            <img src={assets.exchange_policy_icon} className='exchange-icon' alt='' />
        </a>
        <p className = 'exchange-title'> Exchange Policy </p>
        <p className = 'exchange-text'> We provide hassle-free and customer-friendly exchange experience. </p>
      </div>

      <div className = 'item-quality'>
        <a href="src/assets/policy.pdf" target="_blank" rel="noopener noreferrer">
            <img src={assets.quality_verified_icon} className='exchange-icon' alt='' />
        </a>
        <p className = 'quality-title'> 7 Days Return Policy </p>
        <p className = 'quality-text'> We provide 7 days free return policy</p>
      </div>

      <div className = 'customer-support'>
        <Link to = './contact'>
        <img src = {assets.customer_service_icon} className = 'customerservice-icon' alt='' />
        </Link>
        <p className = 'customerservice-title'> Customer Support </p>
        <p className = 'customerservice-text'> We provide 24/7 customer support </p>
      </div>

    </div>

    
  )
}

export default OurPolicy
