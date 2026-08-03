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
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return(
        <div className={styles.wrapper}>
            <SideBar brandname='medicheck' navItems={navItems} userName="Admin" onLogout={handleLogout}/>
            <div className={styles.main}>
                <Outlet/>
            </div>
        </div>
    );
}