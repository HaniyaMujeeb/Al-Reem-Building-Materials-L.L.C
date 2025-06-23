import React from 'react'
import Title from '../Component/Title'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="about-page">
      {/* Section Title */}
      <div className="about-header">
        <Title text1={"ABOUT"} text2={"US"} />
        <div className="about-header-line"></div>
      </div>

      {/* Content Section */}
      <div className="about-content">
        {/* Image Section (Left Side) */}
        <div className="about-image-container">
          <img className="about-image" src={assets.shop_image} alt="About Us" />
        </div>

        {/* Text Content (Right Side) */}
        <div className="about-text">
          <p>
            Established in 1984 in Ras Al Khaimah, UAE, Al Reem Building Materials L.L.C has grown from a small shop into a
            trusted name in the construction industry. Founded by Mohammed Hanif, the vision was simple to bring all essential
            building materials under one roof. What started with just 10 to 15 employees and a limited selection of products has now
            expanded into a fully stocked supplier with over 5,000 items and a team of 40 to 50 dedicated professionals.
          </p>

          <p>
            Now led by Mujeeb Ur Rehman, Al Reem continues to evolve, offering a comprehensive range of high-quality building
            materials tailored to meet the demands of modern construction and renovation projects. With over 40 years of industry
            expertise, we understand the needs of our customers and provide top-tier solutions, from raw materials and plumbing
            supplies to power tools, steel, wood, and hardware essentials.
          </p>

          <b className='mission-title'>
            Our Mission :
          </b>

          <p>
          "Our mission at Al Reem Building Materials L.L.C is to be a trusted partner in the construction industry by providing 
          high-quality materials, reliable solutions, and exceptional customer service. We strive to support builders, contractors, 
          and homeowners with the best products to bring their projects to life with confidence and excellence."
          </p>
        </div>
      </div>

      <div className = 'why-choose-container'>
        <div className = 'why-choose-title'>
          <Title text1 = {'Why Choose'} text2 = {'Al Reem Building Materials L.L.C :'} />
        </div>
        
      </div>

      <div className = 'why-choose-features'>
        
        <div className = 'feature-box'>
          <b> Quality Assurance : </b>
          <p className = 'feature-text'> We are committed to providing high-quality building materials, ensuring durability, reliability, and customer satisfaction in every product we offer. </p>
        </div>

        <div className = 'feature-box'>
          <b> Convenience : </b>
          <p className = 'feature-text'> We make shopping easy with a seamless, convenient experience tailored to your needs. </p>
        </div>

        <div className = 'feature-box'>
          <b> Exceptional Customer Service : </b>
          <p className = 'feature-text'> We ensure a smooth, hassle-free exchange process with a customer-friendly approach for complete satisfaction. </p>
        </div>

      </div>
    </div>
  )
}

export default About;

