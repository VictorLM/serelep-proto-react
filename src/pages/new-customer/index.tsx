import React, { ReactElement } from 'react';
import { NewCustomerForm } from '../../components/new-customer-form';
import { AsideMenu } from '../../components/template/aside-menu';

export const NewCustomerPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <NewCustomerForm />
  </main>
);
