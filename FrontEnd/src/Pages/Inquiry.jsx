import React, { useContext, useState } from "react";
import { InquiryContext } from "../Context/InquiryContext";
import "../style.css";
import "../mobile.css";

const Inquiry = () => {
  const {
    inquiryItems,
    submitInquiry,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(InquiryContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !phone || !message) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await submitInquiry({ name, email, phone, message });
      alert("Inquiry sent successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      alert("Failed to send inquiry. Try again.");
    }
  };

  return (
    <div className="inquiry-page" style={{ paddingTop: "80px" }}>
      <h2>Inquiry Items</h2>

      {inquiryItems.length === 0 && <p>No items added for inquiry</p>}

      <div className="inquiry-items-container">
        {inquiryItems.map((item, index) => (
          <div key={index} className="inquiry-item-card">
            <img
              src={item.productImage || item.image}
              alt={item.productName}
              className="inquiry-item-image"
            />
            <div className="inquiry-item-info">
              <p><strong>{item.productName}</strong></p>
              <p>Size: {item.size}</p>
              <p>Quantity: {item.quantity}</p>
              <div className="quantity-buttons">
                <button onClick={() => decreaseQuantity(item.productId, item.size)}>-</button>
                <button onClick={() => increaseQuantity(item.productId, item.size)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {inquiryItems.length > 0 && (
        <div className="inquiry-form">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            placeholder="Your Message / Inquiry"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit Inquiry</button>
        </div>
      )}
    </div>
  );
};

export default Inquiry;
