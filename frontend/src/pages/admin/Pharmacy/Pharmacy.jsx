import styles from './Pharmacy.module.css';

import PharmacyTable from '../../../components/admin/PharmacyTable/PharmacyTable';

import { useState, useEffect } from 'react';
import api from '../../../services/api';

export default function Pharmacy(){
    const[pharmacies, setPharmacies] = useState([]);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPharmacies() {
            try {
                const res = await api.get('/admin/pharmacies/');
                const data = res.data.results || res.data || [];
                setPharmacies(data.map((p) => ({
                    id: p.id,
                    name: p.name,
                    owner: p.owner_email || 'Unknown',
                    location: p.address,
                    dateAdded: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: p.status,
                })));
            } catch {
                setPharmacies([]);
            } finally {
                setLoading(false);
            }
        }
        fetchPharmacies();
    }, []);

    async function handleStatusChange(pharmacyId, newStatus){
        const action = newStatus === 'active' ? 'approve' : newStatus;
        try {
            await api.patch(`/admin/pharmacies/${pharmacyId}/${action}/`);
            setPharmacies((prev) =>
                prev.map((pharmacy) =>
                    pharmacy.id === pharmacyId ? { ...pharmacy, status: newStatus } : pharmacy
                )
            );
        } catch {
            // silently fail — keep old status
        }
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
        {loading ? (
            <p className={styles.empty}>Loading pharmacies...</p>
        ) : pharmacies.length === 0 ? (
            <p className={styles.empty}>No pharmacies registered yet.</p>
        ) : (
            <PharmacyTable pharmacies={pharmacies} onStatusChange={handleStatusChange} />
        )}
      </div>
    </div>
    );
}
