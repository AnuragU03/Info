# Python Microservice Integration Guide

## Overview

This guide details the integration of the Python FastAPI microservice with the VillageStay+ Next.js frontend. The microservice provides AI-powered village search and enrichment capabilities using a custom RAG (Retrieval-Augmented Generation) model.

## Architecture Overview

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────────┐
│   Next.js       │◄──────────────►│  Python FastAPI     │
│   Frontend      │                 │  Microservice       │
│                 │                 │                     │
│ - Village Cards │                 │ - RAG Model         │
│ - Search        │                 │ - Knowledge Graph   │
│ - Booking       │                 │ - SerpAPI/Gemini    │
└─────────────────┘                 └─────────────────────┘
```

## 1. Microservice Setup

### 1.1 Prerequisites
```bash
# Python 3.8+ required
python --version

# Install dependencies
cd python_microservice
pip install -r requirements.txt
```

### 1.2 Environment Variables
Create `.env` file in `python_microservice/`:
```env
SERPAPI_KEY=your_serpapi_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 1.3 Start the Service
```bash
# Development mode
uvicorn main:app --reload --port 8001

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8001
```

## 2. API Endpoints

### 2.1 RAG Search Endpoint
```typescript
// Frontend integration
const searchVillage = async (query: string) => {
  try {
    const response = await fetch('http://localhost:8001/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};
```

**Request:**
```json
{
  "query": "Mawlynnong village"
}
```

**Response:**
```json
{
  "primary_attractions": [
    "Living Root Bridge",
    "Sky View Point",
    "Sacred Forest"
  ],
  "local_specialties": [
    "Bamboo Handicrafts",
    "Local Honey",
    "Traditional Cuisine"
  ],
  "activities": [
    "Trekking",
    "Cultural Workshops",
    "Village Walks"
  ]
}
```

### 2.2 Data Endpoints

#### Villages API
```typescript
// Get all villages
const getVillages = async () => {
  const response = await fetch('http://localhost:8001/api/villages');
  return response.json();
};

// Get specific village
const getVillageById = async (villageId: string) => {
  const response = await fetch(`http://localhost:8001/api/villages/${villageId}`);
  return response.json();
};
```

#### Internships API
```typescript
// Get all internships
const getInternships = async () => {
  const response = await fetch('http://localhost:8001/api/internships');
  return response.json();
};
```

#### Bookings API
```typescript
// Get bookings with optional owner filter
const getBookings = async (ownerId?: string) => {
  const url = ownerId 
    ? `http://localhost:8001/api/bookings?ownerId=${ownerId}`
    : 'http://localhost:8001/api/bookings';
  const response = await fetch(url);
  return response.json();
};
```

## 3. Frontend Integration

### 3.1 Create API Service Layer

Create `lib/api-service.ts`:
```typescript
const MICROSERVICE_BASE_URL = process.env.NEXT_PUBLIC_MICROSERVICE_URL || 'http://localhost:8001';

export class MicroserviceAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = MICROSERVICE_BASE_URL;
  }

  // RAG Search
  async searchVillage(query: string) {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Villages
  async getVillages() {
    const response = await fetch(`${this.baseUrl}/api/villages`);
    return response.json();
  }

  async getVillageById(id: string) {
    const response = await fetch(`${this.baseUrl}/api/villages/${id}`);
    return response.json();
  }

  // Internships
  async getInternships() {
    const response = await fetch(`${this.baseUrl}/api/internships`);
    return response.json();
  }

  // Bookings
  async getBookings(ownerId?: string) {
    const url = ownerId 
      ? `${this.baseUrl}/api/bookings?ownerId=${ownerId}`
      : `${this.baseUrl}/api/bookings`;
    const response = await fetch(url);
    return response.json();
  }
}

export const microserviceAPI = new MicroserviceAPI();
```

### 3.2 Update Village Card Component

Update `components/village-card.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { microserviceAPI } from '@/lib/api-service';

interface VillageCardProps {
  village: Village;
}

