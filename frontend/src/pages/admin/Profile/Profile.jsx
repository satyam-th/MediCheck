import { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';

import api from '../../../services/api';

import styles from './Profile.module.css'

const roleLabels = {
  super_admin: 'Super Admin',
  worker_admin: 'Worker Admin',
  pharmacy: 'Pharmacy',
  customer: 'Customer',
};

export default function Profile() {
  const [adminData, setAdminData] = useState({ name: 'Admin User', email: '', role: 'Administrator' });

  useEffect(() => {
    api.get('/auth/me/')
      .then(({ data }) => {
        const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ') || data.username || data.email;
        setAdminData({
          name: fullName,
          email: data.email,
          role: roleLabels[data.role] || data.role || 'Administrator',
        });
      })
      .catch(() => {
        // keep defaults on failure
      });
  }, []);

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
