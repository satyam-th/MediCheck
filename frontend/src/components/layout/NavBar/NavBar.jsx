import { Link } from "react-router-dom";
import medicheckLogo from '../../../assets/logo/medicheck-logo.png';
import {Menu, X} from 'lucide-react';

import SearchBar from "../../shared/SearchBar/SearchBar";

import styles from './NavBar.module.css';
import { useState } from "react";

export default function NavBar(){
    const[menuOpen, setMenuOpen] = useState(false);
    return(
       <>
        <nav className={styles.mainNavContainer}>
            <Link to='/' className={styles.logoContainer}>
                <img src={medicheckLogo} alt="medicheck" className={styles.logo} />
                <div className={styles.logoText}>medicheck</div>
            </Link>
            
            {/* hamburger style for mobile view */}
            <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>

            <div className={`${styles.navlinks} ${menuOpen ? styles.open : ''}`}>

                <Link to='/' className={styles.link} onClick={()=>setMenuOpen(false)}>Home</Link>
                <Link to='/about' className={styles.link} onClick={()=>setMenuOpen(false)}>About Us</Link>
                <Link to='/pharmacies' className={styles.link} onClick={()=>setMenuOpen(false)}>Pharmacies</Link>

                <SearchBar size="small" className={styles.navSearchBar}/>
                
                <div className={styles.auth}>
                <Link to='/login' className={styles.authLink} onClick={()=>setMenuOpen(false)}>Login</Link>/
                <Link to='/register' className={styles.authLink} onClick={()=>setMenuOpen(false)}>Register</Link>
                </div>
            </div>

        </nav>
       </>
    );
}