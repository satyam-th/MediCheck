import { Outlet, useNavigate } from "react-router-dom";

import {LayoutDashboard, Cross, Pill, User, CircleUser} from 'lucide-react';

import SideBar from "../../components/shared/SideBar/SideBar";
import { useAuth } from "../../context/AuthContext";

import styles from './AdminLayout.module.css';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Pharmacy', path: '/admin/pharmacy', icon: Cross },
  { label: 'Medicines', path: '/admin/medicines', icon: Pill },
  { label: 'Customer', path: '/admin/customer', icon: User },
  { label: 'Profile', path: '/admin/profile', icon: CircleUser }
];

export default function AdminLayout(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const adminName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'Admin';

    return(
        <div className={styles.wrapper}>
            <SideBar brandname='medicheck' navItems={navItems} userName={adminName} homePath='/admin/dashboard' onLogout={handleLogout}/>
            <div className={styles.main}>
                <Outlet/>
            </div>
        </div>
    );
}