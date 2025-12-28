import React from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

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
        <button onClick={() => setToken('')} className="logout-button">
          Log Out
        </button>
      </div>

    </div>
  );
};

export default Navbar;

