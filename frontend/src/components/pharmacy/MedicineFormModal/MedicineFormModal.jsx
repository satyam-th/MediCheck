import styles from './MedicineFormModal.module.css';
import { useState, useEffect } from 'react';
import Modal from '../../ui/Modal/Modal';
import api from '../../../services/api';

export default function MedicineFormModal({isOpen, onClose, onSubmit, initialData}){
    const[medicineId, setMedicineId] = useState(initialData?.medicine || '');
    const[isAddingNew, setIsAddingNew] = useState(false);
    const[newMedicineName, setNewMedicineName] = useState('');
    const[newGenericName, setNewGenericName] = useState('');
    const[newCategory, setNewCategory] = useState('');
    const [quantity, setQuantity] = useState(initialData?.quantity || '');
    const [mrp, setMrp] = useState(initialData?.mrp || '');
    const [batchno, setBatchno] = useState(initialData?.batch_number || '');
    const [expiryDate, setExpiryDate] = useState(initialData?.expiry_date || '');
    const[errors, setErrors] = useState({});
    const[medicineList, setMedicineList] = useState([]);
    const[searchQuery, setSearchQuery] = useState('');
    const[searching, setSearching] = useState(false);

    useEffect(() => {
        if (initialData) {
            setMedicineId(initialData.medicine || '');
            setIsAddingNew(false);
            setNewMedicineName('');
            setNewGenericName('');
            setNewCategory('');
            setQuantity(initialData.quantity || '');
            setMrp(initialData.mrp || '');
            setBatchno(initialData.batch_number || '');
            setExpiryDate(initialData.expiry_date || '');
        } else {
            setMedicineId('');
            setIsAddingNew(false);
            setNewMedicineName('');
            setNewGenericName('');
            setNewCategory('');
            setQuantity('');
            setMrp('');
            setBatchno('');
            setExpiryDate('');
        }
        setErrors({});
    }, [initialData]);

    useEffect(() => {
        if (!isOpen) return;

        async function fetchMedicines() {
            setSearching(true);
            try {
                const params = searchQuery.length >= 2 ? { q: searchQuery } : {};
                const res = await api.get('/pharmacy/catalog/', { params });
                setMedicineList(res.data.results || res.data || []);
            } catch {
                setMedicineList([]);
            } finally {
                setSearching(false);
            }
        }

        const timer = setTimeout(fetchMedicines, 300);
        return () => clearTimeout(timer);
    }, [isOpen, searchQuery]);

    function validate() {
        const newErrors = {};

        if (!isAddingNew && !medicineId) newErrors.medicine = 'Please select a medicine';
        if (isAddingNew && !newMedicineName.trim()) newErrors.newMedicine = 'Medicine name is required';
        if (!quantity || Number(quantity) < 0) newErrors.quantity = 'Enter a valid quantity';
        if (!mrp || Number(mrp) <= 0) newErrors.mrp = 'Enter a valid MRP';
        if (!batchno.trim()) newErrors.batchno = 'Batch number is required';
        if (!expiryDate) newErrors.expiryDate = 'Expiry date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleCancel(){
        onClose();
    }

    function handleSubmit(){
        if (!validate()) return;

        const payload = {
            id: initialData?.id ?? null,
            quantity: Number(quantity),
            mrp: Number(mrp),
            batch_number: batchno,
            expiry_date: expiryDate,
        };

        if (isAddingNew) {
            payload.new_medicine_name = newMedicineName;
            payload.new_generic_name = newGenericName;
            payload.new_category = newCategory;
        } else {
            payload.medicine = Number(medicineId);
        }

        onSubmit(payload);
    }

    return(
        <Modal isOpen={isOpen} onClose={handleCancel} title={initialData ? 'Edit medicine' : 'Add medicine'}>
            {!initialData && (
                <div className={styles.modeToggle}>
                    <button
                        className={!isAddingNew ? styles.modeBtnActive : styles.modeBtn}
                        onClick={() => { setIsAddingNew(false); setErrors((prev) => ({ ...prev, medicine: '', newMedicine: '' })); }}
                    >
                        Select Existing
                    </button>
                    <button
                        className={isAddingNew ? styles.modeBtnActive : styles.modeBtn}
                        onClick={() => { setIsAddingNew(true); setMedicineId(''); setErrors((prev) => ({ ...prev, medicine: '', newMedicine: '' })); }}
                    >
                        Add New Medicine
                    </button>
                </div>
            )}

            {isAddingNew ? (
                <>
                    <div className={styles.field}>
                        <label htmlFor='newMedicineName'>Medicine Name *</label>
                        <input
                            id='newMedicineName'
                            type="text"
                            placeholder="e.g. Paracetamol 500mg"
                            value={newMedicineName}
                            onChange={(e) => { setNewMedicineName(e.target.value); setErrors((prev) => ({ ...prev, newMedicine: '' })); }}
                        />
                        {errors.newMedicine && <span className={styles.errorText}>{errors.newMedicine}</span>}
                    </div>

                    <div className={styles.field}>
                        <label htmlFor='newGenericName'>Generic Name</label>
                        <input
                            id='newGenericName'
                            type="text"
                            placeholder="e.g. Acetaminophen"
                            value={newGenericName}
                            onChange={(e) => setNewGenericName(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor='newCategory'>Category</label>
                        <input
                            id='newCategory'
                            type="text"
                            placeholder="e.g. Analgesic"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.field}>
                        <label htmlFor='medicineSearch'>Search Medicine</label>
                        <input
                            id='medicineSearch'
                            type="text"
                            placeholder="Type to search medicines..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setErrors((prev) => ({ ...prev, medicine: '' })); }}
                        />
                        {errors.medicine && <span className={styles.errorText}>{errors.medicine}</span>}
                    </div>

                    <div className={styles.field}>
                        <label htmlFor='medicineSelect'>Select Medicine</label>
                        <select
                            id='medicineSelect'
                            value={medicineId}
                            onChange={(e) => setMedicineId(e.target.value)}
                            disabled={searching}
                        >
                            <option value="">
                                {searching ? 'Searching...' : medicineList.length === 0 ? 'No medicines found' : '-- Select a medicine --'}
                            </option>
                            {medicineList.map((med) => (
                                <option key={med.id} value={med.id}>
                                    {med.name} {med.generic_name ? `(${med.generic_name})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            <div className={styles.field}>
                <label htmlFor='quantity'>Quantity</label>
                <input id='quantity' type="number" value={quantity} onChange={(e) =>{ setQuantity(e.target.value); setErrors((prev) => ({ ...prev, quantity: '' }));}} />
                {errors.quantity && <span className={styles.errorText}>{errors.quantity}</span>}
            </div>

            <div className={styles.field}>
                <label htmlFor='mrp'>MRP</label>
                <input id='mrp' type="number" value={mrp} onChange={(e) =>{ setMrp(e.target.value); setErrors((prev) => ({ ...prev, mrp: '' }));}} />
                {errors.mrp && <span className={styles.errorText}>{errors.mrp}</span>}
            </div>

            <div className={styles.field}>
                <label htmlFor='batchno'>Batch number</label>
                <input id='batchno' type="text" value={batchno} onChange={(e) => {setBatchno(e.target.value); setErrors((prev) => ({ ...prev, batchno: '' }));}} />
                {errors.batchno && <span className={styles.errorText}>{errors.batchno}</span>}
            </div>

            <div className={styles.field}>
                <label htmlFor='expiryDate'>Expiry date</label>
                <input id='expiryDate' type="date" value={expiryDate} onChange={(e) =>{ setExpiryDate(e.target.value); setErrors((prev) => ({ ...prev, expiryDate: '' }));}} />
                {errors.expiryDate && <span className={styles.errorText}>{errors.expiryDate}</span>}
            </div>

            <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                <button className={styles.submitBtn} onClick={handleSubmit}>{initialData ? 'Update medicine' : 'Add medicine'}</button>
            </div>
        </Modal>
    );
}
