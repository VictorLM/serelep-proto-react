import React, { ReactElement } from 'react';
import { Bills } from '../../components/bills';
import { AsideMenu } from '../../components/template/aside-menu';

export const BillsPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <Bills />
  </main>
);
