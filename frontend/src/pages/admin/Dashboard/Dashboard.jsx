import { useState, useEffect } from 'react';
import StatCard from '../../../components/ui/StatCard/StatCard'
import Greeting from '../../../components/shared/Greeting/Greeting';
import RecentPharmacies from '../../../components/shared/RecentPharmacies/RecentPharmacies';
import RecentMedicines from '../../../components/shared/RecentMedicines/RecentMedicines';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ customers: 0, pharmacies: 0, medicines: 0 });
  const [pharmacies, setPharmacies] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, pharmaciesRes, medicinesRes, pendingRes] = await Promise.all([
          api.get('/admin/stats/'),
          api.get('/admin/pharmacies/'),
          api.get('/admin/catalog/'),
          api.get('/admin/catalog/', { params: { approval_status: 'pending' } }),
        ]);

        setStats({
          customers: statsRes.data.total_customers,
          pharmacies: statsRes.data.total_pharmacies,
          medicines: statsRes.data.total_medicines,
        });

        const pharmacyData = (pharmaciesRes.data.results || pharmaciesRes.data || [])
          .slice(0, 5)
          .map(p => ({
            id: p.id,
            name: p.name,
            owner: p.owner_email,
            location: p.address,
            dateAdded: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          }));
        setPharmacies(pharmacyData);

        const medicineData = (medicinesRes.data.results || medicinesRes.data || [])
          .slice(0, 5)
          .map(m => ({
            id: m.id,
            name: m.name,
            category: m.category || 'General',
            dateAdded: new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          }));
        setMedicines(medicineData);

        const pendingData = (pendingRes.data.results || pendingRes.data || [])
          .map(m => ({
            id: m.id,
            name: m.name,
            category: m.category || 'General',
            submittedBy: m.submitted_by_email || 'Unknown',
            dateAdded: new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          }));
        setPendingRequests(pendingData);
      } catch {
        // silently fail — show zeros
      }
    }
    fetchData();
  }, []);

  async function handleApprove(medicineId) {
    try {
      await api.patch(`/admin/catalog/${medicineId}/approve/`);
      setPendingRequests(prev => prev.filter(m => m.id !== medicineId));
      setStats(prev => ({ ...prev, medicines: prev.medicines + 1 }));
    } catch {
      // silently fail
    }
  }

  async function handleReject(medicineId) {
    try {
      await api.patch(`/admin/catalog/${medicineId}/reject/`);
      setPendingRequests(prev => prev.filter(m => m.id !== medicineId));
    } catch {
      // silently fail
    }
  }

  const name = user?.first_name || user?.username || 'Admin';

  return (
    <div className={styles.dashboard}>
      {/* Greeting section */}
      <Greeting username={name} />

      {/* Section 1 — Platform Overview */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Platform Overview</h2>
        <div className={styles.statGrid}>
          <StatCard label="Total Customers" value={stats.customers} color="blue" />
          <StatCard label="Total Pharmacies" value={stats.pharmacies} color="green" />
          <StatCard label="Total Medicines" value={stats.medicines} color="orange" />
        </div>
      </section>

      {/* Section 2 — Activity */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Activity</h2>
        <div className={styles.activityGrid}>
          <RecentPharmacies pharmacies={pharmacies} />
          <RecentMedicines medicines={medicines} />
        </div>
      </section>

      {/* Section 3 — Pending Medicine Requests */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pending Medicine Requests ({pendingRequests.length})</h2>
        <div className={styles.pendingList}>
          {pendingRequests.length === 0 ? (
            <p className={styles.emptyText}>No pending requests</p>
          ) : (
            pendingRequests.map((med) => (
              <div key={med.id} className={styles.pendingItem}>
                <div className={styles.pendingInfo}>
                  <span className={styles.pendingName}>{med.name}</span>
                  <span className={styles.pendingMeta}>
                    {med.category} | Requested by {med.submittedBy} | {med.dateAdded}
                  </span>
                </div>
                <div className={styles.pendingActions}>
                  <button className={styles.approveBtn} onClick={() => handleApprove(med.id)}>Approve</button>
                  <button className={styles.rejectBtn} onClick={() => handleReject(med.id)}>Reject</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
