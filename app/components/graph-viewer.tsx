"use client";

import React, { useEffect, useState } from 'react';

export default function GraphViewer() {
  const [graph, setGraph] = useState<string | null>(null);

  useEffect(() => {
  fetch(`/api/proxy?path=/api/graph`)
      .then((r) => { if (!r.ok) throw new Error('Graph not found'); return r.text(); })
      .then((t) => setGraph(t))
      .catch(() => setGraph(null));
  }, []);

  if (graph === null) return <div>No graph available</div>;
  return (
    <div>
      <h3>GraphML output</h3>
      <pre style={{ maxHeight: '400px', overflow: 'auto' }}>{graph}</pre>
    </div>
  );
}
