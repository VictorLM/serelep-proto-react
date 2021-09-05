import React, { ReactElement, useEffect, useState } from 'react';
import { getDashboardJobs } from '../../api/getDashboardJobs';
import { DashboardValues, getDashboardValues } from '../../api/getDashboardValues';
import { DashboardJobs } from '../../types/dashboard-jobs.type';
import { JobsTypeCard } from '../jobs-type-card';
import { Loader } from '../loader';
import { TopBar } from '../template/top-bar';
import { ValueCard } from '../value-card';

import styles from './styles.module.scss';

export const Dashoboard: React.FC = (): ReactElement => {
  const [values, setValues] = useState<DashboardValues>();
  const [loadingValues, setLoadingValues] = useState(true);
  const [jobs, setJobs] = useState<DashboardJobs>();
  const [loadingJobs, setLoadingJobs] = useState(true);

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

  return (
    <section className={`main-section ${styles.section}`}>
      <div className="card card-light">

        <TopBar
          title="Dashboard"
          subtitle="Bem vindo ao controle financeiro =)"
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

          <div className={styles.chart}>
            CHART
          </div>

          {loadingJobs ? <Loader />
            : (
              <div className={styles.jobs}>
                <JobsTypeCard
                  month={jobs?.month}
                  year={jobs?.year}
                  jobsByType={jobs?.jobs?.byType}
                />
              </div>
            )}

        </div>

      </div>
    </section>
  );
};
