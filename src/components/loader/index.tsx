import React, { ReactElement } from 'react';

import styles from './styles.module.scss';

export const Loader: React.FC = (): ReactElement => (
  <div className={styles.div}>
    <div className={styles.loader} />
  </div>
);
