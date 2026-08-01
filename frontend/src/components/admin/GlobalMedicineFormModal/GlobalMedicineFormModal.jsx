import styles from './GlobalMedicineFormModal.module.css';
import { useState, useEffect } from 'react';
import Modal from '../../ui/Modal/Modal';

const categories = ['Painkiller', 'Antibiotic', 'Antihistamine', 'Hormone', 'Other'];

export default function GlobalMedicineFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const [name, setName] = useState(initialData?.name || '');
    const [category, setCategory] = useState(initialData?.category || categories[0]);
    const [description, setDescription] = useState(initialData?.description || '');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            // Edit mode -> fill the form
            setName(initialData.name);
            setCategory(initialData.category);
            setDescription(initialData.description || '');
        } else {
            // Add mode -> clear the form
            setName('');
            setCategory(categories[0]);
            setDescription('');
        }

        // Clear old validation messages
        setErrors({});
    }, [initialData]);

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
            id: initialData?.id ?? Date.now(),
            name,
            category,
            description,
            dateAdded: initialData?.dateAdded ?? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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
                <label htmlFor='category'>Category</label>
                <select id='category' value={category} onChange={(e) => { setCategory(e.target.value); setErrors((prev) => ({ ...prev, category: '' })); }}>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                {errors.category && <span className={styles.errorText}>{errors.category}</span>}
            </div>

            <div className={styles.field}>
                <label htmlFor='description'>Description (optional)</label>
                <textarea id='description' rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                <button className={styles.submitBtn} onClick={handleSubmit}>{initialData ? 'Update medicine' : 'Add medicine'}</button>
            </div>
        </Modal>
    );
}