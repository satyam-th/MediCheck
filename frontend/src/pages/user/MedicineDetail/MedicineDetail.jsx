import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Clock, Building2 } from 'lucide-react';
import api from '../../../services/api';
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
        const res = await api.get('/availability/', { params: { medicine_id: id } });
        const data = res.data || [];
        setStock(data);
        if (data.length > 0) {
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
      <Link to="/search" className={styles.backLink}>
        <ArrowLeft size={20} /> Back to results
      </Link>

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
                <span className={styles.qty}>{item.quantity} in stock</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
