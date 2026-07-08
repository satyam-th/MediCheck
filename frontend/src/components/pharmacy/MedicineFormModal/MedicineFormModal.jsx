import styles from './MedicineFormModal.module.css';
import { useState, useEffect } from 'react';
import Modal from '../../ui/Modal/Modal';

export default function MedicineFormModal({isOpen, onClose, onSubmit, initialData}){
    const[medicineName, setMedicineName] = useState(initialData?.name || '');
    const [quantity, setQuantity] = useState(initialData?.quantity || '');
    const [mrp, setMrp] = useState(initialData?.mrp || '');
    const [batchno, setBatchno] = useState(initialData?.batchNo || '');
    const [expiryDate, setExpiryDate] = useState(initialData?.expiry || '');
    const[errors, setErrors] = useState({});

    useEffect(() => {
        console.log("useEffect:", initialData);
    if (initialData) {
        // Edit mode -> fill the form
        setMedicineName(initialData.name);
        setQuantity(initialData.quantity);
        setMrp(initialData.mrp);
        setBatchno(initialData.batchNo);
        setExpiryDate(initialData.expiry);
    } else {
        // Add mode -> clear the form
        setMedicineName('');
        setQuantity('');
        setMrp('');
        setBatchno('');
        setExpiryDate('');
    }

    // Clear old validation messages
    setErrors({});
}, [initialData]);

    function validate() {
        const newErrors = {};

        if (!medicineName.trim()) newErrors.medicineName = 'Medicine name is required';
        if (!quantity || Number(quantity) < 0) newErrors.quantity = 'Enter a valid quantity';
        if (!mrp || Number(mrp) <= 0) newErrors.mrp = 'Enter a valid MRP';
        if (!batchno.trim()) newErrors.batchno = 'Batch number is required';
        if (!expiryDate) newErrors.expiryDate = 'Expiry date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // true = no errors = valid
    }

    function handleCancel(){
        onClose();
    }

    function handleSubmit(){
        if (!validate()) return; // stop here if invalid, errors are now set
        onSubmit({
            id:initialData?.id ?? Date.now(),
            name: medicineName,
            quantity: Number(quantity),
            mrp: Number(mrp),
            batchNo: batchno,
            expiry: expiryDate,
        });
    }

    return(
        <Modal isOpen={isOpen} onClose={handleCancel} title={initialData ? 'Edit medicine' : 'Add medicine'}>
            <div className={styles.field}>
                <label htmlFor='medicineName'>Medicine name</label>
                <input id='medicineName' type="text" value={medicineName} onChange={(e)=>{ setMedicineName(e.target.value); setErrors((prev) => ({ ...prev, medicineName: '' }));}} />
                {errors.medicineName && <span className={styles.errorText}>{errors.medicineName}</span>}
            </div>

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