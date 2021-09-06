import { get } from 'lodash';
import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';
import { DashboardValues } from '../types/dashboard-values.type';

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
