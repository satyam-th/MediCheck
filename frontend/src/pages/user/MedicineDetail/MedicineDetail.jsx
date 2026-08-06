import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Clock, Building2 } from 'lucide-react';
import api from '../../../services/api';
import SearchBar from '../../../components/shared/SearchBar/SearchBar';
import styles from './MedicineDetail.module.css';

const statusLabels = {
  available: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
};

export default function MedicineDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || '';

  const [medicine, setMedicine] = useState({ name });
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [detailRes, stockRes] = await Promise.all([
          api.get(`/medicines/${id}/`),
          api.get('/availability/', { params: { medicine_id: id } }),
        ]);
        const data = stockRes.data || [];
        setStock(data);
        if (detailRes.data) {
          setMedicine({
            name: detailRes.data.name,
            generic_name: detailRes.data.generic_name,
            requires_prescription: detailRes.data.requires_prescription,
            photo: detailRes.data.photo,
          });
        } else if (data.length > 0) {
          setMedicine({
            name: data[0].medicine_name,
            generic_name: data[0].generic_name,
            requires_prescription: data[0].requires_prescription,
            photo: data[0].photo,
          });
        }
      } catch {
        setStock([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        <ArrowLeft size={20} /> Back to Home
      </Link>

      <SearchBar size="large" className={styles.headerSearch} />

      <div className={styles.header}>
        {medicine.photo && (
          <img src={medicine.photo} alt={medicine.name} className={styles.photo} />
        )}
        <div>
          <h1 className={styles.title}>{medicine.name || 'Medicine'}</h1>
          {medicine.generic_name && (
            <p className={styles.generic}>Generic: {medicine.generic_name}</p>
          )}
          {medicine.requires_prescription && (
            <span className={styles.rx}>Requires Prescription</span>
          )}
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Available at</h2>

      {loading ? (
        <p className={styles.empty}>Checking availability...</p>
      ) : stock.length === 0 ? (
        <p className={styles.empty}>
          No pharmacy currently has this medicine in stock.
        </p>
      ) : (
        <div className={styles.list}>
          {stock.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.pharmacyName}>
                  <Building2 size={16} /> {item.pharmacy_name}
                </span>
                <span className={`${styles.badge} ${styles[item.stock_status]}`}>
                  {statusLabels[item.stock_status] || item.stock_status}
                </span>
              </div>

              <p className={styles.meta}>
                <MapPin size={14} /> {item.pharmacy_address || '—'}
              </p>
              <p className={styles.meta}>
                <Phone size={14} /> {item.pharmacy_contact || '—'}
              </p>
              <p className={styles.meta}>
                <Clock size={14} /> {item.pharmacy_is_open ? 'Open now' : 'Closed now'}
              </p>

              <div className={styles.cardBottom}>
                <span className={styles.mrp}>Rs. {item.mrp}</span>
                {item.stock_status === 'low_stock' && (
                  <span className={styles.lowStockCall}>Low stock — call to confirm</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
