import styles from './SideBar.module.css'

import {Link, NavLink} from 'react-router-dom'

export default function SideBar({brandname='medicheck', navItems=[], userName='Owner', onLogout}){
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

    return(
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <Link to='/pharmacy/dashboard' className={styles.brandName}>{brandname}</Link>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item)=>{
                    const Icon = item.icon;

                    return(
                       <NavLink key={item.path} to={item.path} className={({isActive})=> isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <Icon size={17} strokeWidth={2}/>
                        {item.label}
                       </NavLink>
                    );
                })}
            </nav>

            <div className={styles.userSection}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>{initials}</div>
                    <span className={styles.userName}>{userName}</span>
                </div>
                <button className={styles.logoutBtn} onClick={onLogout}>
                    Logout
                </button>
            </div>
        </aside>
    );

}