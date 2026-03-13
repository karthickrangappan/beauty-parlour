import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

      // Apply Collection
      if (filters.collectionId && filters.collectionId !== 'all') {
        constraints.push(where('collection', '==', filters.collectionId));
      }

      // Apply Categories - Firestore allows 'in' up to 10 items
      if (filters.categories && filters.categories.length > 0) {
        constraints.push(where('category', 'in', filters.categories));
      }

      // We cannot easily do both inequality filter on price AND another field locally
      // We will do it locally due to Firestore constraints.

      let firestoreQuery = query(q, ...constraints, limit(12));

      if (isNextPage && lastDocRef.current) {
        firestoreQuery = query(q, ...constraints, startAfter(lastDocRef.current), limit(12));
      }

      const snapshot = await getDocs(firestoreQuery);
      let fetchedDocs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Local Filter for Price & Rating (to avoid composite index issues)
      if (filters.priceRange) {
        fetchedDocs = fetchedDocs.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
      }
      if (filters.minRating > 0) {
        fetchedDocs = fetchedDocs.filter(p => p.rating >= filters.minRating);
      }

      // Local Filter for Search
      if (debouncedSearch) {
        const lowerSearch = debouncedSearch.toLowerCase();
        fetchedDocs = fetchedDocs.filter(p => 
          p.name?.toLowerCase().includes(lowerSearch) || 
          p.tags?.some(tag => tag.toLowerCase().includes(lowerSearch))
        );
      }

      lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];
      
      // If fewer than 12 docs returned from Firebase, hasMore is false
      setHasMore(snapshot.docs.length === 12);
      
      setProducts(prev => isNextPage ? [...prev, ...fetchedDocs] : fetchedDocs);
    } catch (err) {
      console.error("Error loading products", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    filters.collectionId, 
    // Need to primitive stringify categories array:
    filters.categories?.join(','), 
    filters.priceRange?.[0], 
    filters.priceRange?.[1], 
    filters.minRating, 
    debouncedSearch
  ]);

  useEffect(() => {
    // Reset products and fetch first page on filter change
    lastDocRef.current = null;
    fetchProducts(false);
  }, [fetchProducts]);

  return { products, loading, error, hasMore, loadMore: () => fetchProducts(true) };
};
