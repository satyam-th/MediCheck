import styles from './RecentSales.module.css'

export default function RecentSales({ sales = [] }) {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Recent Sales</h3>

            <div className={styles.list}>
                {sales.map((sale) => (
                    <div key={sale.id} className={styles.row}>
                        <div className={styles.info}>
                            <span className={styles.medicine}>{sale.medicine}</span>
                            <span className={styles.quantity}>x{sale.quantity}</span>
                        </div>
                        <div className={styles.meta}>
                            <span className={styles.amount}>Rs. {sale.amount}</span>
                            <span className={styles.time}>{sale.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}