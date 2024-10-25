// TODO: auth context for firebase authentication

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface AuthContextInterface {
  user: FirebaseAuthTypes.User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextInterface>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loading: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      console.log("user logged in!", user);
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const logout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Error registering: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
