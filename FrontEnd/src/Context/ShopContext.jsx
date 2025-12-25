import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "AED";
  const delivery_fee = 5;
  const vat_rate = 5;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();


  // Fetch products
  // Fetch products
  const getProductData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.data || []); // <-- fixed here
        console.log("Products fetched from backend:", res.data.data); // debug log
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };


  // Get user cart from backend
  const getUserCart = async (userToken) => {
    try {
      const res = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token: userToken } });
      if (res.data.success) setCartItems(res.data.cartData || {});
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  // Merge guest cart
  const mergeGuestCart = async (userToken) => {
    const guestCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
    if (!Object.keys(guestCart).length) return;

    const itemsArray = [];
    for (const itemId in guestCart) {
      const item = guestCart[itemId];
      if (typeof item === "number") itemsArray.push({ itemId, quantity: item });
      else for (const size in item) itemsArray.push({ itemId, size, quantity: item[size] });
    }

    try {
      await axios.post(`${backendUrl}/api/cart/merge`, { items: itemsArray }, { headers: { token: userToken } });
      localStorage.removeItem("cartItems");
    } catch (err) {
      console.error(err);
      toast.error("Failed to merge guest cart: " + err.message);
    }

    await getUserCart(userToken);
  };

  // Add to cart
  const addToCart = async (itemId, size) => {
    let updatedCart = { ...cartItems };
    if (size) {
      if (!updatedCart[itemId]) updatedCart[itemId] = {};
      updatedCart[itemId][size] = (updatedCart[itemId][size] || 0) + 1;
    } else {
      updatedCart[itemId] = (updatedCart[itemId] || 0) + 1;
    }

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId, size: size || null }, { headers: { token } });
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    }
  };

  useEffect(() => {
    getProductData();

    // Load guest cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
    setCartItems(savedCart);

    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      mergeGuestCart(savedToken); // merge guest cart if logged in
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    vat_rate,
    backendUrl,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    addToCart,
    cartItems,
    setCartItems,
    getUserCart,
    mergeGuestCart,
    navigate,
    token,
    setToken,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;

