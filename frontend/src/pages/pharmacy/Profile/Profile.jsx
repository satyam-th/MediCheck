import { useState, useEffect } from 'react';
import { Store, Pencil, X, Check } from 'lucide-react';

import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

import styles from './Profile.module.css'

export default function Profile() {
  const { user } = useAuth();
  const [pharmacyData, setPharmacyData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/pharmacy/profile/');
        setPharmacyData(res.data);
        setForm({
          name: res.data.name || '',
          contact_number: res.data.contact_number || '',
          address: res.data.address || '',
          license_number: res.data.license_number || '',
          open_time: (res.data.open_time || '').slice(0, 5),
          close_time: (res.data.close_time || '').slice(0, 5),
          low_stock_threshold: res.data.low_stock_threshold ?? '',
        });
      } catch {
        setPharmacyData(null);
      }
    }
    fetchProfile();
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    try {
      const res = await api.patch('/pharmacy/profile/', {
        name: form.name,
        contact_number: form.contact_number,
        address: form.address,
        license_number: form.license_number,
        open_time: form.open_time ? `${form.open_time}:00` : null,
        close_time: form.close_time ? `${form.close_time}:00` : null,
        low_stock_threshold: form.low_stock_threshold,
      });
      setPharmacyData(res.data);
      setEditing(false);
    } catch {
      // silently fail
    }
  }

  const ownerName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'Owner';

  if (!pharmacyData) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>View your pharmacy account details</p>
        </div>
        <div className={styles.card}>
          <p className={styles.value}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>View your pharmacy account details</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.topSection}>
          <Store size={64} className={styles.avatar} />
          <div className={styles.nameBlock}>
            <span className={styles.name}>{pharmacyData.name}</span>
            <span className={styles.status}>{pharmacyData.status}</span>
          </div>
          <button className={styles.editBtn} onClick={() => setEditing((v) => !v)}>
            {editing ? <X size={16} /> : <Pencil size={16} />}
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing ? (
          <div className={styles.details}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor='name'>Pharmacy Name</label>
              <input id='name' name='name' className={styles.input} value={form.name} onChange={handleChange} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor='contact'>Contact Number</label>
              <input id='contact' name='contact_number' className={styles.input} value={form.contact_number} onChange={handleChange} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor='address'>Address</label>
              <input id='address' name='address' className={styles.input} value={form.address} onChange={handleChange} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor='license'>License Number</label>
              <input id='license' name='license_number' className={styles.input} value={form.license_number} onChange={handleChange} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor='openTime'>Opening Time</label>
              <input id='openTime' name='open_time' type='time' className={styles.input} value={form.open_time} onChange={handleChange} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor='closeTime'>Closing Time</label>
              <input id='closeTime' name='close_time' type='time' className={styles.input} value={form.close_time} onChange={handleChange} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor='threshold'>Low Stock Threshold</label>
              <input id='threshold' name='low_stock_threshold' type='number' className={styles.input} value={form.low_stock_threshold} onChange={handleChange} />
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
              <span className={styles.label}>Owner Name</span>
              <span className={styles.value}>{ownerName}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Owner Email</span>
              <span className={styles.value}>{pharmacyData.owner_email}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Contact Number</span>
              <span className={styles.value}>{pharmacyData.contact_number}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>License Number</span>
              <span className={styles.value}>{pharmacyData.license_number}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Address</span>
              <span className={styles.value}>{pharmacyData.address}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Opening Time</span>
              <span className={styles.value}>{pharmacyData.open_time || '—'}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Closing Time</span>
              <span className={styles.value}>{pharmacyData.close_time || '—'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
