import styles from './Pharmacy.module.css';

import PharmacyTable from '../../../components/admin/PharmacyTable/PharmacyTable';

import { useState } from 'react';

const initialPharmacies = [
  { id: 1, name: 'Sunrise Pharmacy', owner: 'Rajesh Shrestha', location: 'Kathmandu', dateAdded: 'Jul 8, 2026', status: 'active' },
  { id: 2, name: 'HealthPlus Pharmacy', owner: 'Sabina Gurung', location: 'Lalitpur', dateAdded: 'Jul 6, 2026', status: 'suspended' },
  { id: 3, name: 'City Care Pharmacy', owner: 'Bikash Thapa', location: 'Bhaktapur', dateAdded: 'Jul 3, 2026', status: 'active' },
  { id: 4, name: 'Green Cross Pharmacy', owner: 'Anita Rai', location: 'Kathmandu', dateAdded: 'Jun 30, 2026', status: 'banned' },
]

export default function Pharmacy(){
    const[pharmacies, setPharmacies] = useState(initialPharmacies)

    function handleStatusChange(pharmacyId, newStatus){
        setPharmacies((prevPharmacies)=>
            prevPharmacies.map((pharmacy)=>
            pharmacy.id === pharmacyId ? {...pharmacy, status: newStatus} : pharmacy)
        );
    }
    return(
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Pharmacies</h1>
          <p className={styles.subtitle}>View all pharmacies registered on the platform</p>
        </div>
      </div>

      <div className={styles.section}>
        <PharmacyTable pharmacies={pharmacies} onStatusChange={handleStatusChange} />
      </div>
    </div>
    );
}