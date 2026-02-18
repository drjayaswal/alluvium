// API request caching and deduplication utility
const cache = new Map<string, { data: any; timestamp: number; promise?: Promise<any> }>();
const CACHE_TTL = 60000; // 1 minute default
const DEDUPE_WINDOW = 1000; // 1 second for request deduplication

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key?: string; // Custom cache key
  dedupe?: boolean; // Enable request deduplication
}

/**
 * Cached fetch with request deduplication
 */
export async function cachedFetch(
  url: string,
  options?: RequestInit,
  cacheOptions: CacheOptions = {}
): Promise<Response> {
  const {
    ttl = CACHE_TTL,
    key = url + JSON.stringify(options),
    dedupe = true,
  } = cacheOptions;

  const now = Date.now();
  const cached = cache.get(key);

  // Return cached data if still valid
  if (cached && (now - cached.timestamp) < ttl) {
    return new Response(JSON.stringify(cached.data), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Deduplicate concurrent requests
  if (dedupe && cached?.promise) {
    const data = await cached.promise;
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Make the request
  const promise = fetch(url, options)
    .then(async (res) => {
      const data = await res.json();
      cache.set(key, { data, timestamp: now });
      return data;
    })
    .catch((error) => {
      cache.delete(key);
      throw error;
    });

  if (dedupe) {
    cache.set(key, { data: null, timestamp: now, promise });
  }

  const data = await promise;
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Clear cache for a specific key or all cache
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Get cached data synchronously (if available)
 */
export function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  const age = now - cached.timestamp;
  const ttl = CACHE_TTL; // Use default TTL for now
  
  if (age < ttl) {
    return cached.data as T;
  }
  
  cache.delete(key);
  return null;
}
