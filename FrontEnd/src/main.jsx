import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import App from "./App.jsx";
import ShopContextProvider from "./Context/ShopContext.jsx";
import "./style.css";
import "./mobile.css";

// Custom Loader Component
const Loader = () => (
  <div id="page-loader" className="show-loader">
    <div className="loader">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
);

// Component to handle route-based loading
const RouteChangeHandler = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // Show loader when route changes
    const timer = setTimeout(() => setLoading(false), 100); 
    return () => clearTimeout(timer); // Cleanup
  }, [location.pathname]); // Trigger on pathname change

  return loading ? <Loader /> : null;
};

// Root Component
const RootComponent = () => {
  return (
    <BrowserRouter>
      <ShopContextProvider>
        <RouteChangeHandler />
        <App />
      </ShopContextProvider>
    </BrowserRouter>
  );
};

// Render App
createRoot(document.getElementById("root")).render(<RootComponent />);
