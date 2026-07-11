import StatCard from '../../../components/ui/StatCard/StatCard'
import Greeting from '../../../components/shared/Greeting/Greeting';
import RecentPharmacies from '../../../components/shared/RecentPharmacies/RecentPharmacies';

import styles from './Dashboard.module.css';

const dummyPharmacies = [
  { id: 1, name: 'Sunrise Pharmacy', owner: 'Rajesh Shrestha', location: 'Kathmandu', dateAdded: 'Jul 8, 2026' },
  { id: 2, name: 'HealthPlus Pharmacy', owner: 'Sabina Gurung', location: 'Lalitpur', dateAdded: 'Jul 6, 2026' },
  { id: 3, name: 'City Care Pharmacy', owner: 'Bikash Thapa', location: 'Bhaktapur', dateAdded: 'Jul 3, 2026' },
  { id: 4, name: 'Green Cross Pharmacy', owner: 'Anita Rai', location: 'Kathmandu', dateAdded: 'Jun 30, 2026' },
]

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      {/* Greeting section */}
      <Greeting username='Admin'/>

      {/* Section 1 — Platform Overview */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Platform Overview</h2>
        <div className={styles.statGrid}>
          <StatCard label="Total Customers" value={0} color="blue" />
          <StatCard label="Total Pharmacies" value={0} color="green" />
          <StatCard label="Total Medicines" value={0} color="orange" />
        </div>
      </section>

      {/* Section 2 — Activity */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Activity</h2>
        <div className={styles.activityGrid}>
          <RecentPharmacies pharmacies={dummyPharmacies} />
        </div>
      </section>

      {/* Section 2 — Sales Summary */}
      {/* <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sales Summary</h2>
        <div className={styles.statGrid}>
          <StatCard label="Today's Sales" value={24} color="blue" />
          <StatCard label="Today's Revenue" value="Rs. 12,400" color="green" />
        </div>
      </section> */}

    </div>
  );
}