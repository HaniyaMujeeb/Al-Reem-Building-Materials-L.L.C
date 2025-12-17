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
            <Link style={{ textDecoration: 'none' }} to="/products">

              <p className="banner-shop animate-main">
                {["RETAIL OR BULK ORDER?", "Send us an inquiry :"].map((line, lineIndex) =>
                  line.split(" ").map((word, index) => (
                    <span
                      key={`${lineIndex}-${index}`}
                      style={{
                        animationDelay: `${(index + lineIndex * 10) * 0.05}s`,
                        fontSize: lineIndex === 1 ? "0.70em" : "1em", // smaller for second line
                        display: "inline-block", // ensures each word animates properly
                        marginRight: "0.3em",
                      }}
                    >
                      {word}
                    </span>
                  )).concat(lineIndex === 0 ? <br key={`br-${lineIndex}`} /> : null)
                )}
              </p>



            </Link>

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
