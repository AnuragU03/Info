# Tourism Data Microservice

This microservice simulates live tourism data (as in your Jupyter notebook) and exposes it via a FastAPI API for integration with your Next.js app.

## Setup

1. **Install dependencies:**

```bash
pip install -r requirements.txt
```

2. **Run the service:**

```bash
uvicorn main:app --reload --port 8001
```

3. **API Endpoint:**

- `GET /generate-tourism-data` — Returns simulated tourism data (JSON)

## Integration

- The Next.js app can fetch data from `http://localhost:8001/generate-tourism-data`.

## Next Steps

- The endpoint will be updated to return realistic, India-focused tourism data as per the notebook logic. 

## Village endpoints (added)

- `GET /api/villages` — returns `merged_villages.json` if present (falls back to microservice root)
- `GET /api/villages/search?q=...` — search villages by name/state/attractions/activities
- `GET /api/graph` — returns `village_knowledge_graph.graphml` for visualization

Frontend integration notes:
- The Next.js components in `app/components` call the microservice at `http://localhost:8001` by default. To change the URL set `NEXT_PUBLIC_MICROSERVICE_URL` in your Next.js environment.