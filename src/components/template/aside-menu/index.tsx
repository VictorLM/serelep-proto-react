import React, { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

export const AsideMenu: React.FC = (): ReactElement => {
  const [toggleAddMenu, setToggleAddMenu] = useState(false);

  return (
    <aside className={styles.aside}>
      <div>
        <Link to="/dashboard">
          <img className={styles.logo} src="/images/logo_white.png" alt="Logo" />
        </Link>
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

      <div className={styles.add_btn_dropdown}>

        <button
          className={styles.add_btn}
          type="button"
          onClick={() => setToggleAddMenu(!toggleAddMenu)}
        >
          <img src="/images/plus.png" alt="Dashboard" />
          Add
        </button>

        {toggleAddMenu && (
          <ol>
            <li>
              <Link to="/clientes/novo">Cliente</Link>
            </li>
            <hr />
            <li>
              <Link to="/jobs/novo">Job</Link>
            </li>
            <hr />
            <li>
              <Link to="/despesas/novo">Despesa</Link>
            </li>
          </ol>
        )}

      </div>

    </aside>
  );
};
