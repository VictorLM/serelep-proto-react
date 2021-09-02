import React, { ReactElement, useState } from 'react';
import { toast } from 'react-toastify';
import isEmail from 'validator/lib/isEmail';
import { get } from 'lodash';
import { api } from '../../config/axios';

import styles from './styles.module.scss';

export const LoginForm: React.FC = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function login(): Promise<void> {
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

    if (formErrors) return;

    const body = {
      email,
      password,
    };

    try {
      const { data } = await api.post('/auth/login', body);
      console.log(data);
      // LIMPAR FORM
      setPassword('');
      setEmail('');
    } catch (err: unknown) {
      //
      console.log(err);
      let errors = { message: ['Erro ao processar operação'] };

      if (get(err, 'response', null)) {
        // HOUVE RESPOSTA COM ERROR CODE
        errors.message = (get(err, 'response.data.message', null)) && (get(err, 'response.data.message', null));
      } else if (get(err, 'request', null)) {
        // NÃO HOUVE RESPOSTA
        errors = { message: ['Nossos servidores não estão respondendo. Por favor, tente novamente mais tarde'] };
      }

      if (Array.isArray(errors.message)) {
        errors.message.map((error) => toast.error(error));
      } else if (typeof errors.message === 'string') {
        toast.error(errors.message);
      } else {
        toast.error('Erro ao processar operação');
      }
    }
  }

  return (
    <div className={`card card-light ${styles.card_login}`}>
      <div className={styles.img_div}>
        <img src="/images/logo_black.png" className="logo" alt="Logo" />
      </div>
      <h2>Bem vindo ao Serelep Prototype</h2>
      <form>
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
        <button type="button" onClick={() => login()}>Login</button>
      </form>
    </div>
  );
};
