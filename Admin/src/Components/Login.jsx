import React from "react";
import axios from 'axios'
import { assets } from "../assets/assets";
import { useState } from "react";
import { backendURL } from "../App";
import { toast } from 'react-toastify'


const Login = ({ setToken }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendURL + "/api/user/admin", {
                email,
                password,
            });

            if (response.data.success) {
                setToken(response.data.token);


            } else {
                toast.error(response.data.message, {
                    className: "custom-toast",
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message, {
                className: "custom-toast",
            });
        }
    };

    return (
        <div className="background-container">
            <img src={assets.login_page} alt="Admin Panel Logo" className="background-image" />
            <div className="form-container">
                <div className="form-title-container">
                    <h1 className="form-title-text">Admin Panel</h1>
                    <div className="form-divider"></div>
                </div>

                <form onSubmit={onSubmitHandler}>
                    <div>
                        <p>Email Address: </p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="your@email.com" className="form-input" required />
                    </div>

                    <div>
                        <p>Password: </p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Enter Your Password" className="form-input" required />
                    </div>

                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
