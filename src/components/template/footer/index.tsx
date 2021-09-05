import React, { ReactElement } from 'react';

import styles from './styles.module.scss';

export const Footer: React.FC = (): ReactElement => (
  <footer className={styles.footer}>
    <span>Copyright Avincer Studio © 2020</span>
  </footer>
);
