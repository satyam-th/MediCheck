import styles from './LowStock.module.css';
import { useOutletContext } from 'react-router-dom';

import InventoryTable from '../../../components/pharmacy/InventoryTable/InventoryTable';

export default function LowStock(){
    const { inventory } = useOutletContext();

    const lowStockItems = inventory.filter((item) => item.quantity < 10);

    return(
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Low Stock</h1>
                    <p className={styles.subtitle}>
                        {lowStockItems.length} medicine{lowStockItems.length !== 1 ? 's' : ''} running low
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