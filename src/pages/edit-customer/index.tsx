import React, { ReactElement } from 'react';
import { EditCustomerForm } from '../../components/edit-customer-form';
import { AsideMenu } from '../../components/template/aside-menu';

export const EditCustomerPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <EditCustomerForm />
  </main>
);
