"use client";

import React, { useState } from 'react';

export default function VillageSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function doSearch() {
    setLoading(true);
    try {
  const res = await fetch(`/api/proxy?path=/api/villages/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search villages, attractions, activities" />
        <button onClick={doSearch} disabled={loading || !q}>Search</button>
      </div>
      {loading && <div>Loading…</div>}
      <ul>
        {results.map((v, i) => (
          <li key={i}>
            <strong>{v.village_name}</strong> — {v.state} — {v.city} — {v.latitude}, {v.longitude}
            <div>Attractions: {(v.primary_attractions || []).join(', ')}</div>
            <div>Activities: {(v.activities || []).join(', ')}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
