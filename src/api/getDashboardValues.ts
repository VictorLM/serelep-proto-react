import { get } from 'lodash';
import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';

export type DashboardValues = {
  month: number;
  year: number;
  expectedPaymentsAmount: number;
  expectedBillsAmount: number;
  expectedProfitAmount: number;
};

export async function getDashboardValues(): Promise<DashboardValues | undefined> {
  try {
    const { data } = await api.get('/dashboard/values', {
      withCredentials: true,
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
