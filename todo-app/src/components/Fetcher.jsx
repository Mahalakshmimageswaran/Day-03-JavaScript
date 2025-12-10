import React, { useState, useEffect } from 'react';

export default function Fetcher({ url = 'https://jsonplaceholder.typicode.com/todos', renderItem }){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText || 'Fetch error');
        return res.json();
      })
      .then(json => { if (!cancelled) setData(json); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [url]);

  if (loading) return <div className="p-3">Loading…</div>;
  if (error) return <div className="p-3 text-red-500">Error: {error}</div>;
  if (!data) return null;

  const list = Array.isArray(data) ? data.slice(0,5) : [data];

  return (
    <div className="p-3 bg-white rounded shadow">
      <ul className="space-y-2 text-sm">
        {list.map((it, i) => (
          <li key={i} className="truncate">
            {renderItem ? renderItem(it) : (it.title || JSON.stringify(it))}
          </li>
        ))}
      </ul>
    </div>
  );
}
