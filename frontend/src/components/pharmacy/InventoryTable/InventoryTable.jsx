import styles from './InventoryTable.module.css';

import {Pencil, Trash2} from 'lucide-react';

export default function InventoryTable({items=[], onEdit,  onDelete}){
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
                    {items.map((item)=>(
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.mrp}</td>
                            <td>{item.batchNo}</td>
                            <td>{item.expiry}</td>
                            <td className={styles.actionCol}>
                                <button className={styles.iconBtn} onClick={()=>onEdit(item)} aria-label='Edit'><Pencil size={16}/></button>
                                <button className={styles.iconBtn} onClick={()=>onDelete(item)} aria-label='Delete'><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
}