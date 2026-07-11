import styles from './AlertList.module.css'

import Badge from '../../ui/Badge/Badge'

export default function AlertList({items = []}){
    return(
        <div className={styles.container}>
            <h3 className={styles.title}>Low Stock Alerts</h3>

            <div className={styles.list}>
                {items.map((item)=>(
                    <div key={item.id} className={styles.row}>
                        <div className={styles.info}>
                            <span className={styles.medicine}>{item.medicine}</span>
                            <span className={styles.quantity}>{item.quantity} units left</span>
                        </div>
                        <Badge status={item.status}/>
                    </div>
                ))}
            </div>
        </div>
    );
}