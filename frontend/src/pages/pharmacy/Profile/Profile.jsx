import { Store } from 'lucide-react';

import styles from './Profile.module.css'

const pharmacyData = {
  pharmacyName: 'Chain Pharmacy',
  ownerName: 'Ram Sharma',
  email: 'chain@medicheck.com',
  contactNumber: '9812345678',
  licenseNumber: 'LIC-2024-0001',
  address: 'Basundhara, Kathmandu',
  openingTime: '6:00 AM',
  closingTime: '9:00 PM',
}

export default function Profile() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>View your pharmacy account details</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.topSection}>
          <Store size={64} className={styles.avatar} />
          <span className={styles.name}>{pharmacyData.pharmacyName}</span>
        </div>

        <div className={styles.details}>
          <div className={styles.field}>
            <span className={styles.label}>Owner Name</span>
            <span className={styles.value}>{pharmacyData.ownerName}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{pharmacyData.email}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Contact Number</span>
            <span className={styles.value}>{pharmacyData.contactNumber}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>License Number</span>
            <span className={styles.value}>{pharmacyData.licenseNumber}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Address</span>
            <span className={styles.value}>{pharmacyData.address}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Opening Time</span>
            <span className={styles.value}>{pharmacyData.openingTime}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Closing Time</span>
            <span className={styles.value}>{pharmacyData.closingTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}