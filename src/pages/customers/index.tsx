import React, { ReactElement } from 'react';
import { Customers } from '../../components/customers';
import { AsideMenu } from '../../components/template/aside-menu';

export const CustomersPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <Customers />
  </main>
);
