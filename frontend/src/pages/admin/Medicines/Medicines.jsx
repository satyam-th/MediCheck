import { useState } from 'react';
import { Plus } from 'lucide-react';

import MedicineTable from '../../../components/admin/MedicineTable/MedicineTable';
import GlobalMedicineFormModal from '../../../components/admin/GlobalMedicineFormModal/GlobalMedicineFormModal';
import Modal from '../../../components/ui/Modal/Modal';

import styles from './Medicines.module.css'

const initialMedicines = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Painkiller', dateAdded: 'Jul 9, 2026' },
  { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotic', dateAdded: 'Jul 7, 2026' },
  { id: 3, name: 'Cetirizine 10mg', category: 'Antihistamine', dateAdded: 'Jul 5, 2026' },
  { id: 4, name: 'Insulin Glargine', category: 'Hormone', dateAdded: 'Jul 2, 2026' },
]

export default function Medicines() {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [deletingMedicine, setDeletingMedicine] = useState(null);

  function handleOpenAdd() {
    setEditingMedicine(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(medicine) {
    setEditingMedicine(medicine);
    setIsModalOpen(true);
  }

  function handleSubmit(medicineData) {
    if (editingMedicine) {
      // Edit mode -> replace the matching medicine
      setMedicines((prev) =>
        prev.map((m) => (m.id === medicineData.id ? medicineData : m))
      );
    } else {
      // Add mode -> add to the front
      setMedicines((prev) => [medicineData, ...prev]);
    }
    setIsModalOpen(false);
    setEditingMedicine(null);
  }

  function handleConfirmDelete() {
    setMedicines((prev) => prev.filter((m) => m.id !== deletingMedicine.id));
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
        <MedicineTable medicines={medicines} onEdit={handleOpenEdit} onDelete={setDeletingMedicine} />
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