import React from 'react'
import '../style.css'; 

const Title = ({text1, text2} ) => {
  return (
    <div className="title-container">
      <p className="text">
        {text1} <span className="highlight">{text2}</span>
      </p>
    </div>
  )
}

export default Title
