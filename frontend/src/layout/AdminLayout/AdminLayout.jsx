import { Outlet } from "react-router-dom";

import {LayoutDashboard, Cross, Pill, User, UserCircle} from 'lucide-react';

import SideBar from "../../components/shared/SideBar/SideBar";

import styles from './AdminLayout.module.css';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Pharmacy', path: '/admin/pharmacy', icon: Cross },
  { label: 'Medicines', path: '/admin/medicines', icon: Pill },
  { label: 'Customer', path: '/admin/customer', icon: User },
];

export default function AdminLayout(){
    return(
        <div className={styles.wrapper}>
            <SideBar brandname='medicheck' navItems={navItems} userName="Admin" onLogout={console.log("User logged out")}/>
            <div className={styles.main}>
                <Outlet/>
            </div>
        </div>
    );
}