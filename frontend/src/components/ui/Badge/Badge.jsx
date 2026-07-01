import styles from './Badge.module.css';

// status options: 'ok' | 'low' | 'out' | 'info'
const LABELS = {
  ok: 'In stock',
  low: 'Low',
  out: 'Out',
  info: 'Info',
};

export default function Badge({ status, children }) {
  const text = children || LABELS[status] || status;

  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {text}
    </span>
  );
}