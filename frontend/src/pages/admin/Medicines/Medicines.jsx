import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

import MedicineTable from '../../../components/admin/MedicineTable/MedicineTable';
import GlobalMedicineFormModal from '../../../components/admin/GlobalMedicineFormModal/GlobalMedicineFormModal';
import Modal from '../../../components/ui/Modal/Modal';

import api from '../../../services/api';

import styles from './Medicines.module.css'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [deletingMedicine, setDeletingMedicine] = useState(null);

  useEffect(() => {
    async function fetchMedicines() {
      try {
        const res = await api.get('/admin/catalog/');
        const data = res.data.results || res.data || [];
        setMedicines(data.map((m) => ({ ...m, dateAdded: formatDate(m.created_at) })));
      } catch {
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMedicines();
  }, []);

  function handleOpenAdd() {
    setEditingMedicine(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(medicine) {
    setEditingMedicine(medicine);
    setIsModalOpen(true);
  }

  async function handleSubmit(medicineData) {
    try {
      if (editingMedicine) {
        const res = await api.patch(`/admin/catalog/${editingMedicine.id}/`, medicineData);
        setMedicines((prev) => prev.map((m) => (m.id === res.data.id ? { ...res.data, dateAdded: m.dateAdded } : m)));
      } else {
        const res = await api.post('/admin/catalog/', medicineData);
        setMedicines((prev) => [{ ...res.data, dateAdded: formatDate(res.data.created_at) }, ...prev]);
      }
    } catch {
      return;
    }
    setIsModalOpen(false);
    setEditingMedicine(null);
  }

  async function handleConfirmDelete() {
    try {
      await api.delete(`/admin/catalog/${deletingMedicine.id}/`);
      setMedicines((prev) => prev.filter((m) => m.id !== deletingMedicine.id));
    } catch {
      return;
    }
    setDeletingMedicine(null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Global Medicine</h1>
          <p className={styles.subtitle}>Manage the platform-wide medicine catalogue</p>
        </div>
        <button className={styles.addBtn} onClick={handleOpenAdd}>
          <Plus size={16} /> Add Medicine
        </button>
      </div>

      <div className={styles.section}>
        {loading ? (
          <p className={styles.empty}>Loading medicines...</p>
        ) : medicines.length === 0 ? (
          <p className={styles.empty}>No medicines in the catalogue yet.</p>
        ) : (
          <MedicineTable medicines={medicines} onEdit={handleOpenEdit} onDelete={setDeletingMedicine} />
        )}
      </div>

      <GlobalMedicineFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingMedicine}
      />

      <Modal isOpen={!!deletingMedicine} onClose={() => setDeletingMedicine(null)} title="Remove medicine">
        <p className={styles.confirmText}>
          Are you sure you want to remove <strong>{deletingMedicine?.name}</strong> from the catalogue? This cannot be undone.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={() => setDeletingMedicine(null)}>Cancel</button>
          <button className={styles.dangerBtn} onClick={handleConfirmDelete}>Remove</button>
        </div>
      </Modal>
    </div>
  );
}
