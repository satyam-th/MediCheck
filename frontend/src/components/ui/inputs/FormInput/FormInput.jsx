import styles from './FormInput.module.css';

export default function FormInput({ label, type, id, name, placeholder, value, onChange, error, className }) {
  return (
    <div className={`${styles.fieldGroup} ${className || ''}`}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.input}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}