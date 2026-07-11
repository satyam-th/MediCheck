import { Link, useNavigate } from "react-router-dom";
import medicheckLogo from '../../../assets/logo/medicheck-logo.png';
import {Menu, X, LogOut, LayoutDashboard} from 'lucide-react';

import SearchBar from "../../shared/SearchBar/SearchBar";

import styles from './NavBar.module.css';
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function NavBar(){
    const[menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate('/');
    };

    return(
       <>
        <nav className={styles.mainNavContainer}>
            <Link to='/' className={styles.logoContainer}>
                <img src={medicheckLogo} alt="medicheck" className={styles.logo} />
                <div className={styles.logoText}>medicheck</div>
            </Link>
            
            <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>

            <div className={`${styles.navlinks} ${menuOpen ? styles.open : ''}`}>

                <Link to='/' className={styles.link} onClick={()=>setMenuOpen(false)}>Home</Link>
                <Link to='/about' className={styles.link} onClick={()=>setMenuOpen(false)}>About</Link>

                <SearchBar size="small" className={styles.navSearchBar}/>

                {user ? (
                  <>
                    {user.role === 'pharmacy' && (
                      <Link to='/pharmacy/dashboard' className={styles.link} onClick={()=>setMenuOpen(false)}>
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className={styles.portalBtn}>
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <Link to='/login' className={styles.portalBtn} onClick={()=>setMenuOpen(false)}>Login</Link>
                )}
        
            </div>

        </nav>
       </>
    );
}