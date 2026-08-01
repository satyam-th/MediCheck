import styles from './CustomerTable.module.css';

export default function CustomerTable({ customers = [], onStatusChange }) {
    return (
        <div>
            <p className={styles.count}>{customers.length} customers</p>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>Name</th>
                            <th style={{ width: '35%' }}>Email</th>
                            <th style={{ width: '20%' }}>Date Joined</th>
                            <th style={{ width: '15%' }}>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.dateJoined}</td>
                                <td>
                                    <select
                                        className={`${styles.statusSelect} ${styles[customer.status]}`}
                                        value={customer.status}
                                        onChange={(e) => onStatusChange(customer.id, e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}