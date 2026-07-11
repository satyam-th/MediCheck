import StatCard from '../../../components/ui/StatCard/StatCard'
import Greeting from '../../../components/shared/Greeting/Greeting';
import RecentPharmacies from '../../../components/shared/RecentPharmacies/RecentPharmacies';
import RecentMedicines from '../../../components/shared/RecentMedicines/RecentMedicines';

import styles from './Dashboard.module.css';

const dummyPharmacies = [
  { id: 1, name: 'Sunrise Pharmacy', owner: 'Rajesh Shrestha', location: 'Kathmandu', dateAdded: 'Jul 8, 2026' },
  { id: 2, name: 'HealthPlus Pharmacy', owner: 'Sabina Gurung', location: 'Lalitpur', dateAdded: 'Jul 6, 2026' },
  { id: 3, name: 'City Care Pharmacy', owner: 'Bikash Thapa', location: 'Bhaktapur', dateAdded: 'Jul 3, 2026' },
  { id: 4, name: 'Green Cross Pharmacy', owner: 'Anita Rai', location: 'Kathmandu', dateAdded: 'Jun 30, 2026' },
]

const dummyMedicines = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Painkiller', dateAdded: 'Jul 9, 2026' },
  { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotic', dateAdded: 'Jul 7, 2026' },
  { id: 3, name: 'Cetirizine 10mg', category: 'Antihistamine', dateAdded: 'Jul 5, 2026' },
  { id: 4, name: 'Insulin Glargine', category: 'Hormone', dateAdded: 'Jul 2, 2026' },
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
          <RecentMedicines medicines={dummyMedicines} />
        </div>
      </section>

    </div>
  );
}