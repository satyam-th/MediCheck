import styles from './MedicineTable.module.css';

export default function MedicineTable({ medicines = [] }) {
    return (
        <div>
            <p className={styles.count}>{medicines.length} medicines</p>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '50%' }}>Medicine Name</th>
                            <th style={{ width: '30%' }}>Category</th>
                            <th style={{ width: '20%' }}>Date Added</th>
                        </tr>
                    </thead>

                    <tbody>
                        {medicines.map((medicine) => (
                            <tr key={medicine.id}>
                                <td>{medicine.name}</td>
                                <td>{medicine.category}</td>
                                <td>{medicine.dateAdded}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}