export function VillageCard({ village }: VillageCardProps) {
  const [enrichedData, setEnrichedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const enrichVillageData = async () => {
    setLoading(true);
    try {
      const data = await microserviceAPI.searchVillage(village.name);
      setEnrichedData(data);
    } catch (error) {
      console.error('Failed to enrich village data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    enrichVillageData();
  }, [village.name]);

  return (
    <div className="village-card">
      {/* Existing village card content */}
      
      {/* Enriched data display */}
      {loading && <div>Loading AI insights...</div>}
      
      {enrichedData && (
        <div className="ai-insights">
          <h4>AI-Powered Insights</h4>
          
          {enrichedData.primary_attractions && (
            <div>
              <h5>Attractions</h5>
              <ul>
                {enrichedData.primary_attractions.map((attraction: string, index: number) => (
                  <li key={index}>{attraction}</li>
                ))}
              </ul>
            </div>
          )}
          
          {enrichedData.local_specialties && (
            <div>
              <h5>Local Specialties</h5>
              <ul>
                {enrichedData.local_specialties.map((specialty: string, index: number) => (
                  <li key={index}>{specialty}</li>
                ))}
              </ul>
            </div>
          )}
          
          {enrichedData.activities && (
            <div>
              <h5>Activities</h5>
              <ul>
                {enrichedData.activities.map((activity: string, index: number) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### 3.3 Update Search Component

Update `components/search-bar.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { microserviceAPI } from '@/lib/api-service';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      // Get villages from microservice
      const villages = await microserviceAPI.getVillages();
      
      // Filter villages based on query
      const filteredVillages = villages.filter((village: any) =>
        village.name.toLowerCase().includes(query.toLowerCase()) ||
        village.description.toLowerCase().includes(query.toLowerCase())
      );
      
      // Enrich with AI data for top results
      const enrichedResults = await Promise.all(
        filteredVillages.slice(0, 5).map(async (village: any) => {
          try {
            const enrichedData = await microserviceAPI.searchVillage(village.name);
            return { ...village, enrichedData };
          } catch (error) {
            return village;
          }
        })
      );
      
      setResults(enrichedResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search villages..."
        className="search-input"
      />
      <button 
        onClick={handleSearch}
        disabled={loading}
        className="search-button"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
      
      {results.length > 0 && (
        <div className="search-results">
          {results.map((village, index) => (
            <div key={index} className="search-result-item">
              <h3>{village.name}</h3>
              <p>{village.description}</p>
              
              {village.enrichedData && (
                <div className="ai-highlights">
                  <strong>AI Highlights:</strong>
                  <ul>
                    {village.enrichedData.primary_attractions?.slice(0, 2).map((attraction: string, i: number) => (
                      <li key={i}>{attraction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 4. Error Handling & Fallbacks

### 4.1 API Error Handling
```typescript
// Enhanced API service with error handling
export class MicroserviceAPI {
  // ... existing methods ...

  private async handleRequest(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      
      // Return fallback data or re-throw based on use case
      if (url.includes('/search')) {
        return {
          primary_attractions: [],
          local_specialties: [],
          activities: []
        };
      }
      
      throw error;
    }
  }

  async searchVillage(query: string) {
    return this.handleRequest(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
  }
}
```

### 4.2 Health Check Endpoint
```typescript
// Add health check to microservice
export async function checkMicroserviceHealth() {
  try {
    const response = await fetch(`${MICROSERVICE_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Microservice health check failed:', error);
    return false;
  }
}
```

## 5. Performance Optimization

### 5.1 Caching Strategy
```typescript
// Simple in-memory cache
class APICache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 minutes

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

const apiCache = new APICache();

// Enhanced API service with caching
export class MicroserviceAPI {
  // ... existing methods ...

  async searchVillage(query: string) {
    const cacheKey = `search:${query}`;
    const cached = apiCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const data = await this.handleRequest(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    apiCache.set(cacheKey, data);
    return data;
  }
}
```

### 5.2 Request Debouncing
```typescript
// Debounced search hook
import { useCallback, useRef } from 'react';

export function useDebouncedSearch(delay: number = 500) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSearch = useCallback((searchFunction: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(searchFunction, delay);
  }, [delay]);

  return debouncedSearch;
}
```

## 6. Deployment Configuration

### 6.1 Environment Variables
```env
# .env.local
NEXT_PUBLIC_MICROSERVICE_URL=http://localhost:8001

# .env.production
NEXT_PUBLIC_MICROSERVICE_URL=https://your-microservice-domain.com
```

### 6.2 Docker Configuration
```dockerfile
# python_microservice/Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
```

### 6.3 Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "9002:9002"
    environment:
      - NEXT_PUBLIC_MICROSERVICE_URL=http://microservice:8001
    depends_on:
      - microservice

  microservice:
    build: ./python_microservice
    ports:
      - "8001:8001"
    environment:
      - SERPAPI_KEY=${SERPAPI_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
```

## 7. Monitoring & Debugging

### 7.1 Logging
```typescript
// Enhanced logging for API calls
export class MicroserviceAPI {
  private log(level: string, message: string, data?: any) {
    console.log(`[MicroserviceAPI] ${level}: ${message}`, data || '');
  }

  async searchVillage(query: string) {
    this.log('info', `Searching for: ${query}`);
    
    try {
      const data = await this.handleRequest(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      this.log('info', `Search successful for: ${query}`, data);
      return data;
    } catch (error) {
      this.log('error', `Search failed for: ${query}`, error);
      throw error;
    }
  }
}
```

### 7.2 Performance Monitoring
```typescript
// Performance tracking
export class MicroserviceAPI {
  private trackPerformance(operation: string, startTime: number) {
    const duration = Date.now() - startTime;
    console.log(`[Performance] ${operation} took ${duration}ms`);
    
    // Send to analytics service in production
    if (duration > 2000) {
      console.warn(`[Performance] Slow operation: ${operation} (${duration}ms)`);
    }
  }

  async searchVillage(query: string) {
    const startTime = Date.now();
    
    try {
      const data = await this.handleRequest(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      this.trackPerformance('searchVillage', startTime);
      return data;
    } catch (error) {
      this.trackPerformance('searchVillage', startTime);
      throw error;
    }
  }
}
```

## 8. Testing

### 8.1 Unit Tests
```typescript
// __tests__/api-service.test.ts
import { MicroserviceAPI } from '@/lib/api-service';

describe('MicroserviceAPI', () => {
  let api: MicroserviceAPI;

  beforeEach(() => {
    api = new MicroserviceAPI();
  });

  test('searchVillage returns enriched data', async () => {
    const mockResponse = {
      primary_attractions: ['Temple', 'Viewpoint'],
      local_specialties: ['Handicrafts'],
      activities: ['Trekking']
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await api.searchVillage('test village');
    
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8001/search',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ query: 'test village' })
      })
    );
  });
});
```

### 8.2 Integration Tests
```typescript
// __tests__/integration/microservice.test.ts
describe('Microservice Integration', () => {
  test('microservice is accessible', async () => {
    const response = await fetch('http://localhost:8001/health');
    expect(response.ok).toBe(true);
  });

  test('search endpoint works', async () => {
    const response = await fetch('http://localhost:8001/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'test' })
    });
    
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data).toHaveProperty('primary_attractions');
    expect(data).toHaveProperty('local_specialties');
    expect(data).toHaveProperty('activities');
  });
});
```

## 9. Troubleshooting

### 9.1 Common Issues

#### CORS Errors
```python
# In main.py, ensure CORS is properly configured
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### API Key Issues
```bash
# Check environment variables
echo $SERPAPI_KEY
echo $GEMINI_API_KEY

# Test API keys
curl -X POST "http://localhost:8001/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

#### Performance Issues
```python
# Add logging to identify bottlenecks
import time

@app.post("/search")
def search_village(data: SearchRequest):
    start_time = time.time()
    
    # ... existing code ...
    
    duration = time.time() - start_time
    print(f"Search took {duration:.2f} seconds")
    
    return enrichment
```

### 9.2 Debug Mode
```typescript
// Enable debug mode in development
const DEBUG_MODE = process.env.NODE_ENV === 'development';

export class MicroserviceAPI {
  private log(level: string, message: string, data?: any) {
    if (DEBUG_MODE) {
      console.log(`[MicroserviceAPI] ${level}: ${message}`, data || '');
    }
  }
}
```

## 10. Conclusion

This integration guide provides a comprehensive approach to connecting the Python microservice with the Next.js frontend. The RAG model enhances the user experience by providing real-time, AI-powered insights about villages and attractions.

Key benefits of this integration:
- **Real-time AI insights** for village discovery
- **Scalable architecture** with microservice separation
- **Robust error handling** and fallback mechanisms
- **Performance optimization** through caching and debouncing
- **Comprehensive monitoring** and debugging capabilities

For production deployment, ensure proper security measures, monitoring, and scaling strategies are in place.
