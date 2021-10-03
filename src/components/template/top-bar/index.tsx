import React, { ReactElement, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { DashboardFilters } from '../../dashboard';

import styles from './styles.module.scss';

type TopBarProps = {
  title: string;
  subtitle: string;
  addButton: boolean;
  // eslint-disable-next-line
  dashboardFilters?: DashboardFilters;
  // eslint-disable-next-line
  setDashboardFilters?: React.Dispatch<React.SetStateAction<DashboardFilters>>;
}

export const TopBar: React.FC<TopBarProps> = ({
  title, subtitle, addButton, dashboardFilters, setDashboardFilters,
}): ReactElement => {
  const { user, handleLogout } = useContext(AuthContext);
  const [month, setMonth] = useState(String(dashboardFilters?.month));
  const [year, setYear] = useState(String(dashboardFilters?.year));
  const [toggleFilters, setToggleFilters] = useState(false);

  function handleSetDashboardFilters(): void {
    if (setDashboardFilters) {
      setDashboardFilters({ month: Number(month), year: Number(year) });
      setToggleFilters(false);
    }
  }

  return (
    <header className={styles.header}>
      <div className="title-subtitle">
        <h1>
          &#9656;
          {title}
          {addButton && (
            <Link to={`/${title.toLowerCase()}/novo`}>
              <img src="/images/plus.png" alt="Adicionar" />
              Adicionar
            </Link>
          )}
        </h1>
        <small>{subtitle}</small>
      </div>

      {title === 'Dashboard' && (
        <>
          <button
            className={styles.filters_btn}
            type="button"
            onClick={() => setToggleFilters(true)}
          >
            <span>Filtros</span>
            <img src="/images/filters.png" alt="Filtros" />
          </button>

          {toggleFilters && (

            <div className={styles.filters}>

              <div className={`card card-white ${styles.filters_content}`}>

                <button
                  className={styles.close}
                  type="button"
                  onClick={() => setToggleFilters(false)}
                >
                  &times;
                </button>

                <div className={`card card-white ${styles.filters_content_content}`}>

                  <div className={styles.selects}>

                    <label htmlFor="month">
                      <span>Mês</span>
                      <select
                        name="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        <option disabled>Mês</option>
                        <option value="1">Janeiro</option>
                        <option value="2">Fevereiro</option>
                        <option value="3">Março</option>
                        <option value="4">Abril</option>
                        <option value="5">Maio</option>
                        <option value="6">Junho</option>
                        <option value="7">Julho</option>
                        <option value="8">Agosto</option>
                        <option value="9">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                      </select>
                    </label>

                    <label htmlFor="month">
                      <span>Ano</span>
                      <select
                        name="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option disabled>Ano</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                      </select>
                    </label>

                  </div>

                  <button
                    className={styles.filters_btn}
                    type="button"
                    onClick={() => handleSetDashboardFilters()}
                  >
                    <span>Filtrar</span>
                  </button>

                </div>

              </div>

            </div>
          )}

        </>
      )}

      <div className={styles.user}>
        <img src="/images/user.png" alt="Foto usuário" />
        <div>
          <p>{user ? `${user.name}` : 'Nome do usuário'}</p>
          <button type="button" onClick={() => handleLogout()}>Sair</button>
        </div>
      </div>
    </header>
  );
};
