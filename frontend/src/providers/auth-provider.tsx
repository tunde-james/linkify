import { ReactNode } from "react";
import { useAuth } from "../api/user-auth-api";
// import { useAuth } from "../hooks/use-auth";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  useAuth();

  return <>{children}</>;
};

export default AuthProvider;
