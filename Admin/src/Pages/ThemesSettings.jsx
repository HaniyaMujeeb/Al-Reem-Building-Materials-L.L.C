import React, { useEffect, useState } from "react";

const ThemeSettings = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [tableCompact, setTableCompact] = useState(false);

    // Load settings from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("darkMode") === "true";
        const savedTable = localStorage.getItem("tableCompact") === "true";

        setDarkMode(savedTheme);
        setTableCompact(savedTable);

        document.body.classList.toggle("dark-mode", savedTheme);
        document.body.classList.toggle("compact-table", savedTable);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("darkMode", newMode);
        document.body.classList.toggle("dark-mode", newMode);
    };

    const toggleTableView = () => {
        const newView = !tableCompact;
        setTableCompact(newView);
        localStorage.setItem("tableCompact", newView);
        document.body.classList.toggle("compact-table", newView);
    };

    return (
        <div className="ThemeSettings">
            <h2>Theme / UI Settings</h2>

            <div className="setting-item">
                <label>
                    <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                    Enable Dark Mode
                </label>
            </div>

            <div className="setting-item">
                <label>
                    <input type="checkbox" checked={tableCompact} onChange={toggleTableView} />
                    Compact Table View
                </label>
            </div>

            <p style={{ marginTop: "10px", color: "#555" }}>
                Your preferences are saved in this browser.
            </p>
        </div>
    );
};

export default ThemeSettings;
