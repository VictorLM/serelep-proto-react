import React, { ReactElement } from 'react';
import { NewBillForm } from '../../components/new-bill-form';
import { AsideMenu } from '../../components/template/aside-menu';

export const NewBillPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <NewBillForm />
  </main>
);
