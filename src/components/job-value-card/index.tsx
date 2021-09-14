import React, { ReactElement } from 'react';

import styles from './styles.module.scss';

type ValueCard = {
  type?: 'payment' | 'bills' | 'profit' | 'portion';
  value?: number;
  times?: number;
}

const valueCardDefaults: ValueCard = {
  type: 'payment',
  value: 0,
  times: 1,
};

export const JobValueCard: React.FC<ValueCard> = ({
  type, value, times,
}): ReactElement => {
  let title = '';
  let icon = '';
  let spanColor = null;

  if (type === 'payment') {
    title = 'Valor total';
    icon = 'happy_money.png';
    spanColor = <span className="yellow">&#11044;</span>;
  } else if (type === 'bills') {
    title = 'Despesas variáveis';
    icon = 'sad_money.png';
    spanColor = <span className="red">&#11044;</span>;
  } else if (type === 'profit') {
    title = 'Valor líquido';
    icon = 'happy_money.png';
    spanColor = <span className="green">&#11044;</span>;
  } else if (type === 'portion') {
    title = `Valor parcela - ${times} x`;
    icon = 'happy_money.png';
    spanColor = <span className="yellow">&#11044;</span>;
  }

  return (
    <div className={`card card-white ${styles.value_card}`}>
      <div className={styles.top}>
        <img src={`/images/${icon}`} alt="" />
        {spanColor}
      </div>

      <p className={styles.title}>
        {title}
      </p>

      <p className={Math.sign(value ?? 0) === -1 ? styles.value_negative : styles.value}>
        {`R$ ${value?.toFixed(2).replace('.', ',')}`}
      </p>
    </div>
  );
};

JobValueCard.defaultProps = valueCardDefaults;
