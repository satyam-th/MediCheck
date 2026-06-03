import { Link } from "react-router-dom";
import {Search} from 'lucide-react';
import medicheckLogo from '../../../assets/logo/medicheck-logo.png';

import styles from './NavBar.module.css';

export default function NavBar(){
    return(
       <>
        <nav className={styles.mainNavContainer}>
            <Link to='/' className={styles.logoContainer}>
                <img src={medicheckLogo} alt="medicheck" className={styles.logo} />
                <div className={styles.logoText}>medicheck</div>
            </Link>
            
            <div className={styles.navlinks}>
                

                <Link to='/' className={styles.link}>Home</Link>
                <Link to='/about' className={styles.link}>About Us</Link>
                <Link to='/pharmacies' className={styles.link}>Pharmacies</Link>

                <form className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} />
                    <input type="search" placeholder="Search medicine name, pharmacy name..." className={styles.searchMed}/>

                </form>
                
                <div className={styles.auth}>
                <Link to='/login' className={styles.authLink}>Login</Link>/
                <Link to='/register' className={styles.authLink}>Register</Link>
                </div>
            </div>

        </nav>
       </>
    );
}