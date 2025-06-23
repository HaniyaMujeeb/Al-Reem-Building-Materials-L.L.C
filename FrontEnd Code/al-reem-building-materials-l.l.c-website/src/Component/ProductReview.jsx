import React from 'react';
import starIcon from '../assets/rating_icon.png';
import starOutline from '../assets/less_rating_icon.png'; 

const reviews = [
  { user: "Ahmed R.", rating: 5, comment: "Excellent quality, very durable!" },
  { user: "Sara K.", rating: 4, comment: "Good product, but shipping took a bit long." },
  { user: "John D.", rating: 5, comment: "Exactly as described. Highly recommended!" },
  { user: "Fatima M.", rating: 3, comment: "Average quality. Expected better." },
  { user: "Hassan A.", rating: 4, comment: "Good value for money. Will buy again!" },
  { user: "Zainab L.", rating: 5, comment: "Superb finish and sturdy material." },
  { user: "Omar E.", rating: 4, comment: "A bit expensive but worth it." },
  { user: "Aisha N.", rating: 5, comment: "Top-notch quality, really impressed!" },
  { user: "Bilal S.", rating: 3, comment: "Not bad, but had minor scratches." },
  { user: "Nadia P.", rating: 4, comment: "Overall good experience with this product." }
];

const renderStars = (rating) => {
  return Array.from({ length: 5 }).map((_, i) => (
    <img 
      key={i} 
      src={i < rating ? starIcon : starOutline} 
      alt="star" 
      className="star-icon"
    />
  ));
};

const ProductReviews = () => {
  return (
    <div className="reviews-container">
      <h2>Customer Reviews</h2>
      {reviews.map((review, index) => (
        <div key={index} className="review">
          <h4>{review.user}</h4>
          <div className="review-rating">{renderStars(review.rating)}</div>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
