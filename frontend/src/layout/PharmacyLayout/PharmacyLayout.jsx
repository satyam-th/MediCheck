import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {LayoutDashboard, Pill, Wallet, AlertTriangle, UserCircle} from 'lucide-react';

import SideBar from "../../components/shared/SideBar/SideBar";
import { useAuth } from "../../context/AuthContext";
import api, { fetchAllPages } from "../../services/api";

import styles from './PharmacyLayout.module.css';

const ALL_NAV = [
  { label: 'Dashboard', path: '/pharmacy/dashboard', icon: LayoutDashboard },
  { label: 'Medicines', path: '/pharmacy/medicines', icon: Pill },
  { label: 'Sales', path: '/pharmacy/sales', icon: Wallet },
  { label: 'Low stock', path: '/pharmacy/low-stock', icon: AlertTriangle },
  { label: 'Profile', path: '/pharmacy/profile', icon: UserCircle },
];

// Sections a suspended pharmacy is still allowed to use.
const SUSPENDED_NAV_LABELS = ['Medicines', 'Sales', 'Low stock'];
const SUSPENDED_RESTRICTED_PATHS = ['/pharmacy', '/pharmacy/dashboard', '/pharmacy/profile'];

export default function PharmacyLayout(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pharmacyStatus, setPharmacyStatus] = useState(null);
    const [, setLowStockThreshold] = useState(12);

    useEffect(() => {
        let active = true;

        api.get('/pharmacy/profile/')
            .then(({ data }) => {
                if (!active) return;
                setPharmacyStatus(data.status || 'active');
                if (data.low_stock_threshold != null) setLowStockThreshold(data.low_stock_threshold);
            })
            .catch(() => { if (active) setPharmacyStatus('active'); });

        fetchAllPages('/pharmacy/inventory/')
            .then((items) => { if (active) setInventory(items); })
            .catch(() => { if (active) setInventory([]); })
            .finally(() => { if (active) setLoading(false); });

        return () => { active = false; };
    }, []);

    const suspended = pharmacyStatus === 'suspended';
    const navItems = suspended
        ? ALL_NAV.filter((item) => SUSPENDED_NAV_LABELS.includes(item.label))
        : ALL_NAV;

    if (suspended && SUSPENDED_RESTRICTED_PATHS.includes(location.pathname)) {
        return <Navigate to="/pharmacy/medicines" replace />;
    }

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

    async function handleCompleteSale(cartItems){
        const payload = {
            items: cartItems.map((c) => ({
                inventory: c.id,
                quantity: c.quantity,
                unit_price: c.mrp,
            })),
        };

        try {
            const { data } = await api.post('/pharmacy/sales/', payload);
            const fresh = await fetchAllPages('/pharmacy/inventory/');
            setInventory(fresh);
            return data;
        } catch (err) {
            const detail = err.response?.data?.non_field_errors?.[0]
                || err.response?.data?.detail
                || 'Sale could not be completed.';
            throw new Error(detail, { cause: err });
        }
    }

    const pharmacyOwnerName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'Owner';

    return(
        <div className={styles.wrapper}>
            <SideBar brandname='medicheck' navItems={navItems} userName={pharmacyOwnerName} onLogout={handleLogout}/>
            <div className={styles.main}>
                {suspended && (
                    <div className={styles.suspendedBanner}>
                        Your pharmacy is suspended — your medicines are hidden from customers. Sales and medicine
                        management are still available. Contact admin to reactivate.
                    </div>
                )}
                {/* context: child pages read inventory + handlers via useOutletContext() */}
                <Outlet context={{ inventory, loading, pharmacyStatus, handleFormSubmit, handleConfirmDelete, handleCompleteSale}}/>
            </div>
        </div>
    );
}
