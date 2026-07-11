import styles from './RecentMedicines.module.css';

export default function RecentMedicines({medicines = []}){
    return(
        <div className={styles.container}>
                    <h3 className={styles.title}>Recently Added Medicines</h3>
        
                    <div className={styles.list}>
                        {medicines.map((medicine) => (
                            <div key={medicine.id} className={styles.row}>
                                <div className={styles.info}>
                                    <span className={styles.name}>{medicine.name}</span>
                                    <span className={styles.category}>{medicine.category}</span>
                                </div>
                                <div className={styles.meta}>
                                    <span className={styles.date}>{medicine.dateAdded}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
    );
}