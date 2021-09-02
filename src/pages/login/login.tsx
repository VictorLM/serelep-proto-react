import React, { ReactElement } from 'react';
import { LoginForm } from '../../components/login-form/login-form';

import styles from './styles.module.scss';

export const LoginPage: React.FC = (): ReactElement => (
  <main className={styles.main}>
    <LoginForm />
  </main>
);
