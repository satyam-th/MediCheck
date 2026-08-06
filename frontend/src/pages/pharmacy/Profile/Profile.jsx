import { useState, useEffect } from 'react';
import { Store, Pencil, X, Check, Send, Clock } from 'lucide-react';

import api from '../../../services/api';
import toast from 'react-hot-toast';

import styles from './Profile.module.css'

const REQUEST_FIELD_LABELS = {
  owner_first_name: 'Owner First Name',
  owner_last_name: 'Owner Last Name',
  owner_phone: 'Owner Phone',
  license_number: 'License Number',
  pan_number: 'PAN Number',
};

export default function Profile() {
  const [pharmacyData, setPharmacyData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [requestForm, setRequestForm] = useState({});
  const [requests, setRequests] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/pharmacy/profile/');
        setPharmacyData(res.data);
        setForm({
          name: res.data.name || '',
          contact_number: res.data.contact_number || '',
          address: res.data.address || '',
          open_time: (res.data.open_time || '').slice(0, 5),
          close_time: (res.data.close_time || '').slice(0, 5),
        });
        setRequestForm({
          owner_first_name: res.data.owner_first_name || '',
          owner_last_name: res.data.owner_last_name || '',
          owner_phone: res.data.owner_phone || '',
          license_number: res.data.license_number || '',
          pan_number: res.data.pan_number || '',
        });
      } catch {
        setPharmacyData(null);
      }
    }
    async function fetchRequests() {
      try {
        const res = await api.get('/pharmacy/profile/change-requests/');
        setRequests(res.data.results || res.data || []);
      } catch {
        setRequests([]);
      }
    }
    fetchProfile();
    fetchRequests();
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleRequestChange(e) {
    setRequestForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    try {
      const res = await api.patch('/pharmacy/profile/', {
        name: form.name,
        contact_number: form.contact_number,
        address: form.address,
        open_time: form.open_time ? `${form.open_time}:00` : null,
        close_time: form.close_time ? `${form.close_time}:00` : null,
      });
      setPharmacyData(res.data);
      setEditing(false);
      toast.success('Profile updated');
    } catch {
      toast.error('Could not update profile');
    }
  }

  async function handleSubmitRequest() {
    const requested_changes = {};
    Object.keys(REQUEST_FIELD_LABELS).forEach((key) => {
      const val = (requestForm[key] || '').toString().trim();
      if (val && val !== String(pharmacyData[key] ?? '')) {
        requested_changes[key] = val;
      }
    });

    if (Object.keys(requested_changes).length === 0) {
      toast.error('No changes to request.');
      return;
    }

    setSending(true);
    try {
      const res = await api.post('/pharmacy/profile/change-requests/', { requested_changes });
      setRequests((prev) => [res.data, ...prev]);
      toast.success('Change request sent to admin');
    } catch (err) {
      toast.error(err.response?.data?.requested_changes?.[0] || 'Could not send request');
    } finally {
      setSending(false);
    }
  }

  function formatChanges(changes) {
    return Object.keys(changes)
      .map((key) => `${REQUEST_FIELD_LABELS[key] || key}: ${changes[key]}`)
      .join(', ');
  }

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
              <label className={styles.label} htmlFor='openTime'>Opening Time</label>
              <input id='openTime' name='open_time' type='time' className={styles.input} value={form.open_time} onChange={handleChange} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor='closeTime'>Closing Time</label>
              <input id='closeTime' name='close_time' type='time' className={styles.input} value={form.close_time} onChange={handleChange} />
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
              <span className={styles.value}>{pharmacyData.owner_name}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Owner Email</span>
              <span className={styles.value}>{pharmacyData.owner_email}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Owner Phone</span>
              <span className={styles.value}>{pharmacyData.owner_phone || '—'}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Contact Number</span>
              <span className={styles.value}>{pharmacyData.contact_number}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>License Number</span>
              <span className={styles.value}>{pharmacyData.license_number || '—'}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>PAN Number</span>
              <span className={styles.value}>{pharmacyData.pan_number || '—'}</span>
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

      <div className={`${styles.card} ${styles.requestCard}`}>
        <div className={styles.requestHeader}>
          <div>
            <h2 className={styles.requestTitle}>Request Owner / License / PAN Change</h2>
            <p className={styles.requestSubtitle}>
              Owner name, license and PAN updates require admin approval before they take effect.
            </p>
          </div>
        </div>

        <div className={styles.requestGrid}>
          {Object.keys(REQUEST_FIELD_LABELS).map((key) => (
            <div className={styles.field} key={key}>
              <label className={styles.label} htmlFor={`req-${key}`}>{REQUEST_FIELD_LABELS[key]}</label>
              <input
                id={`req-${key}`}
                name={key}
                className={styles.input}
                value={requestForm[key]}
                onChange={handleRequestChange}
                placeholder={pharmacyData[key] || ''}
              />
            </div>
          ))}
        </div>

        <div className={styles.requestAction}>
          <button className={styles.saveBtn} onClick={handleSubmitRequest} disabled={sending}>
            <Send size={16} /> {sending ? 'Sending...' : 'Send Change Request'}
          </button>
        </div>
      </div>

      <div className={`${styles.card} ${styles.requestCard}`}>
        <div className={styles.requestHeader}>
          <div>
            <h2 className={styles.requestTitle}>Change Request History</h2>
            <p className={styles.requestSubtitle}>Status of your submitted requests.</p>
          </div>
        </div>

        {requests.length === 0 ? (
          <p className={styles.value}>No requests yet.</p>
        ) : (
          <div className={styles.requestList}>
            {requests.map((req) => (
              <div className={styles.requestItem} key={req.id}>
                <div className={styles.requestItemInfo}>
                  <span className={styles.requestItemChanges}>{formatChanges(req.requested_changes)}</span>
                  <span className={styles.requestItemDate}>
                    <Clock size={12} />
                    {new Date(req.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <span className={`${styles.requestBadge} ${styles[`badge_${req.status}`]}`}>{req.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
