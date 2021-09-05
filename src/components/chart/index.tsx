import React, {
  ReactElement, useEffect, useRef,
} from 'react';
import {
  Chart, registerables, ChartConfiguration, ChartOptions, ChartData,
} from 'chart.js';
import { DashboardValues } from '../../types/dashboard-values.type';

export type DashboardChartValues = {
  chartValues?: DashboardValues[],
}

const dashboardChartValuesDefaults: DashboardChartValues = {
  chartValues: [],
};

export const ValuesChart: React.FC<DashboardChartValues> = ({
  chartValues,
}): ReactElement => {
  // const [isRebuildingCanvas, setIsRebuildingCanvas] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const labels: string[] = [];
  const payments: number[] = [];
  const bills: number[] = [];
  const profit: number[] = [];

  chartValues?.forEach((montlyValues) => {
    // Labels
    const date = new Date(montlyValues.year, montlyValues.month - 1);
    const monthString = date.toLocaleString('pt-BR', { month: 'short' });
    labels.push(`${monthString} / ${String(montlyValues.year).substr(2)}`);
    // Values
    payments.push(montlyValues.expectedPaymentsAmount);
    bills.push(montlyValues.expectedBillsAmount);
    profit.push(montlyValues.expectedProfitAmount);
  });

  const data: ChartData = {
    labels: labels.reverse(),
    datasets: [
      {
        label: 'Despesas',
        borderColor: 'rgba(193, 12, 12, 1)',
        borderWidth: 1,
        backgroundColor: 'rgba(193, 12, 12, .1)',
        hoverBackgroundColor: 'rgba(193, 12, 12, 1)',
        borderRadius: 5,
        data: bills.reverse(),
        order: 4,
      },
      {
        label: 'Lucro',
        borderColor: 'rgba(116, 201, 106, 1)',
        borderWidth: 1,
        backgroundColor: 'rgba(116, 201, 106, .1)',
        hoverBackgroundColor: 'rgba(116, 201, 106, 1)',
        data: profit.reverse(),
        order: 3,
      },
      {
        label: 'Faturamento',
        borderColor: 'rgba(255, 189, 9, 1)',
        borderWidth: 1,
        backgroundColor: 'rgba(255, 189, 9, .1)',
        hoverBackgroundColor: 'rgba(255, 189, 9, .75)',
        data: payments.reverse(),
        order: 2,
      },
      {
        type: 'line',
        label: 'Evolução Lucro',
        backgroundColor: 'rgba(30, 30, 30, .75)',
        borderColor: 'rgba(30, 30, 30, .75)',
        tension: 0.1,
        pointRadius: 6,
        pointHoverRadius: 6,
        data: profit,
        order: 1,
      },
    ],
  };

  const options: ChartOptions = {
    scales: {
      yAxes: { stacked: true },
      xAxes: { stacked: true },
    },
  };

  const config: ChartConfiguration = {
    type: 'bar',
    data,
    options,
  };

  useEffect(() => {
    // TODO - Não está funcionando
    // if (isRebuildingCanvas) {
    //   return;
    // }
    Chart.register(...registerables);
    const chartCanvas = canvasRef.current;
    if (chartCanvas) {
      // TODO
      // eslint-disable-next-line
      const chart = new Chart(chartCanvas, config);
    }
  }, []);

  return (
    <canvas ref={canvasRef} />
  );
};

ValuesChart.defaultProps = dashboardChartValuesDefaults;
