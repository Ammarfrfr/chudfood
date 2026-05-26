import { useState } from 'react';
import { searchDishes } from '../api/index';

export const useSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') return;

    setLoading(true);
    setError(null);
    try {
      const data = await searchDishes(searchQuery);
      if (data.success) {
        setResults(data.results || []);
      } else {
        setError(data.message || 'Search failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, executeSearch };
};

