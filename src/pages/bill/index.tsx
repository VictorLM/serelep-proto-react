import React, { ReactElement } from 'react';
import { SingleBill } from '../../components/bill';
import { AsideMenu } from '../../components/template/aside-menu';

export const BillPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <SingleBill />
  </main>
);
