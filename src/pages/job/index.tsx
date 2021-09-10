import React, { ReactElement } from 'react';
import { SingleJob } from '../../components/job';
import { AsideMenu } from '../../components/template/aside-menu';

export const JobPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <SingleJob />
  </main>
);
