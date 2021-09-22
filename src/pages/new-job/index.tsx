import React, { ReactElement } from 'react';
import { NewJobForm } from '../../components/new-job-form';
import { AsideMenu } from '../../components/template/aside-menu';

export const NewJobPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <NewJobForm />
  </main>
);
