import styles from './RecentPharmacies.module.css';

export default function RecentPharmacies({pharmacies = []}){
    return(
        <div className={styles.container}>
                    <h3 className={styles.title}>Recently Added Pharmacies</h3>
        
                    <div className={styles.list}>
                        {pharmacies.map((pharmacy) => (
                            <div key={pharmacy.id} className={styles.row}>
                                <div className={styles.info}>
                                    <span className={styles.name}>{pharmacy.name}</span>
                                    <span className={styles.owner}>{pharmacy.owner}</span>
                                </div>
                                <div className={styles.meta}>
                                    <span className={styles.location}>{pharmacy.location}</span>
                                    <span className={styles.date}>{pharmacy.dateAdded}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
    );
}