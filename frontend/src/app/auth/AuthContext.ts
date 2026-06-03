import { createContext } from 'react';

export type AuthUser = {
  name: string;
  email: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signInDemo: () => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
