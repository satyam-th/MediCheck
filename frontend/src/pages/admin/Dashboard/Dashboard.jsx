import StatCard from '../../../components/ui/StatCard/StatCard'
import Greeting from '../../../components/shared/Greeting/Greeting';

import styles from './Dashboard.module.css';

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

      {/* Section 2 — Sales Summary */}
      {/* <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sales Summary</h2>
        <div className={styles.statGrid}>
          <StatCard label="Today's Sales" value={24} color="blue" />
          <StatCard label="Today's Revenue" value="Rs. 12,400" color="green" />
        </div>
      </section> */}

      {/* Section 3 — Activity */}
      {/* <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Activity</h2>
        <div className={styles.activityGrid}>
          <RecentSales sales={dummySales} />
          <AlertList items={dummyLowStock} />
        </div>
      </section> */}

    </div>
  );
}