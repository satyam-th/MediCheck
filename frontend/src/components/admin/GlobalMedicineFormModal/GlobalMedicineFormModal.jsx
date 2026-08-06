import styles from './GlobalMedicineFormModal.module.css';
import { useState } from 'react';
import Modal from '../../ui/Modal/Modal';

const categories = ['Painkiller', 'Antibiotic', 'Antihistamine', 'Hormone', 'Other'];

export default function GlobalMedicineFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const [name, setName] = useState(initialData?.name || '');
    const [genericName, setGenericName] = useState(initialData?.generic_name || '');
    const [manufacturer, setManufacturer] = useState(initialData?.manufacturer || '');
    const [category, setCategory] = useState(initialData?.category || categories[0]);
    const [errors, setErrors] = useState({});

    function validate() {
        const newErrors = {};

        if (!name.trim()) newErrors.name = 'Medicine name is required';
        if (!category) newErrors.category = 'Category is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // true = no errors = valid
    }

    function handleCancel() {
        onClose();
    }

    function handleSubmit() {
        if (!validate()) return; // stop here if invalid, errors are now set
        onSubmit({
            name,
            generic_name: genericName,
            manufacturer,
            category,
        });
    }

    return (
        <Modal isOpen={isOpen} onClose={handleCancel} title={initialData ? 'Edit medicine' : 'Add medicine'}>
            <div className={styles.field}>
                <label htmlFor='name'>Medicine name</label>
                <input id='name' type="text" value={name} onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: '' })); }} />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
                <label htmlFor='genericName'>Generic name</label>
                <input id='genericName' type="text" value={genericName} onChange={(e) => setGenericName(e.target.value)} />
            </div>

            <div className={styles.field}>
                <label htmlFor='manufacturer'>Manufacturer</label>
                <input id='manufacturer' type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
            </div>

            <div className={styles.field}>
                <label htmlFor='category'>Category</label>
                <select id='category' value={category} onChange={(e) => { setCategory(e.target.value); setErrors((prev) => ({ ...prev, category: '' })); }}>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                {errors.category && <span className={styles.errorText}>{errors.category}</span>}
            </div>

            <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                <button className={styles.submitBtn} onClick={handleSubmit}>{initialData ? 'Update medicine' : 'Add medicine'}</button>
            </div>
        </Modal>
    );
}
