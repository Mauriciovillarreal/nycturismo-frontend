import { useEffect, useState } from 'react';

function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const request = async () => {
      try {
        const response = await fetcher();
        if (mounted) setData(response.data);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    request();
    return () => {
      mounted = false;
    };
  }, deps);

  return { data, loading, error };
}

export default useFetch;
