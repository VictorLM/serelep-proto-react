import React, { createContext } from 'react';
import { User } from '../types/user.type';

import AuthContextProvider from './AuthContextProvider';

export interface AuthContextInterface {
  isAuthenticated: boolean;
  user: User | undefined;
  loading: boolean;
  handleLogin: (email: string, password: string) => void;
  handleLogout: () => void;
}

export const authContextDefaults: AuthContextInterface = {
  isAuthenticated: false,
  user: undefined,
  loading: true,
  handleLogin: () => null,
  handleLogout: () => null,
};

const AuthContext = createContext<AuthContextInterface>(
  authContextDefaults,
);

type AuthProviderProps = {
  children: React.ReactNode;
};

// eslint-disable-next-line
function AuthProvider({ children }: AuthProviderProps) {
  const authContextValues = AuthContextProvider();

  return (
    <AuthContext.Provider value={authContextValues}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
