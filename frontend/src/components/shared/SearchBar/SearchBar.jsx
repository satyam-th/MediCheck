import { Search } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './SearchBar.module.css'

export default function SearchBar({ size = "small", className = '' }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length >= 2) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  }, [query, navigate]);

  return (
    <form className={`${styles.searchWrapper} ${styles[size]} ${className}`} onSubmit={handleSearch}>
      <Search className={styles.searchIcon} />
      <input
        type="search"
        placeholder="Search medicine (e.g., Paracetamol)"
        className={styles.searchMed}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}