import styles from './Medicines.module.css';
import { useState } from 'react';
import { Plus } from 'lucide-react';

import InventoryTable from '../../../components/pharmacy/InventoryTable/InventoryTable';
import MedicineFormModal from '../../../components/pharmacy/MedicineFormModal/MedicineFormModal';

const medicineInventory = [];

export default function Medicine(){
  const[inventory, setInventory] = useState(medicineInventory);
  const[isModalOpen, setIsModalOpen] = useState(false);
  const[editingItem, setEditingItem] = useState(null); // null = Add mode, object = Edit mode

  function handleDelete(item){
    setInventory((prev)=> prev.filter((med)=> med.id !== item.id) )
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
      <section>
        <InventoryTable items={inventory} 
        onEdit={(item)=> {setEditingItem(item); setIsModalOpen(true);}} 
        onDelete={handleDelete}/>
      </section>
    </div>
    );
}