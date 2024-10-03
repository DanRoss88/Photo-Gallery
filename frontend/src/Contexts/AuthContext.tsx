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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    try {
      const response = await apiClientInstance.get<User>("/auth/verify-token");
      setUser(response);
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const response = await apiClientInstance.post<{ user: User }>("/users/login", { email, password });
    setUser(response.user);
    return response.user;
  };

  const register = async (username: string, email: string, password: string): Promise<User> => {
    const response = await apiClientInstance.post<{ user: User }>("/users/register", { username, email, password });
    setUser(response.user);
    return response.user;
  };

  const logout = async (): Promise<void> => {
    await apiClientInstance.post("/users/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
