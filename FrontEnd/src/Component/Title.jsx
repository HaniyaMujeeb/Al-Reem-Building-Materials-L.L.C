import React from 'react'
import '../style.css'; 
import "../mobile.css";

const Title = ({text1, text2} ) => {
  return (
    <div className="title-container">
      <p className="text-latest-title-text">
        {text1} <span className="text-highlight">{text2}</span>
      </p>
    </div>
  )
}

export default Title
