import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type AuthContextType = { isAuthenticated: boolean; login: () => void; logout: () => void };
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(
    () => localStorage.getItem("sun89-auth") === "true",
  );
  const value = useMemo(
    () => ({
      isAuthenticated,
      login: () => {
        localStorage.setItem("sun89-auth", "true");
        setAuthenticated(true);
      },
      logout: () => {
        localStorage.removeItem("sun89-auth");
        setAuthenticated(false);
      },
    }),
    [isAuthenticated],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
};
