from fastapi import FastAPI, Query, HTTPException  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from pydantic import BaseModel  # type: ignore
from typing import List
import uvicorn  # type: ignore


from rag_search_with_realtime_update import enrich_from_serpapi_and_gemini
import subprocess
import networkx as nx
import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

app = FastAPI()

from fastapi import Request, Depends  # type: ignore


def verify_proxy(request: Request):
    """Require matching x-internal-proxy header if MICROSERVICE_SHARED_SECRET is set."""
    secret = os.environ.get('MICROSERVICE_SHARED_SECRET')
    if secret:
        header = request.headers.get('x-internal-proxy')
        if header != secret:
            raise HTTPException(status_code=403, detail='Forbidden')
    return True

# Configure CORS from environment. In dev, if MICROSERVICE_ALLOWED_ORIGINS is not set,
# allow all origins (no credentials) so the Next.js dev server can call the microservice.
allowed = os.environ.get('MICROSERVICE_ALLOWED_ORIGINS')
if allowed:
    origins = [o.strip() for o in allowed.split(',') if o.strip()]
    allow_credentials = True
else:
    # permissive dev defaults
    origins = ["*"]
    allow_credentials = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# In some dev environments the CORSMiddleware may not add the ACAO header as expected;
# add a fallback middleware that sets a permissive ACAO header when no explicit origins set.
if not os.environ.get('MICROSERVICE_ALLOWED_ORIGINS'):
    @app.middleware("http")
    async def _add_dev_cors(request, call_next):
        resp = await call_next(request)
        # Only set ACAO for regular responses (not for preflight which CORSMiddleware handles)
        resp.headers.setdefault('Access-Control-Allow-Origin', '*')
        return resp

class SearchRequest(BaseModel):
    query: str

class EnrichmentResponse(BaseModel):
    primary_attractions: List[str]
    local_specialties: List[str]
    activities: List[str]

@app.get("/health")
def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy", "service": "village-rag-microservice"}

@app.post("/run-pipeline")
def run_pipeline(request: Request, _ok: bool = Depends(verify_proxy)):
    # It's better to run this as a background task in a real app
    process = subprocess.Popen(["python", "scripts/run_pipeline.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    if process.returncode == 0:
        return {"status": "Pipeline completed successfully", "output": stdout.decode()}
    else:
        return {"status": "Pipeline failed", "error": stderr.decode()}

@app.post("/search", response_model=EnrichmentResponse)
def search_village(request: Request, data: SearchRequest, _ok: bool = Depends(verify_proxy)):
    try:
        G = nx.read_graphml("models/final_village_knowledge_graph.graphml")
    except FileNotFoundError:
        return {"error": "Knowledge graph not found. Please run the pipeline first."}

    query = data.query.lower()
    # Simple search for now, can be improved with vector search
    for node in G.nodes(data=True):
        if query in node[0].lower():
            return {
                "primary_attractions": node[1].get('primary_attractions', '').split(', '),
                "local_specialties": node[1].get('local_specialties', '').split(', '),
                "activities": node[1].get('activities', '').split(', '),
            }
    # If not found in graph, use RAG enrichment
    enrichment = enrich_from_serpapi_and_gemini(data.query)
    return enrichment

# --- Villages ---
@app.get("/api/villages")
def get_villages():
    path = os.path.join(DATA_DIR, "merged_villages.json")
    if not os.path.exists(path):
        # Fall back to microservice root merged_villages.json if pipeline wrote there
        alt = os.path.join(os.path.dirname(__file__), 'merged_villages.json')
        if os.path.exists(alt):
            path = alt
        else:
            return []
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    return data


@app.get('/api/villages/search')
def search_villages(q: str = Query(..., description="Query string to search villages")):
    """Search villages by name, state, attractions or activities and return matching entries."""
    villages = get_villages()
    ql = q.lower()
    results = []
    for v in villages:
        if ql in (v.get('village_name') or '').lower() or ql in (v.get('state') or '').lower():
            results.append(v)
            continue
        # check attractions/activities (they may be lists)
        for field in ['primary_attractions', 'activities', 'local_specialties']:
            val = v.get(field, '')
            if isinstance(val, list):
                joined = ' '.join(val).lower()
            else:
                joined = str(val).lower()
            if ql in joined:
                results.append(v)
                break
    return results


@app.get('/api/graph')
def get_graph():
    """Return the GraphML file content for visualization (if present)."""
    # Prefer the graph in data dir, then repo root microservice path
    candidates = [os.path.join(DATA_DIR, 'village_knowledge_graph.graphml'), os.path.join(os.path.dirname(__file__), 'village_knowledge_graph.graphml')]
    for p in candidates:
        if os.path.exists(p):
            with open(p, 'r', encoding='utf-8') as f:
                return f.read()
    raise HTTPException(status_code=404, detail='Graph not found')

@app.get("/api/villages/{village_id}")
def get_village_by_id(village_id: str):
    with open(os.path.join(DATA_DIR, "merged_villages.json"), encoding="utf-8") as f:
        data = json.load(f)
    for v in data:
        if v.get("village_id") == village_id:
            return v
    raise HTTPException(status_code=404, detail="Village not found")

# --- Internships ---
@app.get("/api/internships")
def get_internships():
    with open(os.path.join(DATA_DIR, "internships.json"), encoding="utf-8") as f:
        data = json.load(f)
    return data

@app.get("/api/internships/{internship_id}")
def get_internship_by_id(internship_id: str):
    with open(os.path.join(DATA_DIR, "internships.json"), encoding="utf-8") as f:
        data = json.load(f)
    for i in data:
        if i.get("id") == internship_id:
            return i
    raise HTTPException(status_code=404, detail="Internship not found")

# --- Kirana Stores ---
@app.get("/api/kirana-stores")
def get_kirana_stores():
    with open(os.path.join(DATA_DIR, "kirana_stores.json"), encoding="utf-8") as f:
        data = json.load(f)
    return data

# --- Bookings ---
@app.get("/api/bookings")
def get_bookings(ownerId: str = None):
    with open(os.path.join(DATA_DIR, "bookings.json"), encoding="utf-8") as f:
        data = json.load(f)
    if ownerId:
        data = [b for b in data if b.get("ownerId") == ownerId]
    return data

# --- Applications ---
@app.get("/api/applications")
def get_applications(userId: str = None):
    with open(os.path.join(DATA_DIR, "applications.json"), encoding="utf-8") as f:
        data = json.load(f)
    if userId:
        data = [a for a in data if a.get("userId") == userId]
    return data

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)