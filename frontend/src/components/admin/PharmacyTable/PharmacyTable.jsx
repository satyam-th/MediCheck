import styles from './PharmacyTable.module.css';

export default function PharmacyTable({ pharmacies = [], onStatusChange }) {
    return (
        <div>
            <p className={styles.count}>{pharmacies.length} registered</p>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>Pharmacy</th>
                            <th style={{ width: '20%' }}>Owner</th>
                            <th style={{ width: '20%' }}>Location</th>
                            <th style={{ width: '15%' }}>Date Added</th>
                            <th style={{ width: '15%' }}>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pharmacies.map((pharmacy) => (
                            <tr key={pharmacy.id}>
                                <td>{pharmacy.name}</td>
                                <td>{pharmacy.owner}</td>
                                <td>{pharmacy.location}</td>
                                <td>{pharmacy.dateAdded}</td>
                                <td>
                                    <select 
                                        value={pharmacy.status}
                                        className={`${styles.statusSelect} ${styles[pharmacy.status]}`}
                                        onChange={(e)=>onStatusChange(pharmacy.id, e.target.value)}>
                                            <option value="active">Active</option>
                                            <option value="suspended">Suspended</option>
                                            <option value="banned">Banned</option>
                                            <option value="pending">Pending</option>
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