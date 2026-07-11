import styles from './Medicines.module.css';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

import InventoryTable from '../../../components/pharmacy/InventoryTable/InventoryTable';
import MedicineFormModal from '../../../components/pharmacy/MedicineFormModal/MedicineFormModal';
import Modal from '../../../components/ui/Modal/Modal';
import api from '../../../services/api';

export default function Medicine(){
  const[inventory, setInventory] = useState([]);
  const[isModalOpen, setIsModalOpen] = useState(false);
  const[editingItem, setEditingItem] = useState(null);
  const[confirmingDelete, setConfirmingDelete] = useState(null);
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      const res = await api.get('/pharmacy/inventory/');
      setInventory(res.data.results || res.data || []);
    } catch {
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmDelete(){
    try {
      await api.delete(`/pharmacy/inventory/${confirmingDelete.id}/`);
      setInventory((prev) => prev.filter((med) => med.id !== confirmingDelete.id));
    } catch {
      // silently fail
    }
    setConfirmingDelete(null);
  }

  function handleCancel(){
    setIsModalOpen(false);
    setEditingItem(null);
  }

  async function handleFormSubmit(formData) {
    try {
      if (editingItem) {
        const res = await api.patch(`/pharmacy/inventory/${editingItem.id}/`, formData);
        setInventory((prev) => prev.map((med) => (med.id === res.data.id ? res.data : med)));
      } else {
        const res = await api.post('/pharmacy/inventory/', formData);
        setInventory((prev) => [...prev, res.data]);
      }
    } catch {
      // silently fail
    }
    setIsModalOpen(false);
    setEditingItem(null);
  }

  function handleDeleteClick(item){
    setConfirmingDelete(item);
  }

    return(
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Medicines</h1>
          <p className={styles.subtitle}>
            {inventory.length} item{inventory.length !== 1 ? 's' : ''} in your inventory
          </p>
        </div>
      </div>

      <div className={styles.actionBar}>
        <button className={styles.addBtn} onClick={() => { setEditingItem(null); setIsModalOpen(true);}}>
          <Plus size={16} /> Add Medicine
        </button>
      </div>      
        
        <MedicineFormModal 
        isOpen={isModalOpen}
        onClose={()=> {setIsModalOpen(false); setEditingItem(null);}}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
      />

      {/* delete confirmation modal */}
      <Modal isOpen={!!confirmingDelete} onClose={()=> setConfirmingDelete(null)} title="Delete medicine?">
        <p>Are you sure you want to delete <strong>{confirmingDelete?.medicine_name}</strong>? This can't be undone.</p>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={() => setConfirmingDelete(null)}>Cancel</button>
          <button className={styles.dangerBtn} onClick={handleConfirmDelete}>Delete</button>
        </div>
      </Modal>

      <section>
        {loading ? (
          <div className={styles.emptyState}>
              <p>Loading inventory...</p>
          </div>
        ) : inventory.length === 0 ? (
          <div className={styles.emptyState}>
              <p>No medicines in your inventory yet.</p>
              <p>Click <strong>Add Medicine</strong> to get started.</p>
          </div>
        ):(
          <InventoryTable items={inventory} 
          onEdit={(item)=> {setEditingItem(item); setIsModalOpen(true);}} 
          onDelete={handleDeleteClick}/>
        )}
      </section>
    </div>
    );
}
