import React, { ReactElement } from 'react';
import { Payments } from '../../components/payments';
import { AsideMenu } from '../../components/template/aside-menu';

export const PaymentsPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <Payments />
  </main>
);
