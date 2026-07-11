import styles from './InventoryTable.module.css';

import {Pencil, Trash2} from 'lucide-react';

function getExpiryStatus(expiryDate){
    if (!expiryDate) return 'ok';
    const daysLeft = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysLeft < 0) return 'expired';
    if(daysLeft < 60) return 'expiring-soon';
    return 'ok';
}

export default function InventoryTable({items=[], onEdit, onDelete}){
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Medicine</th>
                        <th>Quantity</th>
                        <th>MRP</th>
                        <th>Batch no.</th>
                        <th>Expiry</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item)=>{
                        const isLowStock = item.stock_status === 'low_stock' || item.stock_status === 'out_of_stock';
                        const expiryStatus = getExpiryStatus(item.expiry_date);

                        return(
                        <tr key={item.id}>
                            <td>{item.medicine_name}</td>
                            <td>
                                {isLowStock ? (<span className={styles.badgeWarning}>{item.quantity}</span>) : (item.quantity)}
                            </td>
                            <td>{item.mrp}</td>
                            <td>{item.batch_number}</td>
                            <td>
                                {expiryStatus === 'expired' ? ( <span className={styles.badgeDanger}>{item.expiry_date}</span> )
                                : expiryStatus === 'expiring-soon' ? ( <span className={styles.badgeWarning}>{item.expiry_date}</span> )
                                : (item.expiry_date)}
                                
                                </td>
                            <td className={styles.actionCol}>
                                <button className={styles.iconBtn} onClick={()=>onEdit(item)} aria-label='Edit'><Pencil size={16}/></button>
                                <button className={styles.iconBtn} onClick={()=>onDelete(item)} aria-label='Delete'><Trash2 size={16}/></button>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
            
        </div>
    );
}
