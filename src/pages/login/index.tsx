import React, { ReactElement } from 'react';
import { LoginForm } from '../../components/login-form/login-form';
import { UserProps } from '../../types/user.type';

import styles from './styles.module.scss';

export const LoginPage: React.FC<UserProps> = (): ReactElement => (
  <main className={styles.main}>
    <LoginForm />
  </main>
);
