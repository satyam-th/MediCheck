import styles from './LowStock.module.css';
import { useOutletContext } from 'react-router-dom';

import InventoryTable from '../../../components/pharmacy/InventoryTable/InventoryTable';

export default function LowStock(){
    const { inventory } = useOutletContext();

    const lowStockItems = inventory.filter(
        (item) => item.medicine_stock_status === 'low_stock' || item.medicine_stock_status === 'out_of_stock'
    );
    const lowMedicineCount = new Set(lowStockItems.map((item) => item.medicine)).size;

    return(
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Low Stock</h1>
                    <p className={styles.subtitle}>
                        {lowMedicineCount} medicine{lowMedicineCount !== 1 ? 's' : ''} running low
                    </p>
                </div>
            </div>

            <section>
                {lowStockItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Nothing's running low right now.</p>
                    </div>
                ):(
                    <InventoryTable items={lowStockItems} />
                )}
            </section>
        </div>
    );
}