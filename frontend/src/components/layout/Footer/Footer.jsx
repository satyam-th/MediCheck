import {Link} from 'react-router-dom';
import {Phone, Mail, MapPin} from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer(){
    return(
        <>
        <footer className={styles.mainFooter}>
            <div className={styles.mainFooterContainer}>
            
            {/* medicheck logo and tagline */}
            <div className={styles.mediCheckDesc}>
                <p className={styles.logoText}>medicheck</p>
                <p className={styles.tagLine}>Your trusted companion for checking medicine availability and locating nearby pharmacies instantly.</p>
            </div>

            {/* quick links */}
            <div className={styles.quickLinks}>
                <p className={styles.colHeading}>Quick Links</p>
                <ul className={styles.linksList}>
                    <li><Link to='/' className={styles.footerLink}>Home</Link></li>
                    <li><Link to='/about' className={styles.footerLink}>About Us</Link></li>
                    <li><Link to='/pharmacies' className={styles.footerLink}>Pharmacies</Link></li>
                </ul>
            </div>

            {/* contact us */}
            <div className={styles.contact}>
                <p className={styles.colHeading}>Contact Us</p>
                <ul className={styles.contactList}>

                    <li className={styles.contactItem}>
                        <Phone size={16} className={styles.contactIcon}/>
                        <a href="tel:+9779812345678" className={styles.contactLink}>+9779812345678</a>
                    </li>

                    <li className={styles.contactItem}>
                        <Mail size={16} className={styles.contactIcon}/>
                        <a href="mailto:support@medicheck.com" className={styles.contactLink}>support@medicheck.com</a>
                    </li>

                    <li className={styles.contactItem}>
                        <MapPin size={16} className={styles.contactIcon}/>
                        <span className= {styles.contactText}>Kathmandu, Nepal</span>
                    </li>
                </ul>
            </div>
            
        </div>
        {/* copyright */}
            <div className={styles.copyright}>
                <p>Copyright &#169; 2026, MediCheck. All rights reserved.</p>
            </div>
        </footer>
        </>
    );
}