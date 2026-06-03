import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { clearStoredAccessToken, getStoredAccessToken, storeAccessToken } from './authTokenStorage';
import { AuthContext } from './AuthContext';
import type { AuthContextValue, AuthUser } from './AuthContext';

type AuthProviderProps = {
  children: ReactNode;
};

const demoUser: AuthUser = {
  name: 'Demo User',
  email: 'demo@example.com',
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    getStoredAccessToken() ? demoUser : null,
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      signInDemo: () => {
        storeAccessToken('demo-token');
        setUser(demoUser);
      },
      signOut: () => {
        clearStoredAccessToken();
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
