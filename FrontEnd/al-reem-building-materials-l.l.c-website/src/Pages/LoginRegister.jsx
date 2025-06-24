import React, { use, useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginRegister = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordConditions, setPasswordConditions] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validatePassword = (value) => {
    setPassword(value);
    setPasswordConditions({
      minLength: value.length >= 8,
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*]/.test(value),
    });
  };

  const isPasswordValid = Object.values(passwordConditions).every(Boolean);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currentState === "Sign Up" && !isPasswordValid) {
      alert("Please enter a valid password.");
      return;
    }

    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });

        if (response.data.success) {
          toast.success("Registration successful! Please log in.");
          setCurrentState("Login"); // Redirect to Login view
          setName("");
          setEmail("");
          setPassword("");
          setPasswordConditions({
            minLength: false,
            hasUpperCase: false,
            hasLowerCase: false,
            hasNumber: false,
            hasSpecialChar: false,
          });
        } else {
          toast.error(response.data.message);
        }
        

      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)  

        } else {
          toast.error(response.data.message)
        }

      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)

    }
  };


  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])



  return (
    <div
      className="background-container"
      style={{ backgroundImage: `url(${assets.banner})` }}
    >
      <form onSubmit={onSubmitHandler} className="form-container">
        <div className="form-title-container">
          <p className="form-title-text">{currentState}</p>
          <hr className="form-divider" />
        </div>

        {currentState === "Sign Up" && (
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="form-input"
            placeholder="Name"
            required
            value={name}

          />
        )}

        <input
          type="email"
          className="form-input"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password field with toggle */}
        <div className="password-input-container" >
          <input
            type={showPassword ? "text" : "password"}
            className="password-form-input"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <img
            src={showPassword ? assets.show_password_icon : assets.hide_passsword_icon}
            alt="Toggle Password"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: "-100px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "22px",
              height: "22px",
              cursor: "pointer",
            }}
          />
        </div>

        <div className="forgot-password-container">
          {currentState === "Login" && (
            <p className="forgot-password-text">Forget Password?</p>
          )}
          <p
            onClick={() =>
              setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
            }
            className="toggle-text"
          >
            {currentState === "Login" ? "Create Account" : "Login Here"}
          </p>
        </div>

        {/* Password Strength Tips */}
        {currentState === "Sign Up" && passwordFocused && (
          <ul className="password-conditions">
            <li className={passwordConditions.minLength ? "valid" : "invalid"}>
              ✔ At least 8 characters
            </li>
            <li
              className={
                passwordConditions.hasUpperCase ? "valid" : "invalid"
              }
            >
              ✔ One uppercase letter
            </li>
            <li
              className={
                passwordConditions.hasLowerCase ? "valid" : "invalid"
              }
            >
              ✔ One lowercase letter
            </li>
            <li className={passwordConditions.hasNumber ? "valid" : "invalid"}>
              ✔ One number
            </li>
            <li
              className={
                passwordConditions.hasSpecialChar ? "valid" : "invalid"
              }
            >
              ✔ One special character (!@#$%^&*)
            </li>
          </ul>
        )}

        <button
          className="auth-button"
          disabled={currentState === "Sign Up" && !isPasswordValid}
        >
          {currentState}
        </button>
      </form>
    </div>
  );
};

export default LoginRegister;

