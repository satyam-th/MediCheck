import styles from './PharmacyTable.module.css';

export default function PharmacyTable({ pharmacies = [] }) {
    return (
        <div>
            <p className={styles.count}>{pharmacies.length} registered</p>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '35%' }}>Pharmacy</th>
                            <th style={{ width: '25%' }}>Owner</th>
                            <th style={{ width: '25%' }}>Location</th>
                            <th style={{ width: '15%' }}>Date Added</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pharmacies.map((pharmacy) => (
                            <tr key={pharmacy.id}>
                                <td>{pharmacy.name}</td>
                                <td>{pharmacy.owner}</td>
                                <td>{pharmacy.location}</td>
                                <td>{pharmacy.dateAdded}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}