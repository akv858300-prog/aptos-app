import { createContext, useState, useEffect } from "react";

// 1. Create the Context
export const UserContext = createContext();

// 2. Create the Provider Component
export const UserProvider = ({ children }) => {
  // Global User Identity
  const [userName, setUserName] = useState("Abhishek");
  
  // Global Credit Balance (Persisted)
  const [credits, setCredits] = useState(() => {
    const saved = localStorage.getItem("aptosGlobalCredits");
    return saved ? parseInt(saved) : 100; // Start with 100 free credits
  });

  // Automatically save credit balance on every change
  useEffect(() => {
    localStorage.setItem("aptosGlobalCredits", credits.toString());
  }, [credits]);

  const spendCredits = (amount) => {
    setCredits((prev) => prev - amount);
  };

  return (
    <UserContext.Provider value={{ userName, credits, spendCredits }}>
      {children}
    </UserContext.Provider>
  );
};