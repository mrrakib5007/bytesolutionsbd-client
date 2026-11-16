"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session from /api/auth/me via httpOnly cookie
  useEffect(() => {
    let ignore = false;

    fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Sends httpOnly cookie
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((result) => {
        if (!ignore) {
          if (result?.success && result.data?.user) {
            setUser(result.data.user);
          } else {
            setUser(null);
          }
        }
      })
      .catch((error) => {
        console.warn("Failed to check auth status:", error.message);
        if (!ignore) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Manual refresh helper if needed
  const refreshUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data?.user) {
          setUser(result.data.user);
          return;
        }
      }
      setUser(null);
    } catch (error) {
      console.warn("Failed to refresh user:", error.message);
      setUser(null);
    }
  };

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Allows browser to receive and set httpOnly cookie
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        return {
          success: false,
          message: result.message || "Invalid email or password.",
        };
      }

      setUser(result.data.user);
      return {
        success: true,
        user: result.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error. Please make sure the server is running.",
      };
    }
  };

  // Signup / Register handler
  const signup = async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Allows browser to receive and set httpOnly cookie
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        return {
          success: false,
          message: result.message || "Failed to register account.",
        };
      }

      setUser(result.data.user);
      return {
        success: true,
        user: result.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error. Please make sure the server is running.",
      };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.warn("Logout request failed:", error.message);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
