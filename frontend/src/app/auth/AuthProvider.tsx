import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { clearStoredAccessToken, getStoredAccessToken, storeAccessToken } from './authTokenStorage';
import { AuthContext } from './AuthContext';
import type { AuthContextValue, AuthUser } from './AuthContext';
import { apiData } from '../../shared/api/apiData';
import { httpClient } from '../../shared/api/httpClient';

type AuthProviderProps = {
  children: ReactNode;
};

const demoUser: AuthUser = {
  name: 'Demo User',
  email: 'demo@example.com',
};

type LoginResponse = {
  token: string;
  user: {
    displayName: string;
    email: string;
  };
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    getStoredAccessToken() ? demoUser : null,
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      signInDemo: async () => {
        const login = await apiData<LoginResponse>(
          httpClient.post('/auth/login', {
            email: 'demo@example.com',
            password: 'password',
          }),
          { defaultErrorMessage: 'Failed to sign in' },
        );

        storeAccessToken(login.token);
        setUser({
          name: login.user.displayName,
          email: login.user.email,
        });
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
