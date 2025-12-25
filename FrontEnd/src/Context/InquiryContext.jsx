import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ShopContext } from "./ShopContext.jsx";

export const InquiryContext = createContext();

const InquiryProvider = ({ children }) => {
  const { token: shopToken, backendUrl, navigate } = useContext(ShopContext);

  const [token, setToken] = useState("");
  const [inquiryItems, setInquiryItems] = useState(() => {
    const stored = localStorage.getItem("inquiryItems");
    return stored ? JSON.parse(stored) : [];
  });

  const [loading, setLoading] = useState(false); // Loader state

  // Sync token
  useEffect(() => {
    if (shopToken) setToken(shopToken);
  }, [shopToken]);

  // Persist inquiry items
  useEffect(() => {
    localStorage.setItem("inquiryItems", JSON.stringify(inquiryItems));
  }, [inquiryItems]);

  // ➕ Add item
  const addToInquiry = (product) => {
    setInquiryItems((prev) => {
      const index = prev.findIndex(
        (i) =>
          i.productId === product.productId &&
          i.size === product.size
      );

      if (index !== -1) {
        const updated = [...prev];
        updated[index].quantity += 1;
        return updated;
      }

      return [...prev, { ...product, quantity: 1 }];
    });

  };

  // ➕ Increase quantity
  const increaseQuantity = (productId, size) => {
    setInquiryItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ➖ Decrease quantity
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

  // ❌ Remove item
  const removeInquiryItem = (productId, size) => {
    setInquiryItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.size === size)
      )
    );
  };

  // 🧹 Clear inquiry
  const clearInquiry = () => {
    setInquiryItems([]);
    localStorage.removeItem("inquiryItems");
  };

  // 📩 Submit inquiry
  const submitInquiry = async ({ name, email, phone, message }) => {
    const userToken = token || localStorage.getItem("token"); // fallback

    if (!userToken) {
      toast.error("Please login to submit inquiry");
      navigate("/login-register");
      return;
    }

    // rest of your code uses userToken
    setLoading(true);
    try {
      const payload = {
        userName: name,
        userEmail: email,
        userPhone: phone,
        message,
        items: inquiryItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          size: item.size || null,
          quantity: item.quantity,
          productImage: item.productImage || item.image,
        })),
      };

      const res = await axios.post(
        `${backendUrl}/api/inquiry/create`,
        payload,
        { headers: { token: userToken } }
      );

      if (res.data.success) {
        toast.success("Inquiry submitted successfully");
        clearInquiry();
      } else {
        toast.error(res.data.message || "Inquiry failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };



  // 🔢 Get total inquiry count (sum of quantities)
  const getInquiryCount = () => {
    return inquiryItems.reduce((total, item) => total + item.quantity, 0);
  };


  return (
    <InquiryContext.Provider
      value={{
        inquiryItems,
        addToInquiry,
        increaseQuantity,
        decreaseQuantity,
        removeInquiryItem,
        clearInquiry,
        submitInquiry,
        getInquiryCount,
        loading,
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
};

export default InquiryProvider;

