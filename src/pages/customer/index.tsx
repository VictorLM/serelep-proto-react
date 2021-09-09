import React, { ReactElement } from 'react';
import { SingleCustomer } from '../../components/customer';
import { AsideMenu } from '../../components/template/aside-menu';

export const CustomerPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <SingleCustomer />
  </main>
);
