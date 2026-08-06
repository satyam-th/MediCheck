import { Search } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

import styles from './SearchBar.module.css';

export default function SearchBar({ size = "small", className = '' }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const goToResults = useCallback((q) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }, [navigate]);

  useEffect(() => {
    if (query.trim().length < 2) return;

    let stale = false;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get('/search/', { params: { q: query } });
        if (stale) return;
        setSuggestions(res.data || []);
        setShowSuggestions(true);
      } catch {
        if (!stale) setSuggestions([]);
      } finally {
        if (!stale) setSearching(false);
      }
    }, 250);

    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    goToResults(query);
  };

  const handlePick = (med) => {
    setQuery(med.name);
    setShowSuggestions(false);
    navigate(`/medicine/${med.id}?name=${encodeURIComponent(med.name)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (showSuggestions && suggestions.length > 0 && highlightIndex >= 0) {
        e.preventDefault();
        handlePick(suggestions[highlightIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className={`${styles.searchWrapper} ${styles[size]} ${className}`}>
      <form className={styles.form} onSubmit={handleSearch}>
        <Search className={styles.searchIcon} />
        <input
          type="search"
          placeholder="Search medicine (e.g., Paracetamol)"
          className={styles.searchMed}
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            setHighlightIndex(0);
            if (value.trim().length < 2) {
              setSuggestions([]);
              setSearching(false);
              setShowSuggestions(false);
            }
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
      </form>

      {showSuggestions && query.trim().length >= 2 && (
        <ul className={styles.suggestionList}>
          {searching && suggestions.length === 0 ? (
            <li className={styles.suggestionEmpty}>Searching...</li>
          ) : suggestions.length === 0 ? (
            <li className={styles.suggestionEmpty}>
              No exact match. Press Enter to see similar medicines.
            </li>
          ) : (
            suggestions.map((med, idx) => (
              <li
                key={med.id}
                className={idx === highlightIndex ? styles.suggestionActive : ''}
                onMouseDown={() => handlePick(med)}
                onMouseEnter={() => setHighlightIndex(idx)}
              >
                <span className={styles.suggestionName}>{med.name}</span>
                {med.generic_name && (
                  <span className={styles.suggestionMeta}>{med.generic_name}</span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
