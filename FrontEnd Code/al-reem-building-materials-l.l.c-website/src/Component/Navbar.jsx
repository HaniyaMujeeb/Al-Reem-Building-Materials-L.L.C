import React, { useState, useRef, useEffect, useContext } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import '../style.css';
import { ShopContext } from '../Context/ShopContext';

const Navbar = () => {
  const [menu, setMenu] = useState("selectedMenu");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);


  const logout = () => {
    navigate('/login-register')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      document.removeEventListener("click", handleClickOutside);
    }
  };

  // Toggle dropdown on click
  const toggleDropdown = () => {
    if (!isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    setIsOpen(!isOpen);
  };



  return (
    <div className="navbar">

      {/* Logo & Title */}
      <div className="navbar-logo-container">

        <NavLink to='./'>
          <img src={assets.logo} alt="Logo" />
        </NavLink>

        <h1 className="navbar-title">
          AL Reem Building
          <p> Materials L.L.C </p>
        </h1>
      </div>

      {/* Navigation Links */}
      <ul className="navbar-links" >

        <li onClick={() => { setMenu("home") }} >
          <Link to='/'> Home </Link>
        </li>

        <li onClick={() => { setMenu("products") }} >
          <Link to='/products'> Products </Link>
        </li>

        <li onClick={() => { setMenu("about") }}>
          <Link to='/about'> About Us </Link>
        </li>

        <li onClick={() => { setMenu("contact") }}>
          <Link to='/contact'> Contact Us </Link>
        </li>

      </ul>

      {/* Icons Section */}
      <div className="navbar-icons" >
        <img onClick={() => { setShowSearch(true); navigate('/products'); }} src={assets.search_icon} className="navbar-icon" alt="" />

        {/* User Dropdown */}
        <div className="navbar-user-container" ref={dropdownRef}>
          <img onClick={() => { if (!token) {
                navigate('login-register');
              } else {
                toggleDropdown();
              }
            }}
            className="navbar-icon navbar-user"
            src={assets.user_icon}
            alt=""
          />

          {/* ----- DropDown Menu ----- */}
          {token && 
          <div className={`dropdown-menu ${isOpen ? 'show' : ''}`} >
            <div className="dropdown-content">
              <p className="dropdown-item"> My Profile </p>
              <p onClick = {() => navigate('/orders')} className="dropdown-item"> Orders </p>
              <p onClick={logout} className="dropdown-item"> Logout </p>
            </div>
          </div> 
          }

        </div>

        {/* Shopping Cart */}
        <Link to="/cart" className="navbar-cart">
          <img src={assets.shopping_cart} className="navbar-cart" alt="Cart" />
          <p className="cart-badge"> {getCartCount()} </p>
        </Link>

      </div>

    </div>
  );
};

export default Navbar;
