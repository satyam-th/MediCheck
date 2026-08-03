import { UserCircle } from 'lucide-react';

import styles from './Profile.module.css'

const adminData = {
  name: 'Admin User',
  email: 'admin@medicheck.com',
  role: 'Administrator',
}

export default function Profile() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>View your admin account details</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.topSection}>
          <UserCircle size={64} className={styles.avatar} />
          <span className={styles.name}>{adminData.name}</span>
        </div>

        <div className={styles.details}>
          <div className={styles.field}>
            <span className={styles.label}>Role</span>
            <span className={styles.value}>{adminData.role}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{adminData.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}