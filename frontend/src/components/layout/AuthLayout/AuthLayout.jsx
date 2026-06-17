import styles from './AuthLayout.module.css'
import medicheckLogo from '../../../assets/logo/medicheck-logo.png'

import { ArrowLeft } from 'lucide-react';

import { Link } from 'react-router-dom';
export default function AuthLayout({children, tagline, subtext, features}){
    return(
        <div className={styles.authLayoutContainer}>
            {/* left panel */}
            <div className={styles.leftPanel}>
                <Link to='/' className={styles.logoContainer}>
                    <img src={medicheckLogo} alt="medicheck" className={styles.logo} />
                    <div className={styles.logoText}>medicheck</div>
                </Link>
                <p className={styles.tagline}>{tagline}</p>
                <p className={styles.subtext}>{subtext}</p>

                <div className={styles.featuresList}>
                    {features.map((feature, index)=>(
                        <div key={index} className={styles.featureItem}>
                            {feature.icon}
                            <span>{feature.text}</span>
                        </div>
                    ))}
                </div>
                <p className={styles.footer}>&#169; 2026 MediCheck. All rights reserved.</p>
            </div>

            {/* right panel */}
            <div className={styles.rightPanel}>

                <div className={styles.backBtnContainer}><Link to='/' className={styles.backBtn}><ArrowLeft size={18}/>Back to Home</Link></div>
                
                {children}
            </div>
        </div>
    );

}