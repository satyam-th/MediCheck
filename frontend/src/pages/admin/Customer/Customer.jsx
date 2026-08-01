import { useState } from 'react';

import CustomerTable from '../../../components/admin/CustomerTable/CustomerTable';

import styles from './Customer.module.css';

const initialCustomers = [
  { id: 1, name: 'Suzane Maharjan', email: 'suzane.m@gmail.com', dateJoined: 'Jul 10, 2026', status: 'active' },
  { id: 2, name: 'Prakriti Adhikari', email: 'prakriti.a@gmail.com', dateJoined: 'Jul 8, 2026', status: 'active' },
  { id: 3, name: 'Nabin Karki', email: 'nabin.k@gmail.com', dateJoined: 'Jul 4, 2026', status: 'inactive' },
  { id: 4, name: 'Sristi Bhandari', email: 'sristi.b@gmail.com', dateJoined: 'Jun 29, 2026', status: 'active' },
]

export default function Customer() {
  const [customers, setCustomers] = useState(initialCustomers);

  function handleStatusChange(customerId, newStatus) {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === customerId
          ? { ...customer, status: newStatus }
          : customer
      )
    );
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
        <CustomerTable customers={customers} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
}