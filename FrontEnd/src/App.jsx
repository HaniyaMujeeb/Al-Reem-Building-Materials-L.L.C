import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Products from './Pages/Products';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Item from './Pages/Item';
import LoginRegister from './Pages/LoginRegister';
import PlaceOrder from './Pages/PlaceOrder';
import Orders from './Pages/Orders';
import Cart from './Pages/Cart';
import Navbar from './Component/Navbar';
import Footer from './Component/Footer';
import Loader from './Component/Loader';
import SearchBar from './Component/SearchBar';
import { ToastContainer, toast } from 'react-toastify';
import CardPayment from './Pages/CardPayment';
import OrderConfirmation from './Pages/OrderConfirmation';
import Inquiry from './Pages/Inquiry';
import Profile from './Pages/Profile';
import MyInquiries from './Pages/MyInquiry';

export const backendURL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300); 
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="app-container">
      <ToastContainer />

      {loading && <Loader />}

      <Navbar />
      <SearchBar />
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/products" element = {<Products />} />
        <Route path = "/about" element = {<About />} />
        <Route path = "/contact" element = {<Contact />} />
        <Route path = "/products/:productID" element = {<Item />} />
        <Route path = "/login-register" element = {<LoginRegister />} />
        <Route path = "place-order" element = {<PlaceOrder />} />
        <Route path = "/orders" element = {<Orders />} />
        <Route path = "/cart" element = {<Cart />} />
        <Route path = "/card-payment" element={<CardPayment />} />
        <Route path = "/order-confirmation" element={<OrderConfirmation />} />
        <Route path = "/inquiry" element = {<Inquiry />} />
        <Route path = "/profile" element={<Profile />} />
        <Route path = "/my-inquiries" element={<MyInquiries />} />


      </Routes>
      <Footer />
      
    </div>
  );
};

export default App;
