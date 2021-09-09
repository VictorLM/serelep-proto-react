import React, {
  ReactElement, useEffect, useRef, useState,
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [chart, setChart] = useState<Chart | null>(null);

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
        type: 'line',
        label: 'Evolução Lucro',
        backgroundColor: 'rgba(30, 30, 30, 1)',
        borderColor: 'rgba(30, 30, 30, 1)',
        tension: 0.2,
        // pointRadius: 5,
        // pointHoverRadius: 5,
        data: profit,
        order: 1,
      },
      {
        label: 'Despesas',
        // borderColor: 'rgba(193, 12, 12, 1)',
        borderWidth: 1,
        backgroundColor: '#B5B5B5',
        hoverBackgroundColor: 'rgba(193, 12, 12, 1)',
        // borderRadius: 5,
        data: bills.reverse(),
        order: 2,
      },
      {
        label: 'Lucro',
        // borderColor: 'rgba(116, 201, 106, 1)',
        borderWidth: 1,
        backgroundColor: '#828282',
        hoverBackgroundColor: 'rgba(116, 201, 106, 1)',
        data: profit.reverse(),
        order: 3,
      },
      {
        label: 'Faturamento',
        // borderColor: 'rgba(255, 189, 9, 1)',
        borderWidth: 1,
        backgroundColor: '#4A494A',
        hoverBackgroundColor: 'rgba(255, 189, 9, .75)',
        data: payments.reverse(),
        order: 4,
      },
    ],
  };

  const options: ChartOptions = {
    scales: {
      // yAxes: { stacked: true },
      // xAxes: { stacked: true },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label(context) {
            let label = context.dataset.label || '';

            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  };

  const config: ChartConfiguration = {
    type: 'bar',
    data,
    options,
  };

  // eslint-disable-next-line
  useEffect(() => {
    if (chart) {
      chart.destroy();
    } else {
      Chart.register(...registerables);
    }
    const chartCanvas = canvasRef.current;
    if (chartCanvas) {
      const chartjs = new Chart(chartCanvas, config);
      setChart(chartjs);
    }
    // TODO
    // eslint-disable-next-line
  }, []);

  return (
    <canvas ref={canvasRef} />
  );
};

ValuesChart.defaultProps = dashboardChartValuesDefaults;
