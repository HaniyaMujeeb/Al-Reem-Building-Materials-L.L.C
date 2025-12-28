import React from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('adminToken'); // ✅ remove persisted token
    setToken('');                           // ✅ clear state
    navigate('/');                          // optional redirect
  };

  return (
    <div className='navbar-container'>
      <Link to='/'>
        <img className='navbar-logo' src={assets.logo} alt='' />
      </Link>
      <span className='navbar-title'>ADMIN PANEL</span>

      <div className="navbar-buttons">
        <button onClick={() => navigate('/')} className="home-button">
          Home
        </button>
        <button onClick={logoutHandler} className="logout-button">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;


