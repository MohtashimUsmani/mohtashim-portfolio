import { useEffect, useState } from 'react';

import { fetchJson } from '../api/client';

const normalizePayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.value)) return payload.value;
  return payload;
};

const useApiData = (path, initialValue, options = {}) => {
  const {
    pollIntervalMs = 15000,
    enabled = true,
    refetchOnFocus = true,
    select,
  } = options;
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    let isMounted = true;
    let pollId;

    const load = async () => {
      setLoading(true);
      try {
        const rawPayload = await fetchJson(path);
        const normalized = normalizePayload(rawPayload);
        const payload = select ? select(normalized) : normalized;
        if (!isMounted) return;
        setData(payload);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    const onFocus = () => {
      if (refetchOnFocus) {
        load();
      }
    };

    load();

    if (pollIntervalMs > 0) {
      pollId = setInterval(load, pollIntervalMs);
    }

    if (refetchOnFocus) {
      window.addEventListener('focus', onFocus);
    }

    return () => {
      isMounted = false;
      if (pollId) clearInterval(pollId);
      if (refetchOnFocus) {
        window.removeEventListener('focus', onFocus);
      }
    };
  }, [path, pollIntervalMs, enabled, refetchOnFocus, select]);

  return { data, loading, error };
};

export default useApiData;
