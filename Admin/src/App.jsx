import React from 'react'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './Pages/Add'
import List from './Pages/List'
import Orders from './Pages/Orders'
import { useState } from 'react'
import Login from './Components/Login'
import { ToastContainer  } from 'react-toastify';
import { useEffect } from 'react'
import AdminHome from './Pages/Home'

export const backendURL = import.meta.env.VITE_BACKEND_URL
export const currency = 'AED'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='app-container'>
      <ToastContainer />
      {token === ""
        ? <Login setToken = {setToken} />
        : <>
          <Navbar setToken = {setToken} />

          <div className='app-content'>
            <Sidebar />

            <div className='main-content'>
              <Routes>
                <Route path='/' element={<AdminHome />} />
                <Route path='/add' element={<Add token = {token} />} />
                <Route path='/list' element={<List token = {token} />} />
                <Route path='/orders' element={<Orders token = {token} />} />

              </Routes>
            </div>
          </div>
        </>

      }

    </div>
  )
}

export default App
