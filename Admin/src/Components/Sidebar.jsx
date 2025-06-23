import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className='sidebar-menu'>

                <NavLink className='sidebar-link' to="/add">
                    <img src={assets.add_icon} alt='' />
                    <p> Add Products  </p>
                </NavLink>

                <NavLink className='sidebar-link' to="/list">
                    <img src={assets.order_icon} alt='' />
                    <p> List Products  </p>
                </NavLink>

                <NavLink className='sidebar-link' to="/orders">
                    <img src={assets.order_icon} alt='' />
                    <p> Orders  </p>
                </NavLink>

            </div>

        </div>
    )
}

export default Sidebar