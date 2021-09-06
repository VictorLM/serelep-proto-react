import React, { ReactElement } from 'react';

import styles from './styles.module.scss';

export const Footer: React.FC = (): ReactElement => (
  <footer className={styles.footer}>
    <span>
      Copyright Avincer Studio ©
      {' '}
      {new Date().getFullYear()}
    </span>
  </footer>
);
