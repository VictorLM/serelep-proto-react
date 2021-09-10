import { useState, useEffect } from 'react';
import history from '../history/history';
import { AuthContextInterface } from './AuthContext';
import { getUser, login, logout } from '../api/auth';
import { User } from '../types/user.type';

export default function AuthContextProvider(): AuthContextInterface {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (history.location.pathname === '/login') return;
      const foundUser = await getUser();
      if (foundUser) {
        setUser(foundUser);
      }
      setLoading(false);
    })();
  }, []);

  async function handleLogin(
    email: string,
    password: string,
  ): Promise<void> {
    if (await login(email, password)) {
      setLoading(false);
      history.push('/dashboard');
    }
  }

  async function handleLogout(): Promise<void> {
    if (await logout()) {
      setUser(undefined);
      setLoading(false);
      history.push('/login');
    }
  }

  return {
    user, loading, handleLogin, handleLogout,
  };
}
