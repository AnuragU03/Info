// The frontend should call our server-side proxy under /api/microservice
const PROXY_BASE = '';

export interface EnrichmentResponse {
  primary_attractions: string[];
  local_specialties: string[];
  activities: string[];
}

export interface Village {
  village_id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    state: string;
    district: string;
  };
  description: string;
  attractions: string[];
  specialties: string[];
  activities: string[];
  images: string[];
  pricing: {
    accommodation: {
      min: number;
      max: number;
    };
    activities: Array<{
      name: string;
      price: number;
    }>;
  };
  owner: {
    id: string;
    name: string;
    contact: string;
  };
  ratings: Array<{
    userId: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export interface Internship {
  id: string;
  title: string;
  village: string;
  description: string;
  duration: string;
  stipend: number;
  requirements: string[];
  benefits: string[];
  applicationDeadline: string;
}

export interface Booking {
  id: string;
  userId: string;
  villageId: string;
  ownerId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export class MicroserviceAPI {
  private baseUrl: string;

  constructor() {
    // Use server proxy (same origin) so secrets stay server-side
    this.baseUrl = PROXY_BASE || '';
  }

  private async handleRequest(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status}: ${response.statusText} ${text}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      
      // Return fallback data for search endpoint
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

  // RAG Search
  async searchVillage(query: string): Promise<EnrichmentResponse> {
    return this.handleRequest(`${this.baseUrl}/api/microservice/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
  }

  // Villages
  async getVillages(): Promise<Village[]> {
  return this.handleRequest(`${this.baseUrl}/api/microservice/villages`);
  }

  async getVillageById(id: string): Promise<Village> {
  return this.handleRequest(`${this.baseUrl}/api/microservice/villages/${id}`);
  }

  // Internships
  async getInternships(): Promise<Internship[]> {
  return this.handleRequest(`${this.baseUrl}/api/microservice/internships`);
  }

  async getInternshipById(id: string): Promise<Internship> {
  return this.handleRequest(`${this.baseUrl}/api/microservice/internships/${id}`);
  }

  // Bookings
  async getBookings(ownerId?: string): Promise<Booking[]> {
    const url = ownerId
      ? `${this.baseUrl}/api/microservice/bookings?ownerId=${ownerId}`
      : `${this.baseUrl}/api/microservice/bookings`;
    return this.handleRequest(url);
  }

  // Applications
  async getApplications(userId?: string): Promise<any[]> {
    const url = userId
      ? `${this.baseUrl}/api/microservice/applications?userId=${userId}`
      : `${this.baseUrl}/api/microservice/applications`;
    return this.handleRequest(url);
  }

  // Kirana Stores
  async getKiranaStores(): Promise<any[]> {
  return this.handleRequest(`${this.baseUrl}/api/microservice/kirana-stores`);
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    try {
  const response = await fetch(`/api/microservice/health`);
      return response.ok;
    } catch (error) {
      console.error('Microservice health check failed:', error);
      return false;
    }
  }
}

export const microserviceAPI = new MicroserviceAPI();
