import React, { useState, useEffect } from "react";


const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDark = localStorage.getItem("darkMode") === "true";

    setDarkMode(savedDark);

    document.body.classList.toggle("dark-mode", savedDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.body.classList.toggle("dark-mode", newMode);
  };

  return (
    <div className="theme-toggle-container">
      <button onClick={toggleDarkMode}>
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

    </div>
  );
};

export default ThemeToggle;
