import { useState, useEffect, useCallback, useRef } from 'react';
import type { AxiosRequestConfig, Method, AxiosError } from 'axios';
import api from '../lib/axios';

interface UseFetchOptions<TBody> {
  method: Method;
  url: string;
  body?: TBody;
  config?: AxiosRequestConfig;
  immediate?: boolean;
}

function useFetch<TResponse = any, TBody = any>({
  method,
  url,
  body,
  config,
  immediate = false,
}: UseFetchOptions<TBody>) {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const mounted = useRef(true);

  const execute = useCallback(
    async (overrideBody?: TBody) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.request<TResponse>({
          method,
          url,
          data: overrideBody ?? body,
          ...config,
        });
        if (mounted.current) setData(res.data);
        return res.data;
      } catch (err) {
        const axiosErr = err as AxiosError;
        if (mounted.current) setError(axiosErr);
        throw axiosErr;
      } finally {
        if (mounted.current) setLoading(false);
      }
    },
    [method, url, body, config]
  );

  useEffect(() => {
    mounted.current = true;
    if (immediate && method.toLowerCase() === 'get') {
      execute();
    }
    return () => {
      mounted.current = false;
    };
  }, [execute, immediate, method]);

  return { fetch: data, error, loading, execute };
}


export function useGet<TResponse = any>(
  url: string,
  config?: AxiosRequestConfig,
  immediate: boolean = true
) {
  return useFetch<TResponse>({
    method: 'GET',
    url,
    config,
    immediate,
  });
}

export function usePost<TResponse = any, TBody = any>(
  url: string,
  config?: AxiosRequestConfig
) {
  return useFetch<TResponse, TBody>({
    method: 'POST',
    url,
    config,
    immediate: false, // don't call on mount
  });
}

export function usePut<TResponse = any, TBody = any>(
  url: string,
  config?: AxiosRequestConfig
) {
  return useFetch<TResponse, TBody>({
    method: 'PUT',
    url,
    config,
    immediate: false,
  });
}

export function usePatch<TResponse = any, TBody = any>(
  url: string,
  config?: AxiosRequestConfig
) {
  return useFetch<TResponse, TBody>({
    method: 'PATCH',
    url,
    config,
    immediate: false,
  });
}

export function useDelete<TResponse = any, TBody = any>(
  url: string,
  config?: AxiosRequestConfig
) {
  return useFetch<TResponse, TBody>({
    method: 'DELETE',
    url,
    config,
    immediate: false,
  });
}
