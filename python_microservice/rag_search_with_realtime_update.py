import os
from dotenv import load_dotenv
import json
import requests
import re
import networkx as nx

ENRICHMENT = ' new hidden places with social media buzz with fun activities and attractions'

load_dotenv()

# Read API keys after loading .env so local development keys are picked up
SERPAPI_KEY = os.getenv('SERPAPI_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')



def call_serpapi(query):
    # If API key is not provided, skip calling SerpAPI and return None so callers can fallback.
    if not SERPAPI_KEY:
        print('[SerpAPI] SERPAPI_KEY not set; skipping SerpAPI call and using fallback data')
        return None
    url = 'https://serpapi.com/search.json'
    params = {
        'engine': 'google',
        'q': query,
        'api_key': SERPAPI_KEY,
        'num': 10
    }
    resp = requests.get(url, params=params)
    if resp.status_code == 200:
        return resp.json()
    else:
        # For 401/403, give a clear message about the key being invalid/permissions
        if resp.status_code in (401, 403):
            print(f'[SerpAPI] Authentication/permission error ({resp.status_code}). Check SERPAPI_KEY and account permissions.')
        else:
            print(f'[SerpAPI Error] {resp.status_code}: {resp.text}')
        return None

def call_gemini(query):
    # If GEMINI_API_KEY isn't set, skip the Gemini call and return None so callers can fallback.
    if not GEMINI_API_KEY:
        print('[Gemini] GEMINI_API_KEY not set; skipping Gemini call and using fallback data')
        return None
    url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
    headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
    }
    data = {
        'contents': [
            {
                'parts': [
                    {'text': query}
                ]
            }
        ]
    }
    resp = requests.post(url, headers=headers, data=json.dumps(data))
    if resp.status_code == 200:
        return resp.json()
    else:
        if resp.status_code in (401, 403):
            print(f'[Gemini] Authentication/permission error ({resp.status_code}). Check GEMINI_API_KEY and Cloud permissions.')
        else:
            print(f'[Gemini Error] {resp.status_code}: {resp.text}')
        return None

def enrich_from_serpapi_and_gemini(query):
    full_prompt = query + ENRICHMENT
    print(f"[Enrichment] Using SerpAPI and Gemini for '{full_prompt}'...")
    serpapi_results = call_serpapi(full_prompt)
    snippets = []
    if serpapi_results and 'organic_results' in serpapi_results:
        snippets = [item.get('snippet', '') for item in serpapi_results['organic_results'] if 'snippet' in item]
    elif serpapi_results:
        snippets = [str(serpapi_results)[:500]]
    # Gemini prompt (unchanged)
    gemini_input = (
        f"You are an expert travel data extractor for a rural tourism platform.\n"
        f"Given these web snippets about \"{query}\", extract and summarize the following information as accurately as possible:\n"
        f"- \"primary_attractions\": List of the most important or unique tourist attractions (e.g., temples, viewpoints, natural wonders, heritage sites) in or near the village/place.\n"
        f"- \"local_specialties\": List of unique foods, crafts, or cultural specialties the village/place is known for.\n"
        f"- \"activities\": List of fun or popular activities for tourists (e.g., trekking, festivals, workshops, adventure sports, local experiences).\n"
        f"Return ONLY a valid JSON object with these three keys: primary_attractions, local_specialties, activities.\n"
        f"Do not include any explanation, extra text, or formatting outside the JSON object.\n\n"
        f"Snippets:\n" + "\n".join(snippets)
    )
    print("\n[Gemini Prompt Sent]:\n" + gemini_input[:2000] + ("..." if len(gemini_input) > 2000 else ""))
    gemini_results = call_gemini(gemini_input)
    if gemini_results:
        print("\n[Raw Gemini Response]:\n", gemini_results)
    else:
        print("[Gemini] No response from Gemini (skipped or errored). Will use fallback data if needed.")
    # Initialize default enrichment
    enrichment = {
        'primary_attractions': [],
        'local_specialties': [],
        'activities': [],
    }
    if gemini_results:
        try:
            # Extract text from response structure
            text = None
            if isinstance(gemini_results, dict) and 'candidates' in gemini_results:
                text = gemini_results['candidates'][0]['content']['parts'][0]['text']
            elif isinstance(gemini_results, str):
                text = gemini_results
            if text:
                # Extract JSON from markdown code blocks if present
                match = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", text, re.IGNORECASE)
                if match:
                    json_text = match.group(1).strip()
                else:
                    json_text = text.strip()
                # Parse the JSON
                parsed_data = json.loads(json_text)
                if isinstance(parsed_data, dict):
                    enrichment = parsed_data
                    print("[Gemini Success] Successfully parsed enrichment data")
        except json.JSONDecodeError as e:
            print(f"[JSON Parse Error] {e}")
            if 'json_text' in locals():
                print(f"[JSON Text]: {json_text[:200]}...")
        except KeyError as e:
            print(f"[Response Structure Error] Missing key: {e}")
            print(f"[Response Keys]: {gemini_results.keys() if isinstance(gemini_results, dict) else 'Not a dict'}")
        except Exception as e:
            print(f"[Gemini Parse Error] {type(e).__name__}: {e}")
    # Ensure all required keys exist and are lists
    for k in ['primary_attractions', 'local_specialties', 'activities']:
        if k not in enrichment or not isinstance(enrichment[k], list):
            enrichment[k] = []
    # If both SerpAPI and Gemini were skipped/failed, short-circuit to fallback for clarity
    if (not SERPAPI_KEY and not GEMINI_API_KEY) or not any(enrichment[k] for k in ['primary_attractions', 'activities', 'local_specialties']):
        print("[Fallback] Using sample data as Gemini returned empty results")
        enrichment = {
            'primary_attractions': [f"Sample attraction for {query}"],
            'local_specialties': [f"Sample specialty for {query}"],
            'activities': [f"Sample activity for {query}"],
        }
    return enrichment



