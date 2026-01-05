import React from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setToken, setUser, setRole }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    // Remove all persisted login info
    localStorage.removeItem('adminToken');
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('authRole');

    // Clear React state
    if (setToken) setToken('');
    if (setUser) setUser(null);
    if (setRole) setRole('');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className='navbar-container'>
      <Link to='/'>
        <img className='navbar-logo' src={assets.logo} alt='Logo' />
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



