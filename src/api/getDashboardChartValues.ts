import { get } from 'lodash';
import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';
import { DashboardValues } from '../types/dashboard-values.type';

export async function getDashboardChartValues(): Promise<DashboardValues[] | undefined> {
  try {
    const { data } = await api.get('/dashboard/chart', {
      withCredentials: true,
    });

    if (!data) return undefined;

    const dashboardChartValues: DashboardValues[] = [];

    data.forEach((montlyValues: any) => {
      dashboardChartValues.push({
        month: get(montlyValues, 'month', null),
        year: get(montlyValues, 'year', null),
        expectedPaymentsAmount: get(montlyValues, 'expectedPaymentsAmount', null),
        expectedBillsAmount: get(montlyValues, 'expectedBillsAmount', null),
        expectedProfitAmount:
          Number(get(montlyValues, 'expectedPaymentsAmount', null))
          - Number(get(montlyValues, 'expectedBillsAmount', null)),
      });
    });

    return dashboardChartValues;
  } catch (err: unknown) {
    catchBlock(err);
    return undefined;
  }
}
