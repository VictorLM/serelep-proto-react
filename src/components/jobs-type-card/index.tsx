import React, { ReactElement } from 'react';
import { JobsByType } from '../../types/dashboard-jobs.type';

import styles from './styles.module.scss';

export type DashboardJobsByType = {
  month?: number;
  year?: number;
  jobsByType?: JobsByType;
}

const dashboardJobsByTypeDefaults: DashboardJobsByType = {
  month: 0,
  year: 0,
  jobsByType: undefined,
};

export const JobsTypeCard: React.FC<DashboardJobsByType> = ({
  month, year, jobsByType,
}): ReactElement => {
  const date = year && month ? new Date(year, month - 1) : new Date();
  const monthString = date.toLocaleString('pt-BR', { month: 'short' });

  return (
    <div className={`card card-black ${styles.jobs_card}`}>
      <p>
        Jobs
        <span className="date">
          {` / ${monthString} ${String(year).substr(2)}`}
        </span>
      </p>

      <table>
        <thead>
          <tr>
            <th>Naming</th>
            <th>Marca</th>
            <th>IDV</th>
            <th>Embalagem</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{jobsByType?.NAMING}</td>
            <td>{jobsByType?.BRAND_DESIGN}</td>
            <td>{jobsByType?.VISUAL_IDENTITY}</td>
            <td>{jobsByType?.PACKAGING_DESIGN}</td>
          </tr>
        </tbody>
      </table>

    </div>
  );
};

JobsTypeCard.defaultProps = dashboardJobsByTypeDefaults;
