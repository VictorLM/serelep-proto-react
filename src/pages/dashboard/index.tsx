import React, { ReactElement } from 'react';
import { Dashboard } from '../../components/dashboard';
import { AsideMenu } from '../../components/template/aside-menu';

export const DashboardPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <Dashboard />
  </main>
);
