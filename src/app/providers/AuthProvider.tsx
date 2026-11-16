import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AUTH_CUSTOMER_KEY,
  AUTH_FLAG_KEY,
  AUTH_TOKEN_KEY,
  normalizeCustomer,
  repositories,
} from "../../services/repositories";
import type { Customer, CustomerType } from "../../types";

type AuthContextType = {
  isAuthenticated: boolean;
  customer: Customer | null;
  login: (credentials: { email: string; password: string }) => Promise<Customer>;
  register: (payload: {
    customerType?: CustomerType;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
    detailAlamat?: string;
  }) => Promise<Customer>;
  setCustomerProfile: (next: Customer) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [isAuthenticated, setAuthenticated] = useState(
    () =>
      Boolean(localStorage.getItem(AUTH_TOKEN_KEY)) ||
      localStorage.getItem(AUTH_FLAG_KEY) === "true",
  );
  const [customer, setCustomer] = useState<Customer | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_CUSTOMER_KEY);
      return stored ? normalizeCustomer(JSON.parse(stored)) : null;
    } catch {
      return null;
    }
  });

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      customer,
      login: async (credentials) => {
        const res = await repositories.auth.login(credentials);
        setCustomer(res.customer);
        setAuthenticated(true);
        queryClient.setQueryData(["customer"], res.customer);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        return res.customer;
      },
      register: async (payload) => {
        const res = await repositories.auth.register(payload);
        setCustomer(res.customer);
        setAuthenticated(true);
        queryClient.setQueryData(["customer"], res.customer);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        return res.customer;
      },
      setCustomerProfile: (next) => {
        const normalized = normalizeCustomer(next);
        setCustomer(normalized);
        queryClient.setQueryData(["customer"], normalized);
      },
      logout: () => {
        repositories.auth.logout();
        setCustomer(null);
        setAuthenticated(false);
        queryClient.removeQueries({ queryKey: ["customer"] });
        queryClient.removeQueries({ queryKey: ["orders"] });
      },
    }),
    [isAuthenticated, customer, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
};
