import { useState, useEffect } from 'react';
import { UserCircle, Pencil, X, Check } from 'lucide-react';

import api from '../../../services/api';
import toast from 'react-hot-toast';

import styles from './Profile.module.css'

const roleLabels = {
  super_admin: 'Super Admin',
  worker_admin: 'Worker Admin',
  pharmacy: 'Pharmacy',
  customer: 'Customer',
};

export default function Profile() {
  const [adminData, setAdminData] = useState({ name: 'Admin User', email: '', role: 'Administrator' });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '' });

  useEffect(() => {
    api.get('/auth/me/')
      .then(({ data }) => {
        const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ') || data.username || data.email;
        setAdminData({
          id: data.id,
          name: fullName,
          email: data.email,
          phone: data.phone || '',
          role: roleLabels[data.role] || data.role || 'Administrator',
        });
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
        });
      })
      .catch(() => {
        // keep defaults on failure
      });
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    try {
      const res = await api.patch('/auth/me/', {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
      });
      const data = res.data;
      const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ') || data.username || data.email;
      setAdminData({
        id: data.id,
        name: fullName,
        email: data.email,
        phone: data.phone || '',
        role: roleLabels[data.role] || data.role || 'Administrator',
      });
      setEditing(false);
      toast.success('Profile updated');
    } catch {
      toast.error('Could not update profile');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>View your admin account details</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.topSection}>
          <UserCircle size={64} className={styles.avatar} />
          <span className={styles.name}>{adminData.name}</span>
          <button className={styles.editBtn} onClick={() => setEditing((v) => !v)}>
            {editing ? <X size={16} /> : <Pencil size={16} />}
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing ? (
          <div className={styles.details}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor='firstName'>First Name</label>
              <input id='firstName' name='first_name' className={styles.input} value={form.first_name} onChange={handleChange} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor='lastName'>Last Name</label>
              <input id='lastName' name='last_name' className={styles.input} value={form.last_name} onChange={handleChange} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor='phone'>Phone</label>
              <input id='phone' name='phone' className={styles.input} value={form.phone} onChange={handleChange} />
            </div>

            <div className={styles.saveRow}>
              <button className={styles.saveBtn} onClick={handleSave}>
                <Check size={16} /> Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.details}>
            <div className={styles.field}>
              <span className={styles.label}>Role</span>
              <span className={styles.value}>{adminData.role}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{adminData.email}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>{adminData.phone || '—'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
