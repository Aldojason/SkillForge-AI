import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, setAccessToken } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "PREMIUM" | "ADMIN";
  profile?: { currentStreak: number; longestStreak: number };
  subscription?: { plan: string; status: string };
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.data);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    // On first load, try to silently refresh — the httpOnly cookie may still be valid
    (async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.data.accessToken);
        await loadMe();
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.data.accessToken);
    await loadMe();
  }

  async function register(name: string, email: string, password: string) {
    const { data } = await api.post("/auth/register", { name, email, password });
    setAccessToken(data.data.accessToken);
    await loadMe();
  }

  async function logout() {
    await api.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refetchUser: loadMe }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
