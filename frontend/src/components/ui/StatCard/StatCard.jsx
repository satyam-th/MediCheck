import styles from './StatCard.module.css';

export default function StatCard({ label, value, color = 'blue' }) {
  return (
    <div className={styles.card}>
      <div className={`${styles.accent} ${styles[`bg-${color}`]}`} />
      <p className={styles.label}>{label}</p>
      <p className={`${styles.value} ${styles[`text-${color}`]}`}>{value}</p>
    </div>
  );
}