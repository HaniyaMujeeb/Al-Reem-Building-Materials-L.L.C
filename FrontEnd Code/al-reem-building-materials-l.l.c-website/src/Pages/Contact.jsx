import React from 'react';
import Title from '../Component/Title';

const Contact = () => {
  return (
    <div className="contact-container">
      {/* Header */}
      <div className="contact-title">
        <Title text1="CONTACT" text2="US :" />
      </div>

      {/* Contact Details + Map (Side-by-Side Layout) */}
      <div className="contact-content">
        {/* Left Section - Google Map */}
        <div className="map-container">
          <iframe
            title="Google Map Location"
            className="google-map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3591.6387190541213!2d55.97011787540221!3d25.815490477318146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ef6712251ec40c7%3A0x15f50bbc8ec02d0b!2sAl%20Reem%20Building%20Materials!5e0!3m2!1sen!2sae!4v1743134196705!5m2!1sen!2sae"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            aria-label="Map showing location of Al Reem Building Materials"
          ></iframe>
        </div>

        {/* Right Section - Contact Info & Working Hours */}
        <div className="contact-info-container">
          <div className="contact-info">
            <p className="contact-heading">📍 Our Store :</p>
            <p className="contact-text">
              Sheikh Salem Bin Sultan Road <br /> Al Mamourah, Ras Al Khaimah
            </p>
            <p className="contact-text">
              📞 Tel: (+971) 556795888 <br />
              ✉️ Email: <a href="mailto:contact@alreembuildingmaterials.com">contact@alreembuildingmaterials.com</a>
            </p>
          </div>

          <div className="working-hours">
            <p className="working-hours-heading">🕒 Working Days & Hours :</p>
            <p>Saturday - Thursday</p>
            <p>Morning: <br /> 8AM - 12PM</p>
            <p>Afternoon: <br /> 3PM - 9PM</p>
          </div>
        </div>
      </div>

      {/* Contact Button */}
      <div className="contact-btn-container">
        <a href="mailto:contact@alreembuildingmaterials.com" className="contact-btn">
          ✉️ Send Us an Email
        </a>

        <a href="https://wa.me/971556795888" className="contact-btn" target="_blank" rel="noopener noreferrer">
           Chat on WhatsApp
        </a>

      </div>
    </div>
  );
};

export default Contact;




