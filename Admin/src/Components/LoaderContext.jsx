// LoaderContext.jsx
import React, { createContext, useState } from "react";

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {loading && <div className="loader-overlay"><div className="loader"></div></div>}
      {children}
    </LoaderContext.Provider>
  );
};
