import React, { ReactElement, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

import styles from './styles.module.scss';

type TopBarProps = {
  title: string;
  subtitle: string;
  addButton: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ title, subtitle, addButton }): ReactElement => {
  const { user, handleLogout } = useContext(AuthContext);

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
        <button className={styles.filters} type="button" onClick={() => console.log('TODO')}>
          <span>Filtros</span>
          <img src="/images/filters.png" alt="Filtros" />
        </button>
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
