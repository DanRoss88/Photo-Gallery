import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  FC,
} from "react";
import { AuthContextType, User } from "../types";
import { apiClientInstance } from "../Services/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    try {
      const response = await apiClientInstance.get<User>("/auth/verify-token");
      setUser(response);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error during session check:", error);

      // Notify the user about session expiration or unauthorized access
      if (error === 401) {
        alert("Session expired, please log in again.");
      }
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await apiClientInstance.post<{ user: User }>(
        "/users/login",
        { email, password }
      );
      setUser(response.user);
      setIsLoggedIn(true);
      return response.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<User> => {
    try {
      const response = await apiClientInstance.post<{ user: User }>(
        "/users/register",
        { username, email, password }
      );
      setUser(response.user);
      setIsLoggedIn(true);
      return response.user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClientInstance.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, register, logout, isLoading }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
