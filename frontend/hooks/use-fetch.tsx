'use client';

import { useEffect, useState } from 'react';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface FetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// Set up Axios defaults — these settings will apply to all requests made with Axios.
axios.defaults.baseURL = process.env.API_URL ?? 'http://localhost:8000/v1';
axios.defaults.withCredentials = true; // Ensures cookies (including your HttpOnly JWT cookie) are sent.
axios.defaults.withXSRFToken = true // Ensures the XSRF token is sent.
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

export default function useFetch<T = any>(routeURL: string): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    // Ensure the route starts with '/' so it joins correctly with the base URL.
    const url = routeURL.startsWith('/') ? routeURL : `/${routeURL}`;

    const fetchData = async () => {
      try {
        const response = await axios.get<T>(url);
        if (isMounted) {
          setData(response.data);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('❌ AXIOS ERROR ----------->', err);
          setError(err.response?.data?.message || err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [routeURL]);

  return { data, error, loading };
}
