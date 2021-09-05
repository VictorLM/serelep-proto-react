import React, {
  ReactElement, SyntheticEvent, useContext, useState,
} from 'react';
import { toast } from 'react-toastify';
import isEmail from 'validator/lib/isEmail';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import styles from './styles.module.scss';

export const LoginForm: React.FC = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isAuthenticated, handleLogin } = useContext(AuthContext);

  async function login(e: SyntheticEvent): Promise<void> {
    e.preventDefault();
    // VALIDANDO FORM
    let formErrors = false;
    if (!isEmail(email)) {
      formErrors = true;
      toast.error('E-mail inválido.');
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('Senha deve ter entre 6 e 255 caracteres');
    }

    if (!formErrors) handleLogin(email, password);
  }

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className={`card card-light ${styles.card_login}`}>
      <div className={styles.img_div}>
        <img src="/images/logo_black.png" className="logo" alt="Logo" />
      </div>
      <h2>Bem vindo ao Serelep Prototype</h2>
      <form onSubmit={(e) => login(e)}>
        <label htmlFor="email">
          Email
          <input
            type="email"
            placeholder="Insira seu email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password">
          Senha
          <input
            type="password"
            placeholder="Insira sua senha"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="btn-black">Login</button>
      </form>
    </div>
  );
};
