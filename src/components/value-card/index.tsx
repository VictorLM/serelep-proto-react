import React, { ReactElement } from 'react';

import styles from './styles.module.scss';

type ValueCard = {
  type?: 'payment' | 'bills' | 'profit';
  month?: number;
  year?: number;
  value?: number;
}

const valueCardDefaults: ValueCard = {
  type: 'payment',
  month: 0,
  year: 0,
  value: 0,
};

export const ValueCard: React.FC<ValueCard> = ({
  type, month, year, value,
}): ReactElement => {
  let title = '';
  let icon = '';
  let spanColor = null;

  if (type === 'payment') {
    title = 'Faturamento';
    icon = 'happy_money.png';
    spanColor = <span className={styles.yellow}>&#11044;</span>;
  } else if (type === 'bills') {
    title = 'Despesas';
    icon = 'sad_money.png';
    spanColor = <span className={styles.red}>&#11044;</span>;
  } else if (type === 'profit') {
    title = 'Previsão de Lucro';
    icon = 'evolution_arrow.png';
    spanColor = <span className={styles.green}>&#11044;</span>;
  }

  const date = year && month ? new Date(year, month) : new Date();
  const monthString = date.toLocaleString('pt-BR', { month: 'short' });

  return (
    <div className={`card card-white ${styles.value_card}`}>
      <div className={styles.top}>
        <img src={`/images/${icon}`} alt="" />
        {spanColor}
      </div>
      <p className={styles.title}>
        {`${title} / ${monthString} ${String(year).substr(2)}`}
      </p>
      <p className={Math.sign(value ?? 0) === -1 ? styles.value_negative : styles.value}>
        {`R$ ${value?.toFixed(2).replace('.', ',')}`}
      </p>
    </div>
  );
};

ValueCard.defaultProps = valueCardDefaults;
