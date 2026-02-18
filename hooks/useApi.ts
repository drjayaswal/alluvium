import { useState, useCallback, useRef } from 'react';
import { getBaseUrl } from '@/lib/utils';
import { cachedFetch, clearCache } from '@/lib/api-cache';

interface UseApiOptions {
  cache?: boolean;
  cacheTTL?: number;
  dedupe?: boolean;
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const { cache = true, cacheTTL = 60000, dedupe = true } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (
      endpoint: string,
      fetchOptions?: RequestInit,
      customOptions?: UseApiOptions
    ): Promise<T | null> => {
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const url = `${getBaseUrl()}${endpoint}`;
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...fetchOptions?.headers,
        };

        const finalOptions: RequestInit = {
          ...fetchOptions,
          headers,
          signal,
        };

        let response: Response;
        if (customOptions?.cache ?? cache) {
          response = await cachedFetch(url, finalOptions, {
            ttl: customOptions?.cacheTTL ?? cacheTTL,
            dedupe: customOptions?.dedupe ?? dedupe,
          });
        } else {
          response = await fetch(url, finalOptions);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data as T;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return null; // Request was cancelled
        }
        setError(err);
        throw err;
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [cache, cacheTTL, dedupe]
  );

  const clearCacheForEndpoint = useCallback((endpoint: string) => {
    clearCache(endpoint);
  }, []);

  return {
    fetchData,
    loading,
    error,
    clearCache: clearCacheForEndpoint,
  };
}
