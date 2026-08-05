import styles from './InventoryTable.module.css';

import {Pencil, Trash2} from 'lucide-react';
import {Fragment} from 'react';

function getExpiryStatus(expiryDate){
    const daysLeft = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysLeft < 0) return 'expired';
    if(daysLeft < 60) return 'expiring-soon';
    return 'ok';
}

function groupByMedicine(items){
    const groups = new Map();
    for (const item of items) {
        const key = item.medicine;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(item);
    }
    return [...groups.values()];
}

export default function InventoryTable({items=[], onEdit,  onDelete}){
    const showActions = onEdit && onDelete; //only show Action column if both handlers exist
    const groups = groupByMedicine(items);
    const totalCols = showActions ? 6 : 5;

    if (groups.length === 0) return null;

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Medicine</th>
                        <th>Batch no.</th>
                        <th>Quantity</th>
                        <th>MRP</th>
                        <th>Expiry</th>
                        {showActions && <th>Action</th>}
                    </tr>
                </thead>

                <tbody>
                    {groups.map((rows) => {
                        const first = rows[0];
                        const totalQty = rows.reduce((sum, r) => sum + Number(r.quantity || 0), 0);
                        const medLow = first.medicine_stock_status === 'low_stock' || first.medicine_stock_status === 'out_of_stock';

                        return (
                        <Fragment key={first.id}>
                            <tr className={styles.medicineRow}>
                                <td>
                                    <div className={styles.medicineName}>
                                        {first.medicine_name}
                                        {medLow && (
                                            <span className={first.medicine_stock_status === 'out_of_stock' ? styles.badgeDanger : styles.badgeWarning}>
                                                {first.medicine_stock_status === 'out_of_stock' ? 'Out of stock' : 'Low stock'}
                                            </span>
                                        )}
                                    </div>
                                    {first.generic_name && <div className={styles.genericName}>{first.generic_name}</div>}
                                </td>
                                <td colSpan={totalCols - 1} className={styles.totalCell}>
                                    Total: {totalQty} {rows.length > 1 ? `· ${rows.length} batches` : ''}
                                </td>
                            </tr>

                            {rows.map((item) => {
                                const expiryStatus = getExpiryStatus(item.expiry_date);

                                return(
                                <tr key={item.id} className={styles.batchRow}>
                                    <td></td>
                                    <td>{item.batch_number}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.mrp}</td>
                                    <td>
                                        {expiryStatus === 'expired' ? ( <span className={styles.badgeDanger}>{item.expiry_date}</span> )
                                        : expiryStatus === 'expiring-soon' ? ( <span className={styles.badgeWarning}>{item.expiry_date}</span> )
                                        : (item.expiry_date)}
                                    </td>

                                    {showActions && (
                                    <td className={styles.actionCol}>
                                        <button className={styles.iconBtn} onClick={()=>onEdit(item)} aria-label='Edit'><Pencil size={16}/></button>
                                        <button className={styles.iconBtn} onClick={()=>onDelete(item)} aria-label='Delete'><Trash2 size={16}/></button>
                                    </td>
                                    )}
                                </tr>
                                )
                            })}
                        </Fragment>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}
