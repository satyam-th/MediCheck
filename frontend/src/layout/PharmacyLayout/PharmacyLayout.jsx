import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";  //  hold inventory here 

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

//moved here from Medicine.jsx, so both Medicines page and Low Stock page can access it
const medicineInventory = [];

export default function PharmacyLayout(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    //inventory state, moved here from Medicine.jsx
    const [inventory, setInventory] = useState(medicineInventory);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // ADDED: same submit logic as Medicine.jsx's handleFormSubmit, moved here
    function handleFormSubmit(formData, editingItem){
        if(editingItem){
            setInventory((prev) => prev.map((med)=> (med.id === formData.id ? formData : med)));
        } else {
            setInventory((prev)=> [...prev, formData]);
        }
    }

    // Medicine.jsx's handleConfirmDelete, moved here
    function handleConfirmDelete(id){
        setInventory((prev)=> prev.filter((med)=> med.id !== id));
    }

    return(
        <div className={styles.wrapper}>
            <SideBar brandname='medicheck' navItems={navItems} userName={user?.name || "Owner"} onLogout={handleLogout}/>
            <div className={styles.main}>
                {/* ADDED: context prop, so child pages can read inventory + handlers via useOutletContext() */}
                <Outlet context={{ inventory, handleFormSubmit, handleConfirmDelete }}/>
            </div>
        </div>
    );
}