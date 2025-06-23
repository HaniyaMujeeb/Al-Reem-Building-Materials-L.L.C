import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom';


const Navbar = ({setToken}) => {
  return (
    <div className = 'navbar-container'>
      <Link to = '/' > <img className = 'navbar-logo' src = {assets.logo} alt='' /> </Link>
      <span className = 'navbar-title'> ADMIN PANEL </span>
      <button onClick = {() => setToken('')} className = 'logout-button'> Log Out</button>
    </div>
  )
}

export default Navbar
