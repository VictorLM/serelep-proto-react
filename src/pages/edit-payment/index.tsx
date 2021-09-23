import React, { ReactElement } from 'react';
import { EditPaymentForm } from '../../components/edit-payment-form';
import { AsideMenu } from '../../components/template/aside-menu';

export const EditPaymentPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <EditPaymentForm />
  </main>
);
