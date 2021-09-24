import React, { ReactElement } from 'react';
import { EditBillForm } from '../../components/edit-bill-form';
import { AsideMenu } from '../../components/template/aside-menu';

export const EditBillPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <EditBillForm />
  </main>
);
