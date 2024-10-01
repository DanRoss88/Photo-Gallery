import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
  
    const login = (userData: User) => {
      setIsLoggedIn(true);
      setUser(userData);
    };
  
    const logout = () => {
      setIsLoggedIn(false);
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };