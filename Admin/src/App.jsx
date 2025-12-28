import React, { useState, useEffect, useContext } from 'react';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';
import Add from './Pages/Add';
import List from './Pages/List';
import Orders from './Pages/Orders';
import Inquiries from './Pages/Inquiry';
import Login from './Components/Login';
import AdminHome from './Pages/Home';
import { ToastContainer } from 'react-toastify';
import { LoaderContext } from './Components/LoaderContext.jsx';
import EditProduct from './Pages/EditProduct'


export const backendURL = import.meta.env.VITE_BACKEND_URL;
export const currency = 'AED';

const App = () => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("adminToken") || "";
  });
  const { loading, setLoading } = useContext(LoaderContext);
  const location = useLocation();

  // Persist admin token
  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [token]);


  // Loader for route changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500); // show loader for 0.5s min
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className='app-container'>
      <ToastContainer />

      {/* Loader Overlay */}
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />

          <div className='app-content'>
            <Sidebar />

            <div className='main-content'>
              <Routes>
                <Route path='/' element={<AdminHome />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path="/inquiries" element={<Inquiries token={token} />} />
                <Route path="/edit-product/:id" element={<EditProduct token={token} />} />

              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App;

