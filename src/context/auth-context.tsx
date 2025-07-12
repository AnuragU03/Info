
'use client';

import { createContext, useState, useCallback, useMemo, type ReactNode, useContext, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  villageCoins: number;
  login: (role: string) => void;
  logout: () => void;
  redeemCoins: (amount: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [villageCoins, setVillageCoins] = useState(0);

  useEffect(() => {
    // Check for saved auth state in localStorage
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setUserRole(savedRole);
      setIsAuthenticated(true);
      // Initialize coins for logged-in user
      setVillageCoins(1250); 
    }
  }, []);

  const login = useCallback((role: string) => {
    localStorage.setItem('userRole', role);
    setUserRole(role);
    setIsAuthenticated(true);
    setVillageCoins(1250); // Set initial coins on login
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userRole');
    setUserRole(null);
    setIsAuthenticated(false);
    setVillageCoins(0); // Reset coins on logout
  }, []);
  
  const redeemCoins = useCallback((amount: number) => {
    setVillageCoins(prevCoins => Math.max(0, prevCoins - amount));
  }, []);


  const value = useMemo(() => ({
    isAuthenticated,
    userRole,
    login,
    logout,
    villageCoins,
    redeemCoins,
  }), [isAuthenticated, userRole, login, logout, villageCoins, redeemCoins]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
