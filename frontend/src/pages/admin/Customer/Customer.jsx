import { useState, useEffect } from 'react';

import CustomerTable from '../../../components/admin/CustomerTable/CustomerTable';

import api from '../../../services/api';

import styles from './Customer.module.css';

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await api.get('/admin/customers/');
        const data = res.data.results || res.data || [];
        setCustomers(data.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          dateJoined: new Date(c.date_joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: c.is_active ? 'active' : 'inactive',
        })));
      } catch {
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  async function handleStatusChange(customerId, newStatus) {
    try {
      await api.patch(`/admin/customers/${customerId}/`, { is_active: newStatus === 'active' });
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === customerId ? { ...customer, status: newStatus } : customer
        )
      );
    } catch {
      // silently fail — keep old status
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Customers</h1>
          <p className={styles.subtitle}>View all customers registered on the platform</p>
        </div>
      </div>

      <div className={styles.section}>
        {loading ? (
          <p className={styles.empty}>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p className={styles.empty}>No customers registered yet.</p>
        ) : (
          <CustomerTable customers={customers} onStatusChange={handleStatusChange} />
        )}
      </div>
    </div>
  );
}
