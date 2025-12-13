import React from 'react';
import { assets } from '../assets/assets';
import '../style.css';
import "../mobile.css";
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="banner-container">

      {/* Left Side of the Banner */}
      <div className="banner-left"> 
        <div className="banner-content">
          <div className="banner-header">
            <p className="banner-line"></p>
            <p className="banner-text">Our BestSellers</p>
          </div>

          <h1 className="banner-title">Latest Arrivals</h1>
          
          <div className="banner-shop-container">
            <Link style={{textDecoration: 'none'}} to = '/products'> <p className="banner-shop"> SHOP NOW </p> </Link> 
            <p className="banner-divider"></p>
          </div>
        </div>
      </div>

      {/* Right Side of the Banner */}
      <div className="banner-right">
        <img src={assets.banner} alt="Banner" className="banner-image" />
      </div>

    </div>
  );
}

export default Banner;
