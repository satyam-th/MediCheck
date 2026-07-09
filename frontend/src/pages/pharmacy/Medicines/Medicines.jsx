import styles from './Medicines.module.css';
import { useState } from 'react';
import { Plus } from 'lucide-react';

import InventoryTable from '../../../components/pharmacy/InventoryTable/InventoryTable';
import MedicineFormModal from '../../../components/pharmacy/MedicineFormModal/MedicineFormModal';
import Modal from '../../../components/ui/Modal/Modal';

const medicineInventory = [];

export default function Medicine(){
  const[inventory, setInventory] = useState(medicineInventory);
  const[isModalOpen, setIsModalOpen] = useState(false);
  const[editingItem, setEditingItem] = useState(null); // null = Add mode, object = Edit mode
  const[confirmingDelete, setConfirmingDelete] = useState(null);

  function handleConfirmDelete(){
    setInventory((prev)=> prev.filter((med)=> med.id !== confirmingDelete.id) );
    setConfirmingDelete(null);
  }

  function handleCancel(){
    setIsModalOpen(false);
    setEditingItem(null);
  }

  function handleFormSubmit(formData) {
    if(editingItem){
      setInventory((prev) => prev.map((med)=> (med.id === formData.id ? formData : med)));
    }else{
      setInventory((prev)=> [...prev, formData])
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

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
        <p>Are you sure you want to delete <strong>{confirmingDelete?.name}</strong>? This can't be undone.</p>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={() => setConfirmingDelete(null)}>Cancel</button>
          <button className={styles.dangerBtn} onClick={handleConfirmDelete}>Delete</button>
        </div>
      </Modal>

      <section>
        <InventoryTable items={inventory} 
        onEdit={(item)=> {setEditingItem(item); setIsModalOpen(true);}} 
        onDelete={handleDeleteClick}/>
      </section>
    </div>
    );
}