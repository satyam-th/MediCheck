import { Outlet } from "react-router-dom";

import {LayoutDashboard, Pill, Wallet, AlertTriangle, UserCircle} from 'lucide-react';

import SideBar from "../../components/shared/SideBar/SideBar";

import styles from './PharmacyLayout.module.css';

const navItems = [
  { label: 'Dashboard', path: '/pharmacy/dashboard', icon: LayoutDashboard },
  { label: 'Medicines', path: '/pharmacy/medicines', icon: Pill },
  { label: 'Sales', path: '/pharmacy/sales', icon: Wallet },
  { label: 'Low stock', path: '/pharmacy/low-stock', icon: AlertTriangle },
  { label: 'Profile', path: '/pharmacy/profile', icon: UserCircle },
];

export default function PharmacyLayout(){
    return(
        <div className={styles.wrapper}>
            <SideBar brandname='medicheck' navItems={navItems} userName="Owner" onLogout={console.log("User logged out")}/>
            <div className={styles.main}>
                <Outlet/>
            </div>
        </div>
    );
}