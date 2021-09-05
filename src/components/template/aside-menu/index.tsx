import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

export const AsideMenu: React.FC = (): ReactElement => (
  <aside className={styles.aside}>
    <div>

      <img className={styles.logo} src="/images/logo_white.png" alt="Logo" />
      <nav>
        <Link to="/dashboard">
          <img src="/images/dashboard.png" alt="Dashboard" />
          Dashboard
        </Link>
        <Link to="/clientes">
          <img src="/images/customers.png" alt="Dashboard" />
          Clientes
        </Link>
        <Link to="/jobs">
          <img src="/images/jobs.png" alt="Dashboard" />
          Jobs
        </Link>
        <Link to="/pagamentos">
          <img src="/images/happy_money.png" alt="Dashboard" />
          Pagamentos
        </Link>
        <Link to="/despesas">
          <img src="/images/sad_money.png" alt="Dashboard" />
          Despesas
        </Link>
      </nav>

    </div>

    <button className={styles.add_btn} type="button">
      <img src="/images/plus.png" alt="Dashboard" />
      Add
    </button>

  </aside>
);
