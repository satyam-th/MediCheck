import styles from './FormDivider.module.css';

export default function FormDivider({ text }) {
  return (
    <div className={styles.line}>
      <p className={styles.orLine}>{text}</p>
    </div>
  );
}