export default async function handler(req, res) {
  const { path } = req.query;
  if (!path) {
    res.status(400).json({ error: 'path query param required' });
    return;
  }
  const API_BASE = process.env.NEXT_PUBLIC_MICROSERVICE_URL || 'http://localhost:8001';
  const target = `${API_BASE}${path}`;
  try {
    const fetchRes = await fetch(target, {
      method: req.method,
      headers: { ...req.headers, host: new URL(API_BASE).host },
      body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
    });
    const text = await fetchRes.text();
    res.status(fetchRes.status);
    // forward content-type
    const ct = fetchRes.headers.get('content-type');
    if (ct) res.setHeader('content-type', ct);
    res.send(text);
  } catch (e) {
    res.status(502).json({ error: 'Bad gateway', details: String(e) });
  }
}
