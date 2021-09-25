import { get } from 'lodash';
import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';
import { DashboardValues } from '../types/dashboard-values.type';
import { DashboardJobs } from '../types/dashboard-jobs.type';

type MontlyValuesApi = {
  month: number;
  year: number;
  expectedPaymentsAmount: number;
  expectedBillsAmount: number;
};

export async function getDashboardChartValues(): Promise<DashboardValues[] | undefined> {
  try {
    const { data } = await api.get('/dashboard/chart', {
      withCredentials: true,
    });

    if (!data) return undefined;

    const dashboardChartValues: DashboardValues[] = [];

    data.forEach((montlyValues: MontlyValuesApi) => {
      dashboardChartValues.push({
        month: get(montlyValues, 'month', 0),
        year: get(montlyValues, 'year', 0),
        expectedPaymentsAmount: get(montlyValues, 'expectedPaymentsAmount', 0),
        expectedBillsAmount: get(montlyValues, 'expectedBillsAmount', 0),
        expectedProfitAmount:
          Number(get(montlyValues, 'expectedPaymentsAmount', 0))
          - Number(get(montlyValues, 'expectedBillsAmount', 0)),
      });
    });

    return dashboardChartValues;
  } catch (err: unknown) {
    catchBlock(err);
    return undefined;
  }
}

export async function getDashboardJobs(
  month?: number, year?: number,
): Promise<DashboardJobs | undefined> {
  try {
    const { data } = await api.get('/dashboard/jobs', {
      withCredentials: true,
      params: {
        month: month || null,
        year: year || null,
      },
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

export async function getDashboardValues(
  month?: number, year?: number,
): Promise<DashboardValues | undefined> {
  try {
    const { data } = await api.get('/dashboard/values', {
      withCredentials: true,
      params: {
        month: month || null,
        year: year || null,
      },
    });

    const dashboardValues: DashboardValues = {
      month: get(data, 'month', null),
      year: get(data, 'year', null),
      expectedPaymentsAmount: get(data, 'expectedPaymentsAmount', null),
      expectedBillsAmount: get(data, 'expectedBillsAmount', null),
      expectedProfitAmount:
        Number(get(data, 'expectedPaymentsAmount', null))
        - Number(get(data, 'expectedBillsAmount', null)),
    };

    return dashboardValues;
  } catch (err: unknown) {
    catchBlock(err);
    return undefined;
  }
}
