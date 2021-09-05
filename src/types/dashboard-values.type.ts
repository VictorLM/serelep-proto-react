export type MontlyValues = {
  month: number;
  year: number;
  expectedPaymentsAmount: number;
  expectedBillsAmount: number;
};

export type DashboardValues = MontlyValues & {
  expectedProfitAmount: number;
};
