import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
        <div className = 'footer-container'>

            <div className = 'footer-logo'>

                <img src = {assets.logo} className = 'footer-logo-img' alt='' />
                <p className = 'footer-description'>
                Al Reem Building Materials L.L.C., we are committed to providing high-quality building materials with exceptional 
                service. With a wide range of products and a dedication to customer satisfaction, we strive to be your trusted partner 
                for all your construction needs.
                </p>
            </div>

            <div className = 'footer-links'>
                <p className = 'footer-section-title'> COMPANY </p>
                <ul className = 'footer-list'>

                <li> <Link to = "/" >Home </Link> </li>
                <li> <Link to = "/product" >Products </Link> </li>
                <li> <Link to = "/about" >About Us </Link> </li>
                <li> 
                    <a href="../src/assets/policy.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                </li>


                </ul>
            </div>

            <div className = 'footer-contact'>
                <p className = 'footer-contact-title'> CONTACT US </p>
                <ul>
                    <li> 072288872 / +971554312001 / +971556478562 </li>
                    <li> reembuilding@gmail.com</li>
                </ul>
            </div>

            <div className='footer-social'>
                <p className='footer-social-title'> FOLLOW US:</p>
                <div className='footer-social-icons'>
                    <a href="https://www.instagram.com/alreembuilding?igsh=MTVkeHJzbmNjeHV1aQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
                        <img src = {assets.instagram_icon} />
                    </a>
                    <a href="https://www.tiktok.com/@al.reem.buidling?_t=ZS-8xhL9X42XuT&_r=1" target="_blank" rel="noopener noreferrer">
                        <img src = {assets.tiktok_icon} />
                    </a>
                </div>
            </div>


            <div className = 'footer-bottom'>
                <hr />
                <p className = 'footer-copyright'> 
                    Copyright 2025@, Al Reem Building Materials L.L.C. | Quality You Can Trust, Service You Can Rely On 
                    | All Right Reserved 
                </p>
            </div>

        </div>
      
    </div>
  )
}

export default Footer
