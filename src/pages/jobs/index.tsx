import React, { ReactElement } from 'react';
import { Jobs } from '../../components/jobs';
import { AsideMenu } from '../../components/template/aside-menu';

export const JobsPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <Jobs />
  </main>
);
