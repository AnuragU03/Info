import requests
import json
import pandas as pd
import time
import networkx as nx
import os
from dotenv import load_dotenv
import sys
import os

# Add parent dir to path to allow absolute imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


load_dotenv()

# Import RAG functions
from rag_search_with_realtime_update import enrich_from_serpapi_and_gemini

MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN", "pk.eyJ1IjoiMjJ1MTYzOSIsImEiOiJjbWN6cWc5OGsweDdhMmxwdDV2a2VtaWpmIn0.Q1HTd_oCEFDP2v_qyhYd6Q")
MAPQUEST_API_KEY = os.getenv("MAPQUEST_API_KEY", "w8wEUww9j74XlTzphdpKVeYJJiQl1xuW")

SEARCH_URL_MAPBOX = "https://api.mapbox.com/geocoding/v5/mapbox.places/{}.json"
SEARCH_URL_MAPQUEST = "http://www.mapquestapi.com/search/v4/place"

search_config = {
    "Rajasthan": ["rural", "desert", "heritage", "camel", "haveli"],
    "Kerala": ["backwater", "spice", "plantation", "village", "tribal"],
    "Himachal Pradesh": ["mountain", "valley", "apple orchard", "monastery", "trekking"],
    "Uttarakhand": ["himalayan", "organic", "nature", "yoga", "ashram"],
    "Gujarat": ["rann of kutch", "handicraft", "tribal", "textile", "rural"],
    "Maharashtra": ["agro tourism", "rural", "farm stay", "tribal", "fort"],
    "Karnataka": ["coffee plantation", "rural", "heritage", "temple", "nature"],
    "Tamil Nadu": ["chettinad", "temple", "rural", "traditional", "craft"],
    "West Bengal": ["sundarbans", "rural", "tea garden", "tribal", "heritage"],
    "Meghalaya": ["living root bridge", "cleanest village", "tribal", "cave", "waterfall"]
}

def search_mapbox(state, keyword):
    query = f"{keyword} village tourism {state} India"
    url = SEARCH_URL_MAPBOX.format(query)
    params = {"access_token": MAPBOX_TOKEN, "limit": 10, "country": "IN"}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json().get("features", [])
    return []

def search_mapquest(state, keyword):
    query = f"{keyword} village tourism {state} India"
    params = {"location": "India", "q": query, "sort": "relevance", "feedback": "false", "key": MAPQUEST_API_KEY, "limit": 10}
    response = requests.get(SEARCH_URL_MAPQUEST, params=params)
    if response.status_code == 200:
        return response.json().get("results", [])
    return []

def collect_initial_data():
    all_villages = []
    for state, keywords in search_config.items():
        for keyword in keywords:
            # Mapbox
            for feature in search_mapbox(state, keyword):
                all_villages.append({
                    "name": feature.get("text"),
                    "state": state,
                    "address": feature.get("place_name"),
                    "lat": feature.get("center", [None, None])[1],
                    "lng": feature.get("center", [None, None])[0],
                    "source": "mapbox"
                })
            # Mapquest
            for place in search_mapquest(state, keyword):
                all_villages.append({
                    "name": place.get("name"),
                    "state": state,
                    "address": place.get("displayString"),
                    "lat": place.get("place", {}).get("geometry", {}).get("coordinates", [None, None])[1] if place.get("place") else None,
                    "lng": place.get("place", {}).get("geometry", {}).get("coordinates", [None, None])[0] if place.get("place") else None,
                    "source": "mapquest"
                })
            time.sleep(0.5)

    unique_villages = {(v["name"], v["state"]): v for v in all_villages if v.get('name')}
    return list(unique_villages.values())

def run_rag_and_update(villages):
    # The RAG function now uses env vars directly
    for village in villages:
        query = f"{village['name']}, {village['state']}"
        enrichment = enrich_from_serpapi_and_gemini(query)
        village.update(enrichment)
        time.sleep(1) # Avoid hitting rate limits
    return villages

def build_graph(villages):
    G = nx.Graph()
    for v in villages:
        node_id = v['name']
        v_for_graph = v.copy()
        for k in ['primary_attractions', 'local_specialties', 'activities']:
            if k in v_for_graph and isinstance(v_for_graph[k], list):
                v_for_graph[k] = ', '.join(str(x) for x in v_for_graph[k])
        G.add_node(node_id, **v_for_graph)
    return G

if __name__ == "__main__":
    print("Step 1: Collecting initial data from Mapbox and Mapquest...")
    initial_data = collect_initial_data()
    # Removed limiter; process all villages
    print(f"Collected {len(initial_data)} unique villages.")

    print("\nStep 2: Enriching data with RAG model (SerpAPI + Gemini)...")
    enriched_data = run_rag_and_update(initial_data)

    print("\nStep 3: Building knowledge graph...")
    village_graph = build_graph(enriched_data)
    print(f"Graph created with {village_graph.number_of_nodes()} nodes.")

    # Save final dataset and graph
    os.makedirs("../data", exist_ok=True)
    with open("../data/final_village_dataset.json", "w", encoding="utf-8") as f:
        json.dump(enriched_data, f, indent=2, ensure_ascii=False)
    os.makedirs("../models", exist_ok=True)
    nx.write_graphml(village_graph, "../models/final_village_knowledge_graph.graphml")

    print("\nPipeline complete! Final dataset and graph saved.")