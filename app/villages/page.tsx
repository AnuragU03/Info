import React from 'react';
import VillageSearch from '../components/village-search';
import GraphViewer from '../components/graph-viewer';

export default function Page() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Villages</h1>
      <VillageSearch />
      <hr />
      <GraphViewer />
    </div>
  );
}
