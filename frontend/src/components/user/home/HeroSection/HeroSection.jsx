import styles from './HeroSection.module.css'

import SearchBar from '../../../shared/SearchBar/SearchBar';

export default function HeroSection(){
    return(
        <>
        <div className={styles.heroContainer}>
            <div className={styles.gradientOverlay}></div>

            <div className={styles.heroContent}>
                
                <h1 className={styles.largeText}>
                    Right medicine,<br />Right nearby.
                </h1>

                <p className={styles.smallText}>
                    Locate trusted local pharmacies, verify stock, and compare pricing instantly.
                </p>

                <SearchBar size="large"/>
            </div>
        </div>
        </>
    );
}