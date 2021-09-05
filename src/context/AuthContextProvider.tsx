import { useState, useEffect } from 'react';

// import api from '../../api';
import history from '../history/history';
import { AuthContextInterface } from './AuthContext';
import { login } from '../api/login';
import { getUser } from '../api/getUser';
import { User } from '../types/user.type';
import { logout } from '../api/logout';

export default function AuthContextProvider(): AuthContextInterface {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const foundUser = await getUser();
      if (foundUser) {
        setIsAuthenticated(true);
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
      setIsAuthenticated(true);
      setLoading(false);
      history.push('/dashboard');
    }
  }

  async function handleLogout(): Promise<void> {
    if (await logout()) {
      setUser(undefined);
      setIsAuthenticated(false);
      setLoading(false);
      history.push('/login');
    }
  }

  return {
    isAuthenticated, user, loading, handleLogin, handleLogout,
  };
}
