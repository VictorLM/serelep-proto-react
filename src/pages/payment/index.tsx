import React, { ReactElement } from 'react';
import { SinglePayment } from '../../components/payment';
import { AsideMenu } from '../../components/template/aside-menu';

export const PaymentPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <SinglePayment />
  </main>
);
