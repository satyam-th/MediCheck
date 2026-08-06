import styles from './PharmacyFormModal.module.css';
import { useState } from 'react';
import Modal from '../../ui/Modal/Modal';

export default function PharmacyFormModal({ isOpen, onClose, onSubmit }) {
    const [form, setForm] = useState({
        name: '',
        owner_first_name: '',
        owner_last_name: '',
        owner_email: '',
        owner_password: '',
        owner_phone: '',
        contact_number: '',
        address: '',
        license_number: '',
        pan_number: '',
        open_time: '',
        close_time: '',
    });
    const [errors, setErrors] = useState({});

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    function validate() {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Pharmacy name is required';
        if (!form.owner_first_name.trim()) newErrors.owner_first_name = 'Owner name is required';
        if (!form.owner_email.trim()) newErrors.owner_email = 'Owner email is required';
        else if (!/\S+@\S+\.\S+/.test(form.owner_email)) newErrors.owner_email = 'Enter a valid email';
        if (!form.owner_password || form.owner_password.length < 8) newErrors.owner_password = 'Password must be at least 8 characters';
        if (!form.contact_number.trim()) newErrors.contact_number = 'Contact number is required';
        if (!form.address.trim()) newErrors.address = 'Address is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit() {
        if (!validate()) return;
        onSubmit({
            ...form,
            owner_phone: form.owner_phone || form.contact_number,
        });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add pharmacy">
            <div className={styles.field}>
                <label htmlFor='phName'>Pharmacy name *</label>
                <input id='phName' name='name' type="text" value={form.name} onChange={handleChange} />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label htmlFor='ownerFirst'>Owner first name *</label>
                    <input id='ownerFirst' name='owner_first_name' type="text" value={form.owner_first_name} onChange={handleChange} />
                    {errors.owner_first_name && <span className={styles.errorText}>{errors.owner_first_name}</span>}
                </div>
                <div className={styles.field}>
                    <label htmlFor='ownerLast'>Owner last name</label>
                    <input id='ownerLast' name='owner_last_name' type="text" value={form.owner_last_name} onChange={handleChange} />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label htmlFor='ownerEmail'>Owner email *</label>
                    <input id='ownerEmail' name='owner_email' type="email" value={form.owner_email} onChange={handleChange} />
                    {errors.owner_email && <span className={styles.errorText}>{errors.owner_email}</span>}
                </div>
                <div className={styles.field}>
                    <label htmlFor='ownerPassword'>Login password *</label>
                    <input id='ownerPassword' name='owner_password' type="password" value={form.owner_password} onChange={handleChange} />
                    {errors.owner_password && <span className={styles.errorText}>{errors.owner_password}</span>}
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label htmlFor='ownerPhone'>Owner phone</label>
                    <input id='ownerPhone' name='owner_phone' type="text" value={form.owner_phone} onChange={handleChange} />
                </div>
                <div className={styles.field}>
                    <label htmlFor='contact'>Contact number *</label>
                    <input id='contact' name='contact_number' type="text" value={form.contact_number} onChange={handleChange} />
                    {errors.contact_number && <span className={styles.errorText}>{errors.contact_number}</span>}
                </div>
            </div>

            <div className={styles.field}>
                <label htmlFor='address'>Address *</label>
                <input id='address' name='address' type="text" value={form.address} onChange={handleChange} />
                {errors.address && <span className={styles.errorText}>{errors.address}</span>}
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label htmlFor='license'>License number</label>
                    <input id='license' name='license_number' type="text" value={form.license_number} onChange={handleChange} />
                </div>
                <div className={styles.field}>
                    <label htmlFor='pan'>PAN number</label>
                    <input id='pan' name='pan_number' type="text" value={form.pan_number} onChange={handleChange} />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label htmlFor='openTime'>Opening time</label>
                    <input id='openTime' name='open_time' type="time" value={form.open_time} onChange={handleChange} />
                </div>
                <div className={styles.field}>
                    <label htmlFor='closeTime'>Closing time</label>
                    <input id='closeTime' name='close_time' type="time" value={form.close_time} onChange={handleChange} />
                </div>
            </div>

            <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                <button className={styles.submitBtn} onClick={handleSubmit}>Add pharmacy</button>
            </div>
        </Modal>
    );
}
