import StatCard from '../../../components/ui/StatCard/StatCard'
import RecentSales from '../../../components/shared/RecentSales/RecentSales';
import AlertList from '../../../components/shared/AlertList/AlertList';
import Greeting from '../../../components/shared/Greeting/Greeting';

import styles from './Dashboard.module.css'

const dummySales = [
  { id: 1, medicine: 'Paracetamol 500mg', quantity: 2, amount: 40, time: '2:30 PM' },
  { id: 2, medicine: 'Amoxicillin 250mg', quantity: 1, amount: 85, time: '1:15 PM' },
  { id: 3, medicine: 'Cetirizine 10mg', quantity: 3, amount: 60, time: '11:50 AM' },
  { id: 4, medicine: 'Ibuprofen 400mg', quantity: 1, amount: 30, time: '11:10 AM' },
]

const dummyLowStock = [
  { id: 1, medicine: 'Paracetamol 500mg', quantity: 5, status: 'low' },
  { id: 2, medicine: 'Insulin Glargine', quantity: 0, status: 'out' },
  { id: 3, medicine: 'Amoxicillin 250mg', quantity: 8, status: 'low' },
]

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      {/* Greeting section */}
      <Greeting username='Pharmacist'/>

      {/* Section 1 — Inventory Overview */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Inventory Overview</h2>
        <div className={styles.statGrid}>
          <StatCard label="Total Medicines" value={142} color="blue" />
          <StatCard label="Low Stock" value={8} color="orange" />
          <StatCard label="Out of Stock" value={3} color="red" />
          <StatCard label="Expiring Soon" value={5} color="yellow" />
        </div>
      </section>

      {/* Section 2 — Sales Summary */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sales Summary</h2>
        <div className={styles.statGrid}>
          <StatCard label="Today's Sales" value={24} color="blue" />
          <StatCard label="Today's Revenue" value="Rs. 12,400" color="green" />
        </div>
      </section>

      {/* Section 3 — Activity */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Activity</h2>
        <div className={styles.activityGrid}>
          <RecentSales sales={dummySales} />
          <AlertList items={dummyLowStock} />
        </div>
      </section>

    </div>
  );
}