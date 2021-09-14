import { useState, useEffect } from 'react';
import history from '../history/history';
import { AuthContextInterface } from './AuthContext';
import { getUser, login, logout } from '../api/auth';
import { User } from '../types/user.type';

export default function AuthContextProvider(): AuthContextInterface {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  async function handleGetUser(): Promise<void> {
    setLoading(true);
    if (!user) {
      const foundUser = await getUser();
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setLoading(false);
  }

  async function handleLogin(
    email: string,
    password: string,
  ): Promise<void> {
    if (await login(email, password)) {
      await handleGetUser();
      history.push('/dashboard');
    }
  }

  async function handleLogout(): Promise<void> {
    if (await logout()) {
      setUser(undefined);
      history.push('/login');
    }
  }

  useEffect(() => {
    (async () => {
      if (history.location.pathname === '/login') {
        setLoading(false);
        return;
      }
      await handleGetUser();
    })();
  });

  return {
    user, loading, handleLogin, handleLogout,
  };
}
