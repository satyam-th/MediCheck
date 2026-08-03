import { Outlet, useNavigate } from "react-router-dom";

import {LayoutDashboard, UserCircle} from 'lucide-react';

import SideBar from "../../components/shared/SideBar/SideBar";
import { useAuth } from "../../context/AuthContext";

import styles from './AdminLayout.module.css';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
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
            <SideBar brandname='medicheck' navItems={navItems} userName="Owner" onLogout={handleLogout}/>
            <div className={styles.main}>
                <Outlet/>
            </div>
        </div>
    );
}