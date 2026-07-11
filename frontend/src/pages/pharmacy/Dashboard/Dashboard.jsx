import { useState, useEffect } from 'react';
import StatCard from '../../../components/ui/StatCard/StatCard'
import RecentSales from '../../../components/shared/RecentSales/RecentSales';
import AlertList from '../../../components/shared/AlertList/AlertList';
import Greeting from '../../../components/shared/Greeting/Greeting';

import styles from './Dashboard.module.css'
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, low: 0, out: 0 });
  const [salesSummary, setSalesSummary] = useState({ transaction_count: 0, total_revenue: 0 });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [invRes, lowRes, summaryRes, salesRes] = await Promise.all([
          api.get('/pharmacy/inventory/'),
          api.get('/pharmacy/inventory/low_stock/'),
          api.get('/pharmacy/sales/daily_summary/'),
          api.get('/pharmacy/sales/', { params: { page: 1 } }),
        ]);

        const all = invRes.data.results || invRes.data || [];
        const low = lowRes.data || [];

        setStats({
          total: all.length,
          low: low.filter(i => i.stock_status === 'low_stock').length,
          out: low.filter(i => i.stock_status === 'out_of_stock').length,
        });

        setLowStock(low.map(i => ({
          id: i.id,
          medicine: i.medicine_name,
          quantity: i.quantity,
          status: i.stock_status === 'out_of_stock' ? 'out' : 'low',
        })));

        setSalesSummary(summaryRes.data);

        const salesData = salesRes.data.results || salesRes.data || [];
        setRecentSales(salesData.slice(0, 5).map(s => ({
          id: s.id,
          medicine: s.items?.[0]?.medicine_name || 'Sale',
          quantity: s.items?.[0]?.quantity || 0,
          amount: s.total_amount,
          time: new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })));
      } catch {
        // silently fail — show zeros
      }
    }
    fetchData();
  }, []);

  const name = user?.first_name || user?.username || 'Pharmacist';

  return (
    <div className={styles.dashboard}>
      <Greeting username={name} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Inventory Overview</h2>
        <div className={styles.statGrid}>
          <StatCard label="Total Medicines" value={stats.total} color="blue" />
          <StatCard label="Low Stock" value={stats.low} color="orange" />
          <StatCard label="Out of Stock" value={stats.out} color="red" />
          <StatCard label="Expiring Soon" value="—" color="yellow" />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sales Summary</h2>
        <div className={styles.statGrid}>
          <StatCard label="Today's Sales" value={salesSummary.transaction_count} color="blue" />
          <StatCard label="Today's Revenue" value={`Rs. ${(salesSummary.total_revenue || 0).toLocaleString()}`} color="green" />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Activity</h2>
        <div className={styles.activityGrid}>
          <RecentSales sales={recentSales} />
          <AlertList items={lowStock} />
        </div>
      </section>
    </div>
  );
}