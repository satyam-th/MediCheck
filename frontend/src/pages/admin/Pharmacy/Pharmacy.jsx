import styles from './Pharmacy.module.css';

import PharmacyTable from '../../../components/admin/PharmacyTable/PharmacyTable';

const dummyPharmacies = [
  { id: 1, name: 'Sunrise Pharmacy', owner: 'Rajesh Shrestha', location: 'Kathmandu', dateAdded: 'Jul 8, 2026' },
  { id: 2, name: 'HealthPlus Pharmacy', owner: 'Sabina Gurung', location: 'Lalitpur', dateAdded: 'Jul 6, 2026' },
  { id: 3, name: 'City Care Pharmacy', owner: 'Bikash Thapa', location: 'Bhaktapur', dateAdded: 'Jul 3, 2026' },
  { id: 4, name: 'Green Cross Pharmacy', owner: 'Anita Rai', location: 'Kathmandu', dateAdded: 'Jun 30, 2026' },
]

export default function Pharmacy(){
    return(
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Pharmacies</h1>
          <p className={styles.subtitle}>View all pharmacies registered on the platform</p>
        </div>
      </div>

      <div className={styles.section}>
        <PharmacyTable pharmacies={dummyPharmacies} />
      </div>
    </div>
    );
}