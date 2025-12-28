import React, { useState, useRef, useContext } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { InquiryContext } from '../Context/InquiryContext';
import '../style.css';
import "../mobile.css";
import { ShopContext } from '../Context/ShopContext';

const Navbar = () => {
  const [menu, setMenu] = useState("selectedMenu");
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { setShowSearch, getCartCount, token, setToken, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const { inquiryItems, getInquiryCount } = useContext(InquiryContext);


  const logout = () => {
    navigate('/login-register');
    localStorage.removeItem('token');
    localStorage.removeItem("cartItems");
    setToken('');
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      document.removeEventListener("click", handleClickOutside);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="navbar">
        {/* Logo & Title */}
        <div className="navbar-logo-container">
          <NavLink to='./'>
            <img src={assets.logo} alt="Logo" className="navbar-logo" />
          </NavLink>
          <div className="navbar-title">
            <h1> AL Reem Building </h1>
            <h2> Materials L.L.C </h2>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <ul className="navbar-links desktop-only">
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/products'>Products</Link></li>
          <li><Link to='/about'>About Us</Link></li>
          <li><Link to='/contact'>Contact Us</Link></li>
        </ul>

        {/* Icons Section */}
        <div className="navbar-icons">
          <img onClick={() => { setShowSearch(true); navigate('/products'); }} src={assets.search_icon} className="navbar-icon" alt="Search" />

          <div className="navbar-user-container" ref={dropdownRef}>
            <img
              onClick={() => {
                if (!token) {
                  navigate('login-register');
                } else {
                  toggleDropdown();
                }
              }}
              className="navbar-icon navbar-user"
              src={assets.user_icon}
              alt="User"
            />
            {token &&
              <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                <div className="dropdown-content">
                  <p onClick={() => navigate('/profile')} className="dropdown-item">
                    My Profile
                  </p>
                  <p onClick={() => navigate('/my-inquiries')} className="dropdown-item">
                    My Inquiries
                  </p>

                  <p onClick={logout} className="dropdown-item">Logout</p>
                </div>
              </div>
            }
          </div>

          {/* <Link to="/cart" className="navbar-cart">
            <img src={assets.shopping_cart} className="navbar-cart" alt="Cart" />
            <p className="cart-badge">{getCartCount()}</p>
          </Link> */}

          <Link to="/inquiry" className="navbar-cart">
            <img
              src={assets.shopping_cart}
              className="navbar-cart"
              alt="Inquiry Cart"
            />

            {getInquiryCount() > 0 && (
              <p className="cart-badge">{getInquiryCount()}</p>
            )}

          </Link>

        </div>

        {/* Hamburger Icon for Mobile */}
        <img
          src={assets.list_icon}
          alt="Menu"
          className="hamburger-icon mobile-only"
          onClick={() => setMobileMenuOpen(true)}
        />
      </div>

      {/* Side Drawer for Mobile */}
      <div className={`side-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="side-drawer-links">
          <li onClick={() => { setMenu("home"); setMobileMenuOpen(false); }}><Link to="/">Home</Link></li>
          <li onClick={() => { setMenu("products"); setMobileMenuOpen(false); }}><Link to="/products">Products</Link></li>
          <li onClick={() => { setMenu("about"); setMobileMenuOpen(false); }}><Link to="/about">About Us</Link></li>
          <li onClick={() => { setMenu("contact"); setMobileMenuOpen(false); }}><Link to="/contact">Contact Us</Link></li>
        </ul>
      </div>

      {/* Backdrop to close side menu */}
      {mobileMenuOpen && <div className="backdrop" onClick={() => setMobileMenuOpen(false)}></div>}
    </>
  );
};

export default Navbar;
