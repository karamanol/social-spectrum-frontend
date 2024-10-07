import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUser } from "../services/apiUsers";

export interface UserType {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  bgPicture?: string;
  profilePicture?: string;
  country?: string;
  statusText?: string;
  languages?: string;
  visibility: string;
}

type UserContextType = {
  currentUser: UserType | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  refreshUserData: (id: string) => Promise<void>;
} | null;

const AuthContext = createContext<UserContextType>(null);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserType>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const login = async (data: { email: string; password: string }) => {
    const res = await axios.post("/auth/login", data);

    if ("data" in res.data) {
      setCurrentUser(res.data.data);
    }
  };

  const refreshUserData = async (id: string) => {
    const user = await getUser({ userId: id });
    if (user && Array.isArray(user) && user.length) {
      setCurrentUser(user[0]);
    } else {
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    if (currentUser) localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  return context;
}

export { AuthContextProvider, useAuth };
