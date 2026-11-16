import { useEffect, useState } from "react";

/* =========================================================
   STALE-WHILE-REVALIDATE DATA CACHE

   Public pages render instantly from the last copy saved in
   localStorage, then refresh silently from Supabase. Identical
   requests made at the same time share a single network call.
========================================================= */

const PREFIX = "pf-cache:v1:";

const memory = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

function isEmpty(value: unknown) {
  return (
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0)
  );
}

export function readCache<T>(key: string): T | undefined {
  if (memory.has(key)) {
    return memory.get(key) as T;
  }

  try {
    const raw = localStorage.getItem(PREFIX + key);

    if (raw === null) {
      return undefined;
    }

    const value = JSON.parse(raw) as T;
    memory.set(key, value);
    return value;
  } catch {
    return undefined;
  }
}

function writeCache(key: string, value: unknown) {
  memory.set(key, value);

  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: memory cache still works */
  }
}

function dropCache(key: string) {
  memory.delete(key);

  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

/*
  Fetches fresh data, de-duplicating concurrent calls.

  Most services swallow errors and return [] / null, so an
  empty result cannot be told apart from a failed request.
  When we already hold non-empty data we keep showing it for
  this visit, but clear the stored copy so the next visit
  starts fresh.
*/
export function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const running = inflight.get(key);

  if (running) {
    return running as Promise<T>;
  }

  const request = fetcher()
    .then((fresh) => {
      const previous = readCache<T>(key);

      if (isEmpty(fresh) && !isEmpty(previous)) {
        dropCache(key);
        memory.set(key, previous);
        return previous as T;
      }

      writeCache(key, fresh);
      return fresh;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, request);
  return request;
}

/* Starts a request early (e.g. before a page's code loads). */
export function prefetch<T>(
  key: string,
  fetcher: () => Promise<T>
) {
  void cachedFetch(key, fetcher).catch(() => {});
}

/* =========================================================
   HOOK
========================================================= */

export function useCachedData<T>(
  key: string | null,
  fetcher: () => Promise<T>
) {
  const [data, setData] = useState<T | undefined>(() =>
    key ? readCache<T>(key) : undefined
  );

  const [loading, setLoading] = useState(
    () => key !== null && data === undefined
  );

  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!key) {
      return;
    }

    let active = true;

    const cached = readCache<T>(key);

    setData(cached);
    setLoading(cached === undefined);
    setError(null);

    cachedFetch(key, fetcher)
      .then((fresh) => {
        if (active) {
          setData(fresh);
        }
      })
      .catch((err) => {
        console.error(`Failed to load "${key}":`, err);

        if (active) {
          setError(err);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
    // fetcher is intentionally excluded: callers pass inline functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading, error };
}
