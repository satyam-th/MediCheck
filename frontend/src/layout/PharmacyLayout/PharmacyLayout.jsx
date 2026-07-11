import { Outlet, useNavigate } from "react-router-dom";

import {LayoutDashboard, Pill, Wallet, AlertTriangle, UserCircle} from 'lucide-react';

import SideBar from "../../components/shared/SideBar/SideBar";
import { useAuth } from "../../context/AuthContext";

import styles from './PharmacyLayout.module.css';

const navItems = [
  { label: 'Dashboard', path: '/pharmacy/dashboard', icon: LayoutDashboard },
  { label: 'Medicines', path: '/pharmacy/medicines', icon: Pill },
  { label: 'Sales', path: '/pharmacy/sales', icon: Wallet },
  { label: 'Low stock', path: '/pharmacy/low-stock', icon: AlertTriangle },
  { label: 'Profile', path: '/pharmacy/profile', icon: UserCircle },
];

export default function PharmacyLayout(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return(
        <div className={styles.wrapper}>
            <SideBar brandname='medicheck' navItems={navItems} userName={user?.name || "Owner"} onLogout={handleLogout}/>
            <div className={styles.main}>
                <Outlet/>
            </div>
        </div>
    );
}