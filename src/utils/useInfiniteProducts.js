import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const useInfiniteProducts = (filters) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  
  const lastDocRef = useRef(null);
  const debouncedSearch = useDebounce(filters.searchText || '', 300);

  const fetchProducts = useCallback(async (isNextPage = false) => {
    setLoading(true);
    setError(null);
    try {
      let q = collection(db, 'products');
      let constraints = [where('isActive', '==', true)];

      if (filters.collectionId && filters.collectionId !== 'all') {
        constraints.push(where('collection', '==', filters.collectionId));
      }

      if (filters.categories && filters.categories.length > 0) {
        constraints.push(where('category', 'in', filters.categories));
      }

      let fetchedDocs = [];
      let lastDoc = null;
      let hasMoreResults = false;

      try {

        const firestoreQuery = query(
          q, 
          ...constraints, 
          orderBy('createdAt', 'desc'), 
          limit(12),
          ...(isNextPage && lastDocRef.current ? [startAfter(lastDocRef.current)] : [])
        );
        
        const snapshot = await getDocs(firestoreQuery);
        fetchedDocs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        lastDoc = snapshot.docs[snapshot.docs.length - 1];
        hasMoreResults = snapshot.docs.length === 12;

      } catch (err) {
        console.warn("Falling back to local sort due to missing index", err);

        const fallbackQuery = query(q, ...constraints, limit(40));
        const snapshot = await getDocs(fallbackQuery);
        fetchedDocs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        fetchedDocs.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
        hasMoreResults = false;
      }


      if (filters.priceRange) {
        fetchedDocs = fetchedDocs.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
      }
      if (filters.minRating > 0) {
        fetchedDocs = fetchedDocs.filter(p => p.rating >= filters.minRating);
      }
      if (debouncedSearch) {
        const lowerSearch = debouncedSearch.toLowerCase();
        fetchedDocs = fetchedDocs.filter(p => 
          p.name?.toLowerCase().includes(lowerSearch) || 
          p.tags?.some(tag => tag.toLowerCase().includes(lowerSearch))
        );
      }


      lastDocRef.current = lastDoc;
      setHasMore(hasMoreResults);
      setProducts(prev => isNextPage ? [...prev, ...fetchedDocs] : fetchedDocs);
    } catch (err) {
      console.error("Error loading products", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    filters.collectionId, 
    filters.categories?.join(','), 
    filters.priceRange?.[0], 
    filters.priceRange?.[1], 
    filters.minRating, 
    debouncedSearch
  ]);

  useEffect(() => {

    lastDocRef.current = null;
    fetchProducts(false);
  }, [fetchProducts]);

  return { products, loading, error, hasMore, loadMore: () => fetchProducts(true) };
};
