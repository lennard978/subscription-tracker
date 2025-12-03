import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [trialStart, setTrialStart] = useState(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);

  // Load auth state on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTrial = localStorage.getItem("trialStart");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedTrial) {
      const start = new Date(storedTrial);
      setTrialStart(start);

      // Trial length = 7 days
      const now = new Date();
      const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));

      if (diffDays >= 7) {
        setIsTrialExpired(true);
      }
    }
  }, []);

  // Login (temporary mock)
  const login = async (email, password) => {
    // Real backend will replace this later
    const mockUser = { email };

    localStorage.setItem("user", JSON.stringify(mockUser));

    // If user logs in for first time, start trial
    if (!localStorage.getItem("trialStart")) {
      const now = new Date().toISOString();
      localStorage.setItem("trialStart", now);
      setTrialStart(new Date(now));
    }

    setUser(mockUser);
    return true;
  };

  // Signup works the same for now (mock)
  const signup = async (email, password) => {
    const mockUser = { email };

    localStorage.setItem("user", JSON.stringify(mockUser));

    // Start 7-day trial
    const now = new Date().toISOString();
    localStorage.setItem("trialStart", now);
    setTrialStart(new Date(now));

    setUser(mockUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("user");
    // We keep the trialStart so user can log out/in
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isTrialExpired,
        trialStart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// src/hooks/useAuth.jsx
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
};



