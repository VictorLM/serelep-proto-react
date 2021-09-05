import React, { ReactElement } from 'react';
import { Dashoboard } from '../../components/dashboard';
import { AsideMenu } from '../../components/template/aside-menu';

import styles from './styles.module.scss';

export const DashboardPage: React.FC = (): ReactElement => (
  <main className={`main ${styles.main}`}>
    <AsideMenu />
    <Dashoboard />
  </main>
);
