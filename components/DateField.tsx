import React from 'react';

import useDateForm from '../hooks/useDateForm';
import styles from '../styles/Date.module.scss';
import Input from './Input';

interface DateFieldProps {
  label: string,
  value: string;
  setValue: (v: string) => void,
  defaultDate?: Date,
}

const DateField = (props: DateFieldProps) => {
  const { defaultDate, value, setValue, label } = props;
  const date = useDateForm(value, setValue, defaultDate);
  const [showBox, setShowBox] = React.useState(false);
  const [margins, setMargins] = React.useState(['-350px', '0', '350px']);
  const [rotateClass, setRotateClass] = React.useState('');
  const [transition, setTransition] = React.useState({ transition: '0.4s' });

    function useOutsideAlerter(ref) {
      React.useEffect(() => {
          function handleClickOutside(event) {
              if (ref.current && !ref.current.contains(event.target)) {
                  setShowBox(false);
              }
          }

          document.addEventListener("mousedown", handleClickOutside);
          return () => {
              document.removeEventListener("mousedown", handleClickOutside);
          };
      }, [ref]);
  	}

  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef);

   const goToMonth = (next: boolean) => {
    setMargins(next ? ['-350px', '-350px', '0'] : ['0', '350px', '350px']);
    setTimeout(() => {
      setTransition({  transition: '0s' });
      next ? date.goToNextMonth() : date.goToPreviousMonth();
      setMargins(['-350px', '0', '350px']);
    }, 400);

    setTimeout(() => {
      setTransition({  transition: '0.4s' });
    }, 410);
  }

  const goToYear = (next: boolean) => {
    setRotateClass(styles.rotate);
    setTimeout(() => {
      next ? date.goToNextYear() : date.goToPreviousYear();
      setRotateClass('');
    }, 300);
  }

  return (
    <div ref={wrapperRef} className={styles.date}>
      <Input type="text" name="txtDate" label={label} value={value} onChange={date.onChange} error={null} onBlur={date.onBlur} />
      <button className={styles.showButton} onClick={() => setShowBox(!showBox)}>{showBox ? '⬆' : '⬇' }</button>
      <div className={`${styles.outbox} ${showBox ? '' : styles.hidden }`}>
        <button className={styles.monthBtn} onClick={() => goToMonth(false)}>{'<'}</button>
         <div className={styles.canvas}>
            <div className={styles.mainContainer}>
          {date.dateProps.map((month, i) => <div key={i} style={{ left: margins[i], ...transition }} className={`${styles.container} ${i === 1 ? rotateClass : ''}`}>
            <div className={styles.month}>
              <button className={styles.yearBtn} onClick={() => goToYear(false)}>{'<<'}</button>
              <p>{`${month.month} ${date.currentYear !== month.year ? month.year : ''}`}</p>
              <button className={styles.yearBtn} onClick={() => goToYear(true)}>{'>>'}</button>
            </div>
            {month.weekDays.map((d, i) => <p className={styles.week} key={i}>{d}</p>)}
            {month.voidDays.map((_, i) => <div key={i}></div>)}
            {month.days.map(d => <button key={d.day} className={`${styles.day} ${d.selected ? styles.selected : ''}`} value={d.day} onClick={() => { date.setNewDate(d.day); setShowBox(false); }}>{d.day}</button>)}
          </div>)}
        </div>
         </div>
        <button className={styles.monthBtn} onClick={() => goToMonth(true)}>{'>'}</button>
      </div>
    </div>
  )
}

export default DateField