def fetch_and_add_village(query, merged, G, synthetic):
    MAPQUEST_API_KEY = os.getenv('MAPQUEST_API_KEY')
    locations = []
    # Prefer MapQuest if API key is available, otherwise fallback to Nominatim (OpenStreetMap)
    if MAPQUEST_API_KEY:
        params = {"key": MAPQUEST_API_KEY, "location": f"{query}, India"}
        response = requests.get('http://www.mapquestapi.com/geocoding/v1/address', params=params)
        if response.status_code == 200:
            data = response.json()
            locations = data.get("results", [{}])[0].get("locations", [])
    else:
        # Use Nominatim free geocoding as a fallback so the script can run without MAPQUEST key
        nom_url = 'https://nominatim.openstreetmap.org/search'
        nom_params = {'q': f'{query}, India', 'format': 'json', 'limit': 1}
        try:
            nom_resp = requests.get(nom_url, params=nom_params, headers={'User-Agent': 'village-rag/1.0'})
            if nom_resp.status_code == 200:
                    nom_data = nom_resp.json()
                    if nom_data:
                        n = nom_data[0]
                        lat = float(n.get('lat'))
                        lng = float(n.get('lon'))
                        addr = n.get('address', {}) if isinstance(n, dict) else {}
                        # Prefer 'state' but fall back to county/region/state_district
                        state_name = addr.get('state') or addr.get('county') or addr.get('region') or addr.get('state_district') or ''
                        city_name = addr.get('city') or addr.get('town') or addr.get('village') or addr.get('municipality') or ''
                        locations = [{
                            'latLng': {'lat': lat, 'lng': lng},
                            'adminArea3': state_name,
                            'street': n.get('display_name', ''),
                            'adminArea5': city_name,
                            'adminArea4': addr.get('county', ''),
                            'adminArea1': addr.get('country', ''),
                        }]
        except Exception:
            locations = []
    if locations:
        loc = locations[0]
        lat = loc.get("latLng", {}).get("lat")
        lng = loc.get("latLng", {}).get("lng")
        village_name = query
        state = loc.get("adminArea3", "")
        # If MapQuest provided no state, try Nominatim reverse geocoding as a fallback
        if not state and lat and lng:
            try:
                rev_url = 'https://nominatim.openstreetmap.org/reverse'
                rev_params = {'lat': lat, 'lon': lng, 'format': 'json'}
                rev_resp = requests.get(rev_url, params=rev_params, headers={'User-Agent': 'village-rag/1.0'})
                if rev_resp.status_code == 200:
                    rev_data = rev_resp.json()
                    addr = rev_data.get('address', {})
                    state = addr.get('state') or addr.get('county') or addr.get('region') or addr.get('state_district') or state
            except Exception:
                pass
        # Enhanced enrichment
        enrichment = enrich_from_serpapi_and_gemini(query)
        new_village = {
            'village_name': village_name,
            'state': state,
            'latitude': lat,
            'longitude': lng,
            'address': loc.get('street', ''),
            'city': loc.get('adminArea5', ''),
            'district': loc.get('adminArea4', ''),
            'country': loc.get('adminArea1', ''),
            'primary_attractions': enrichment['primary_attractions'],
            'local_specialties': enrichment['local_specialties'],
            'activities': enrichment['activities'],
        }
        merged.append(new_village)
        node_id = village_name
        # Convert all list attributes to strings for GraphML compatibility
        v_for_graph = new_village.copy()
        for k in ['primary_attractions', 'local_specialties', 'activities', 'sample_reviews']:
            if k in v_for_graph and isinstance(v_for_graph[k], list):
                v_for_graph[k] = ', '.join(str(x) for x in v_for_graph[k])
        G.add_node(node_id, **v_for_graph)
        # Save updated data
        with open('merged_villages.json', 'w', encoding='utf-8') as f:
            json.dump(merged, f, indent=2, ensure_ascii=False)
        nx.write_graphml(G, 'village_knowledge_graph.graphml')
        print(f"Fetched and added new village: {village_name} ({lat}, {lng})")
        return [(node_id, new_village)]
    # No locations found
    if MAPQUEST_API_KEY:
        # MapQuest request may have failed
        try:
            status = response.status_code
        except Exception:
            status = 'unknown'
        print(f"Error {status} from MapQuest API")
    else:
        print(f"No result found for {query}")
    return []

