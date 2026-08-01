import MedicineTable from '../../../components/admin/MedicineTable/MedicineTable';

import styles from './Medicines.module.css'

const dummyMedicines = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Painkiller', dateAdded: 'Jul 9, 2026' },
  { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotic', dateAdded: 'Jul 7, 2026' },
  { id: 3, name: 'Cetirizine 10mg', category: 'Antihistamine', dateAdded: 'Jul 5, 2026' },
  { id: 4, name: 'Insulin Glargine', category: 'Hormone', dateAdded: 'Jul 2, 2026' },
]

export default function Medicines() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Global Medicine</h1>
          <p className={styles.subtitle}>Manage the platform-wide medicine catalogue</p>
        </div>
      </div>

      <div className={styles.section}>
        <MedicineTable medicines={dummyMedicines} />
      </div>
    </div>
  );
}