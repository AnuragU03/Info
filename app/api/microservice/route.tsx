import { NextResponse } from 'next/server';

const MICROSERVICE_BASE = process.env.MICROSERVICE_INTERNAL_URL || 'http://localhost:8001';

// Generic proxy handler that forwards requests to the python microservice
function buildTarget(request: Request) {
  const url = new URL(request.url);
  // Keep the path after /api/microservice
  const path = url.pathname.replace('/api/microservice', '') || '/';
  return `${MICROSERVICE_BASE}${path}${url.search}`;
}

async function buildHeaders(request: Request) {
  const headers = new Headers(request.headers as any);
  // Ensure content-type when body present
  if (!headers.get('content-type')) {
    headers.set('content-type', 'application/json');
  }
  headers.set('x-internal-proxy', process.env.MICROSERVICE_SHARED_SECRET || 'dev-secret');
  return headers;
}

export async function POST(request: Request) {
  const target = buildTarget(request);
  const headers = await buildHeaders(request);
  const resp = await fetch(target, {
    method: 'POST',
    headers,
    body: await request.text(),
  });
  try {
    const body = await resp.text();
    return new NextResponse(body, { status: resp.status, headers: resp.headers as any });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: 'Microservice unreachable', detail: String(err) }), { status: 502, headers: { 'content-type': 'application/json' } });
  }
}

export async function GET(request: Request) {
  const target = buildTarget(request);
  const headers = await buildHeaders(request);
  const resp = await fetch(target, { method: 'GET', headers });
  try {
    const body = await resp.text();
    return new NextResponse(body, { status: resp.status, headers: resp.headers as any });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: 'Microservice unreachable', detail: String(err) }), { status: 502, headers: { 'content-type': 'application/json' } });
  }
}
