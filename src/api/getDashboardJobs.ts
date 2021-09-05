import { get } from 'lodash';
import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';
import { DashboardJobs } from '../types/dashboard-jobs.type';

export async function getDashboardJobs(): Promise<DashboardJobs | undefined> {
  try {
    const { data } = await api.get('/dashboard/jobs', {
      withCredentials: true,
    });

    const dashboardJobs: DashboardJobs = {
      month: get(data, 'month', null),
      year: get(data, 'year', null),
      jobs: get(data, 'jobs', null),
    };

    return dashboardJobs;
  } catch (err: unknown) {
    catchBlock(err);
    return undefined;
  }
}
