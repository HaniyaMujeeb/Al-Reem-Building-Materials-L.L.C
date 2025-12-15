import React, { createContext, useState } from "react";
import axios from "axios";

export const InquiryContext = createContext();

const InquiryContextProvider = ({ children }) => {
  const [inquiryItems, setInquiryItems] = useState([]);

  // Add product to inquiry
  const addToInquiry = (item) => {
    setInquiryItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && i.size === item.size
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Increase quantity
  const increaseQuantity = (productId, size) => {
    setInquiryItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (productId, size) => {
    setInquiryItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Submit all inquiries
  const submitInquiry = async (customerInfo) => {
    try {
      const response = await axios.post("/api/inquiry/create", {
        ...customerInfo,
        items: inquiryItems,
      });
      setInquiryItems([]); // Clear after submission
      return response.data;
    } catch (err) {
      console.error("Inquiry submission failed:", err);
      throw err;
    }
  };

  return (
    <InquiryContext.Provider
      value={{
        inquiryItems,
        addToInquiry,
        submitInquiry,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
};

export default InquiryContextProvider;


