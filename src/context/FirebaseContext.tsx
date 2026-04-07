import React, { createContext, useContext, useEffect, useState } from 'react';

interface FirebaseContextType {
  user: any | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/me');
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const register = async (name: string, email: string) => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      if (data.success) {
        alert("Registration successful! Please login.");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
