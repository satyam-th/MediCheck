import styles from './Pharmacy.module.css';

import PharmacyTable from '../../../components/admin/PharmacyTable/PharmacyTable';
import PharmacyFormModal from '../../../components/admin/PharmacyFormModal/PharmacyFormModal';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Check, X } from 'lucide-react';
import api from '../../../services/api';

const REQUEST_FIELD_LABELS = {
  owner_first_name: 'Owner First Name',
  owner_last_name: 'Owner Last Name',
  owner_phone: 'Owner Phone',
  license_number: 'License Number',
  pan_number: 'PAN Number',
};

export default function Pharmacy(){
    const[pharmacies, setPharmacies] = useState([]);
    const[loading, setLoading] = useState(true);
    const[isModalOpen, setIsModalOpen] = useState(false);
    const[requests, setRequests] = useState([]);
    const[requestsLoading, setRequestsLoading] = useState(true);

    useEffect(() => {
        async function fetchPharmacies() {
            try {
                const res = await api.get('/admin/pharmacies/');
                const data = res.data.results || res.data || [];
                setPharmacies(data.map((p) => ({
                    id: p.id,
                    name: p.name,
                    owner: p.owner_name || p.owner_email || 'Unknown',
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
        async function fetchRequests() {
            try {
                const res = await api.get('/admin/pharmacies/requests/');
                setRequests(res.data.results || res.data || []);
            } catch {
                setRequests([]);
            } finally {
                setRequestsLoading(false);
            }
        }
        fetchPharmacies();
        fetchRequests();
    }, []);

    async function handleAddPharmacy(formData) {
        try {
            const res = await api.post('/admin/pharmacies/', formData);
            setPharmacies((prev) => [{
                id: res.data.id,
                name: res.data.name,
                owner: res.data.owner_name || res.data.owner_email,
                location: res.data.address,
                dateAdded: new Date(res.data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: res.data.status,
            }, ...prev]);
            setIsModalOpen(false);
            toast.success('Pharmacy added successfully');
        } catch (err) {
            const ownerErr = err.response?.data?.owner_email;
            const emailErr = err.response?.data?.email;
            const msg = (Array.isArray(ownerErr) ? ownerErr[0] : ownerErr)
                || (Array.isArray(emailErr) ? emailErr[0] : emailErr)
                || 'Could not add pharmacy. Please try again.';
            toast.error(msg);
        }
    }

    async function handleStatusChange(pharmacyId, newStatus){
        const action = {
            active: 'approve',
            suspended: 'suspend',
            banned: 'ban',
        }[newStatus];

        if (!action) return;

        try {
            await api.patch(`/admin/pharmacies/${pharmacyId}/${action}/`);
            setPharmacies((prev) =>
                prev.map((pharmacy) =>
                    pharmacy.id === pharmacyId ? { ...pharmacy, status: newStatus } : pharmacy
                )
            );
            toast.success(`Pharmacy ${newStatus}`);
        } catch {
            toast.error('Could not update pharmacy status');
        }
    }

    async function handleReviewRequest(requestId, decision){
        try {
            await api.patch(`/admin/pharmacies/requests/${requestId}/${decision}/`);
            setRequests((prev) =>
                prev.map((r) => (r.id === requestId ? { ...r, status: decision } : r))
            );
            toast.success(`Request ${decision}`);
        } catch {
            toast.error('Could not update request');
        }
    }

    const pendingRequests = requests.filter((r) => r.status === 'pending');

    return(
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Pharmacies</h1>
          <p className={styles.subtitle}>View all pharmacies registered on the platform</p>
        </div>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Pharmacy
        </button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile Change Requests ({pendingRequests.length})</h2>
        {requestsLoading ? (
            <p className={styles.empty}>Loading requests...</p>
        ) : pendingRequests.length === 0 ? (
            <p className={styles.empty}>No pending change requests.</p>
        ) : (
            <div className={styles.requestList}>
                {pendingRequests.map((req) => (
                    <div className={styles.requestItem} key={req.id}>
                        <div className={styles.requestInfo}>
                            <span className={styles.requestPharmacy}>{req.pharmacy_name}</span>
                            <span className={styles.requestChanges}>
                                {Object.keys(req.requested_changes)
                                    .map((k) => `${REQUEST_FIELD_LABELS[k] || k}: ${req.requested_changes[k]}`)
                                    .join('  •  ')}
                            </span>
                            <span className={styles.requestMeta}>
                                Requested by {req.requested_by_name} ({req.requested_by_email}) on {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        <div className={styles.requestActions}>
                            <button className={styles.approveBtn} onClick={() => handleReviewRequest(req.id, 'approve')}>
                                <Check size={15} /> Approve
                            </button>
                            <button className={styles.rejectBtn} onClick={() => handleReviewRequest(req.id, 'reject')}>
                                <X size={15} /> Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
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

      <PharmacyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPharmacy}
      />
    </div>
    );
}
