import styles from './MedicineTable.module.css';

import { Pencil, Trash2 } from 'lucide-react';

export default function MedicineTable({ medicines = [], onEdit, onDelete }) {
    return (
        <div>
            <p className={styles.count}>{medicines.length} medicines</p>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>Medicine Name</th>
                            <th style={{ width: '25%' }}>Category</th>
                            <th style={{ width: '20%' }}>Date Added</th>
                            <th style={{ width: '15%' }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {medicines.map((medicine) => (
                            <tr key={medicine.id}>
                                <td>{medicine.name}</td>
                                <td>{medicine.category}</td>
                                <td>{medicine.dateAdded}</td>
                                <td className={styles.actionCol}>
                                    <button className={styles.iconBtn} onClick={() => onEdit(medicine)} aria-label='Edit'><Pencil size={16} /></button>
                                    <button className={styles.iconBtn} onClick={() => onDelete(medicine)} aria-label='Delete'><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}