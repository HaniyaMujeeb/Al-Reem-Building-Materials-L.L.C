import React, { useContext, useState } from "react";
import { InquiryContext } from "../Context/InquiryContext";

const Inquiry = () => {
  const {
    inquiryItems,
    increaseQuantity,
    decreaseQuantity,
    removeInquiryItem,
    clearInquiry,
    submitInquiry,
  } = useContext(InquiryContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    await submitInquiry({
      name,
      email,
      phone,
      message,
    });

    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="inquiry-page" style={{ paddingTop: "190px" }}>
      <h2>Inquiry Items:</h2>

      {inquiryItems.length === 0 && <h1>No inquiry items added</h1>}

      {inquiryItems.map((item, index) => (
        <div key={index} className="inquiry-item-card">
          <img
            src={item.productImage || item.image}
            alt={item.productName}
          />

          <div>
            <p><strong>{item.productName}</strong></p>
            <p>Size: {item.size || "N/A"}</p>

            <div className="quantity-buttons">
              <button
                onClick={() =>
                  decreaseQuantity(item.productId, item.size)
                }
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  increaseQuantity(item.productId, item.size)
                }
              >
                +
              </button>
            </div>


            <div className="remove-button">
              <button
                onClick={() =>
                  removeInquiryItem(item.productId, item.size)
                }
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      {inquiryItems.length > 0 && (
        <div className="inquiry-form">
          <input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Button group */}
          <div className="button-group">
            <button className="submit-button" onClick={handleSubmit}>
              Submit Inquiry
            </button>
            <button className="clear-button" onClick={clearInquiry}>
              Clear Inquiry
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Inquiry;



{/* remember to add cart count badge and */}