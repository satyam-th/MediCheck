import { useState, useEffect, startTransition } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Clock, ArrowLeft } from 'lucide-react';
import api from '../../../services/api';
import styles from './SearchResults.module.css';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) return;
    startTransition(() => setLoading(true));
    api.get('/search/', { params: { q: query } })
      .then(({ data }) => setResults(data))
      .catch(() => setResults([]))
      .finally(() => startTransition(() => setLoading(false)));
  }, [query]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={20} /> Back to Home
        </Link>
        <h1 className={styles.title}>
          <Search size={24} /> Search Results
        </h1>
        <p className={styles.subtitle}>
          {query ? `Showing results for "${query}"` : 'Enter a search term to find medicines'}
        </p>
      </div>

      <div className={styles.content}>
        {loading && <p className={styles.loading}>Searching...</p>}

        {!loading && results.length === 0 && query && (
          <div className={styles.empty}>
            <Search size={48} className={styles.emptyIcon} />
            <h3>No medicines found</h3>
            <p>Try searching with a different name or generic name.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className={styles.grid}>
            {results.map((med) => (
              <Link
                key={med.id}
                to={`/medicine/${med.id}?name=${encodeURIComponent(med.name)}`}
                className={styles.card}
              >
                <h3 className={styles.medName}>{med.name}</h3>
                {med.generic_name && (
                  <p className={styles.generic}>
                    <span>Generic:</span> {med.generic_name}
                  </p>
                )}
                {med.manufacturer && (
                  <p className={styles.mfr}>
                    <span>Mfr:</span> {med.manufacturer}
                  </p>
                )}
                {med.requires_prescription && (
                  <span className={styles.rx}>Requires Prescription</span>
                )}
                <span className={styles.checkAvailability}>
                  <MapPin size={14} /> Check Availability
                </span>
              </Link>
            ))}
          </div>
        )}

        {!query && !loading && (
          <div className={styles.empty}>
            <Clock size={48} className={styles.emptyIcon} />
            <h3>Search for a medicine</h3>
            <p>Use the search bar above to find medicines and see where they are available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
