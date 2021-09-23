import React, { ReactElement } from 'react';
import { EditJobForm } from '../../components/edit-job-form';
import { AsideMenu } from '../../components/template/aside-menu';

export const EditJobPage: React.FC = (): ReactElement => (
  <main className="main">
    <AsideMenu />
    <EditJobForm />
  </main>
);
