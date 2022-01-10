import React from 'react'

import type { NextPage } from 'next'
import DateField from '../components/DateField';
import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
  const [date, setDate] = React.useState('');
  const [anotherDate, setAnotherDate] = React.useState('');

  return (
    <div className={styles.main}>
      <div className={styles.dateContainer}>
        <DateField value={date} setValue={setDate} />
        <p>{date ? `Você escolheu a data ${date}` : 'Escolha uma data, se quiser'}</p>
      </div>
      <div className={styles.dateContainer}>
        <DateField value={anotherDate} setValue={setAnotherDate} />
        <p>{anotherDate ? `Você escolheu a data ${anotherDate}` : 'Escolha uma data, se quiser'}</p>
      </div>
    </div>
  )
}

export default Home
