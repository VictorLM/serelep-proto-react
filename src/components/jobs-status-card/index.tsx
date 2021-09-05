import React, { ReactElement } from 'react';
import { JobsByStatus } from '../../types/dashboard-jobs.type';

import styles from './styles.module.scss';

export type DashboardJobsByStatus = {
  month?: number;
  year?: number;
  jobsByStatus?: JobsByStatus;
}

const dashboardJobsByStatusDefaults: DashboardJobsByStatus = {
  month: 0,
  year: 0,
  jobsByStatus: undefined,
};

export const JobsStatusCard: React.FC<DashboardJobsByStatus> = ({
  month, year, jobsByStatus,
}): ReactElement => {
  const date = year && month ? new Date(year, month - 1) : new Date();
  const monthString = date.toLocaleString('pt-BR', { month: 'short' });

  return (
    <div className={`card card-black ${styles.jobs_status}`}>
      <p>
        Andamentos dos Jobs
        <span className="date">
          {` / ${monthString} ${String(year).substr(2)}`}
        </span>
      </p>

      <table>
        <tbody>
          <tr>
            <td>Em exec.</td>
            <td>{jobsByStatus?.OPEN}</td>
            <td><span className="yellow">&#11044;</span></td>
          </tr>
          <tr>
            <td>Concluído</td>
            <td>{jobsByStatus?.DONE}</td>
            <td><span className="green">&#11044;</span></td>
          </tr>
        </tbody>
      </table>

    </div>
  );
};

JobsStatusCard.defaultProps = dashboardJobsByStatusDefaults;
