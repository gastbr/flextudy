'use client';

import { useEffect, useState } from 'react';

interface FetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export default function useFetch<T = any>(url: string): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Example: if your token is stored in localStorage
        const token = localStorage.getItem('token');

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          // If using cookies for auth:
          // credentials: 'include',
          cache: 'no-store',
        });

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || `API error: ${res.status}`);
        }
        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [url]);

  return { data, error, loading };
}
