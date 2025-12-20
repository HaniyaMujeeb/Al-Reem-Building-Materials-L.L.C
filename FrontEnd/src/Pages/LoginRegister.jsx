import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginRegister = () => {
  const { token, setToken, navigate, backendUrl, mergeGuestCart } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");

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

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (currentState === "Sign Up" && !isPasswordValid) {
      alert("Please enter a valid password.");
      return;
    }

    try {
      let url;
      let payload;

      if (currentState === "Sign Up") {
        url = `${backendUrl}/api/user/register`;
        payload = { name, email, password };
      } else {
        url = `${backendUrl}/api/user/login`;
        payload = { email, password };
      }


      const res = await axios.post(url, payload);


      if (res.data.success) {
        if (currentState === "Sign Up") {
          toast.success("Registration successful! Please log in.");
          setCurrentState("Login");
          setName(""); setEmail(""); setPassword("");
        } else {
          const userToken = res.data.token;

          // Merge guest cart BEFORE setting token
          await mergeGuestCart(userToken);

          // Set token in context + localStorage
          setToken(userToken);
          localStorage.setItem("token", userToken);

          navigate("/");
        }
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Request failed");
    }
  };

  return (
    <div className="background-container" style={{ backgroundImage: `url(${assets.banner})` }}>
      <form onSubmit={onSubmitHandler} className="form-container">
        <div className="form-title-container">
          <p className="form-title-text">{currentState}</p>
          <hr className="form-divider" />
        </div>

        {currentState === "Sign Up" && (
          <input
            type="text"
            className="form-input"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        <div className="password-input-container">
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
            style={{ position: "absolute", right: "-100px", top: "50%", transform: "translateY(-50%)", width: "22px", height: "22px", cursor: "pointer" }}
          />
        </div>

        <div className="forgot-password-container">
          {currentState === "Login" && <p className="forgot-password-text">Forget Password?</p>}
          <p
            onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
            className="toggle-text"
          >
            {currentState === "Login" ? "Create Account" : "Login Here"}
          </p>
        </div>

        {currentState === "Sign Up" && passwordFocused && (
          <ul className="password-conditions">
            <li className={passwordConditions.minLength ? "valid" : "invalid"}>✔ At least 8 characters</li>
            <li className={passwordConditions.hasUpperCase ? "valid" : "invalid"}>✔ One uppercase letter</li>
            <li className={passwordConditions.hasLowerCase ? "valid" : "invalid"}>✔ One lowercase letter</li>
            <li className={passwordConditions.hasNumber ? "valid" : "invalid"}>✔ One number</li>
            <li className={passwordConditions.hasSpecialChar ? "valid" : "invalid"}>✔ One special character (!@#$%^&*)</li>
          </ul>
        )}

        <button className="auth-button" disabled={currentState === "Sign Up" && !isPasswordValid}>
          {currentState}
        </button>
      </form>
    </div>
  );
};

export default LoginRegister;
