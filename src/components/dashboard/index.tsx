import React, { ReactElement, useEffect, useState } from 'react';
import { getDashboardChartValues, getDashboardJobs, getDashboardValues } from '../../api/dashboard';
import { DashboardJobs } from '../../types/dashboard-jobs.type';
import { DashboardValues } from '../../types/dashboard-values.type';
import { ValuesChart } from '../chart';
import { JobsStatusCard } from '../jobs-status-card';
import { JobsTypeCard } from '../jobs-type-card';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';
import { ValueCard } from '../value-card';

import styles from './styles.module.scss';

export const Dashboard: React.FC = (): ReactElement => {
  const [values, setValues] = useState<DashboardValues>();
  const [loadingValues, setLoadingValues] = useState(true);
  const [jobs, setJobs] = useState<DashboardJobs>();
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [chartValues, setChartValues] = useState<DashboardValues[]>();
  const [loadingChartValues, setLoadingChartValues] = useState(true);

  useEffect(() => {
    (async () => {
      const foundValues = await getDashboardValues();
      setValues(foundValues);
      setLoadingValues(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const foundJobs = await getDashboardJobs();
      setJobs(foundJobs);
      setLoadingJobs(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const foundChartValues = await getDashboardChartValues();
      setChartValues(foundChartValues);
      setLoadingChartValues(false);
    })();
  }, []);

  return (
    <section className={`main-section ${styles.section}`}>
      <div className="card card-light">

        <TopBar
          title="Dashboard"
          subtitle="Bem vindo ao controle financeiro =)"
          addButton={false}
        />

        {loadingValues ? <Loader />
          : (
            <div className={styles.values}>
              <ValueCard
                type="payment"
                month={values?.month}
                year={values?.year}
                value={values?.expectedPaymentsAmount}
              />

              <ValueCard
                type="bills"
                month={values?.month}
                year={values?.year}
                value={values?.expectedBillsAmount}
              />

              <ValueCard
                type="profit"
                month={values?.month}
                year={values?.year}
                value={values?.expectedProfitAmount}
              />
            </div>
          )}

        <div className={styles.jobs_chart}>
          {/* <ValuesChart /> */}
          <div className={styles.chart}>
            {loadingChartValues ? <Loader /> : (
              <ValuesChart
                chartValues={chartValues}
              />
            ) }
          </div>

          {loadingJobs ? <Loader />
            : (
              <div className={styles.jobs}>
                <JobsTypeCard
                  month={jobs?.month}
                  year={jobs?.year}
                  jobsByType={jobs?.jobs?.byType}
                />

                <JobsStatusCard
                  month={jobs?.month}
                  year={jobs?.year}
                  jobsByStatus={jobs?.jobs?.byStatus}
                />
              </div>
            )}

        </div>

      </div>
      <Footer />
    </section>
  );
};
