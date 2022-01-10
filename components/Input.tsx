import styles from '../styles/Input.module.scss';

const Input = ({ name, label, type, value, onChange, error, onBlur }) => {

  return (
     <div className={styles.input}>
        <label htmlFor={name}>{label}</label>
        {type === 'textarea' ? <textarea id={name} name={name} rows={5} value={value} onChange={onChange} onBlur={onBlur} /> :
        <input className={error ? styles.error : ''} type={type} id={name} value={value} onChange={onChange} onBlur={onBlur} />}

        {error && <p>{error}</p>}
      </div>
  )
}

export default Input