def rag_search(query):
    try:
        # Initialize empty data structures if load functions fail
        synthetic = []
        merged = []
        G = nx.Graph()
        
        # Attempt to load data
        if os.path.exists('synthetic_data.json'):
            with open('synthetic_data.json', 'r', encoding='utf-8') as f:
                synthetic = json.load(f)
                
        if os.path.exists('merged_villages.json') and os.path.exists('village_knowledge_graph.graphml'):
            with open('merged_villages.json', 'r', encoding='utf-8') as f:
                merged = json.load(f)
            G = nx.read_graphml('village_knowledge_graph.graphml')
            
        results = []
        mode = "exact"
        if G and merged:
            # Search for exact matches first
            exact_matches = [(node, G.nodes[node]) for node in G.nodes
        if query.lower() in node.lower() or
                    query.lower() in G.nodes[node].get('state', '').lower()]
            
            # If no exact matches, try fuzzy matching on attractions and activities
            if not exact_matches:
                fuzzy_matches = []
                for node in G.nodes:
                    node_data = G.nodes[node]
                    attractions = node_data.get('primary_attractions', '').lower()
                    activities = node_data.get('activities', '').lower()
                    if query.lower() in attractions or query.lower() in activities:
                        fuzzy_matches.append((node, node_data))
                results = fuzzy_matches
                mode = "fuzzy"
            else:
                results = exact_matches
                mode = "exact"
            
    except Exception as e:
        print(f"Error loading or processing data: {str(e)}")
        return []
    updated = False
    if results:
        print(f"Found {len(results)} result(s) in knowledge graph:")
        for node, data in results:
            # Always re-enrich using SerpAPI + Gemini
            enrichment = enrich_from_serpapi_and_gemini(query)
            # Update merged dataset
            for v in merged:
                if v.get('village_name', '').lower() == data.get('village_name', '').lower() and v.get('state', '').lower() == data.get('state', '').lower():
                    v['primary_attractions'] = enrichment['primary_attractions']
                    v['local_specialties'] = enrichment['local_specialties']
                    v['activities'] = enrichment['activities']
                    break
            # Update graph node
            G.nodes[node]['primary_attractions'] = ', '.join(enrichment['primary_attractions'])
            G.nodes[node]['local_specialties'] = ', '.join(enrichment['local_specialties'])
            G.nodes[node]['activities'] = ', '.join(enrichment['activities'])
            print(f"- {data.get('village_name', node)} | State: {data.get('state', '')} | Attractions: {enrichment['primary_attractions']} | Activities: {enrichment['activities']}")
            updated = True
        if updated:
            with open('merged_villages.json', 'w', encoding='utf-8') as f:
                json.dump(merged, f, indent=2, ensure_ascii=False)
            nx.write_graphml(G, 'village_knowledge_graph.graphml')
        return results
    else:
        print(f"No result found in graph. Fetching real-time data...")
        new_results = fetch_and_add_village(query, merged, G, synthetic)
        if new_results:
            print(f"New data added and returned:")
            for node, data in new_results:
                print(f"- {data.get('village_name', node)} | State: {data.get('state', '')} | Lat: {data.get('latitude', '')} | Lng: {data.get('longitude', '')} | Attractions: {data.get('primary_attractions', '')} | Activities: {data.get('activities', '')}")
        return new_results

if __name__ == "__main__":
    # Support non-interactive run for testing via environment variable RAG_QUERY
    rag_query = os.environ.get('RAG_QUERY')
    if rag_query:
        print(f"Running non-interactive RAG query: {rag_query}")
        rag_search(rag_query)
    else:
        print("Welcome to the Village RAG Search!")
        while True:
            query = input("Enter a village/activity/attraction/state to search (or 'exit'): ").strip()
            if query.lower() == 'exit':
                break
            rag_search(query)
            print("---")