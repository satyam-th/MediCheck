import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {LayoutDashboard, Pill, Wallet, AlertTriangle, UserCircle} from 'lucide-react';

import SideBar from "../../components/shared/SideBar/SideBar";
import { useAuth } from "../../context/AuthContext";
import api, { fetchAllPages } from "../../services/api";

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

    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        fetchAllPages('/pharmacy/inventory/')
            .then((items) => { if (active) setInventory(items); })
            .catch(() => { if (active) setInventory([]); })
            .finally(() => { if (active) setLoading(false); });

        return () => { active = false; };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    async function handleFormSubmit(formData, editingItem){
        const { id, ...payload } = formData;

        try {
            if (editingItem) {
                const { data } = await api.patch(`/pharmacy/inventory/${id}/`, payload);
                setInventory((prev) => prev.map((med) => (med.id === data.id ? data : med)));
            } else {
                const { data } = await api.post('/pharmacy/inventory/', payload);
                setInventory((prev) => prev.some((med) => med.id === data.id)
                    ? prev.map((med) => (med.id === data.id ? data : med))
                    : [...prev, data]);
            }
            return true;
        } catch {
            return false;
        }
    }

    async function handleConfirmDelete(id){
        try {
            await api.delete(`/pharmacy/inventory/${id}/`);
            setInventory((prev) => prev.filter((med) => med.id !== id));
            return true;
        } catch {
            return false;
        }
    }

    function handleCompleteSale(cartItems){
    setInventory((prev) => 
        prev.map((med) => {
            const soldItem = cartItems.find((c) => c.id === med.id);
            if(soldItem){
                return { ...med, quantity: med.quantity - soldItem.quantity };
            }
            return med;
        })
    );
}

    return(
        <div className={styles.wrapper}>
            <SideBar brandname='medicheck' navItems={navItems} userName={user?.name || "Owner"} onLogout={handleLogout}/>
            <div className={styles.main}>
                {/* context: child pages read inventory + handlers via useOutletContext() */}
                <Outlet context={{ inventory, loading, handleFormSubmit, handleConfirmDelete, handleCompleteSale}}/>
            </div>
        </div>
    );
}
