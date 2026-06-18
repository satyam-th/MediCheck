import styles from './QuickFeatures.module.css'

import { Search, Store, RefreshCw, MapPin } from 'lucide-react';
export default function QuickFeatures(){
    const features = [
                        {icon: <Search size={30}/>, title: "Medicine Search", description: "Search by medicine name or pahrmacy"},
                        {icon: <Store size={30}/>, title: "Multiple Pharmacies", description: "See availability across different pharmacies at once"},
                        {icon: <RefreshCw size={30}/>, title: "Stock Status", description: "Pharmacies update their stocks"},
                        {icon: <MapPin size={30}/>, title: "Nearby Pharmacies", description: "Find pharmacies close to your location"}
                    ] ;
    return(
        <div className={styles.quickFeatureContainer}>
            <div className={styles.headingContents}>
                <p className={styles.firstHeading}>QUICK FEATURES</p>
                <p className={styles.secondHeading}>Everything you need to find your medicine</p>
                <p className={styles.thirdHeading}>Simple, fast and relaible medicine availability checking</p>
            </div>

            <div className={styles.featureCard}>
                {features.map((feature)=>(
                
                    <div className={styles.featureContents} key={feature.title}>
                        <div className={styles.icon}>{feature.icon}</div>
                        <p className={styles.title}>{feature.title}</p>
                        <p className={styles.description}>{feature.description}</p>
                    </div>
                
                ))}
            </div>
        </div>
    );
}