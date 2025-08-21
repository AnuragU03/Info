# VillageStay+ 🏘️

A decentralized, AI-powered rural tourism platform that connects travelers with authentic village experiences across India. Built with Next.js, TypeScript, and a custom Python RAG (Retrieval-Augmented Generation) microservice.

## 🌟 Features

- **AI-Powered Village Discovery**: Custom RAG model for intelligent recommendations
- **Real-time Data Enrichment**: Live updates from SerpAPI and Google Gemini
- **Interactive 360° Views**: Panoramic village exploration with Pannellum
- **Smart Booking System**: Seamless accommodation and activity reservations
- **Community Features**: User-generated content and social sharing
- **Multi-language Support**: Translation services for global accessibility
- **Owner Dashboard**: Property management and analytics
- **Internship Opportunities**: Connect travelers with village communities

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────────┐
│   Next.js       │◄──────────────►│  Python FastAPI     │
│   Frontend      │                 │  Microservice       │
│                 │                 │                     │
│ - React 18      │                 │ - RAG Model         │
│ - TypeScript    │                 │ - Knowledge Graph   │
│ - Tailwind CSS  │                 │ - SerpAPI/Gemini    │
│ - Firebase      │                 │ - NetworkX          │
└─────────────────┘                 └─────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Python 3.9+
- Docker & Docker Compose (optional)

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd download
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Add your API keys
   SERPAPI_KEY=your_serpapi_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start the services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:9002
   - Microservice: http://localhost:8001
   - API Docs: http://localhost:8001/docs

### Option 2: Local Development

1. **Start the Python microservice**
   ```bash
   cd python_microservice
   pip install -r requirements.txt
   
   # Set environment variables
   export SERPAPI_KEY=your_serpapi_key_here
   export GEMINI_API_KEY=your_gemini_api_key_here
   
   # Start the service
   uvicorn main:app --reload --port 8001
   ```

2. **Start the Next.js frontend**
   ```bash
   # In a new terminal
   npm install
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:9002
   - Microservice: http://localhost:8001

Microservice proxy and security
--------------------------------

- The Next.js app exposes a server-side proxy at `/api/microservice/*` which forwards requests to the Python FastAPI microservice. This keeps secrets (API keys) on the server and out of the browser.
- Set `MICROSERVICE_INTERNAL_URL` and `MICROSERVICE_SHARED_SECRET` in your environment (see `env.example`).
- The Python service reads `MICROSERVICE_ALLOWED_ORIGINS` to restrict CORS in production.

## 📁 Project Structure

```
download/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Home page
│   ├── villages/[id]/            # Village detail pages
│   ├── community/                # Community features
│   ├── admin/                    # Admin dashboard
│   └── owner/                    # Owner dashboard
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── village-card.tsx          # Village display component
│   ├── search-bar.tsx            # Search functionality
│   └── booking-dialog.tsx        # Booking system
├── lib/                          # Utility libraries
│   ├── api-service.ts            # Microservice integration
│   ├── firebase.ts               # Firebase configuration
│   └── utils.ts                  # Helper functions
├── python_microservice/          # AI/ML microservice
│   ├── main.py                   # FastAPI application
│   ├── rag_search_with_realtime_update.py  # RAG model
│   ├── models/                   # Knowledge graph models
│   ├── data/                     # JSON data files
│   └── requirements.txt          # Python dependencies
├── docs/                         # Documentation
│   ├── PRD_VillageStay_Plus.md   # Product Requirements Document
│   └── Python_Microservice_Integration_Guide.md
└── docker-compose.yml            # Container orchestration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
NEXT_PUBLIC_MICROSERVICE_URL=http://localhost:8001

# Python Microservice
SERPAPI_KEY=your_serpapi_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### API Keys Setup

1. **SerpAPI**: Get your key from [serpapi.com](https://serpapi.com)
2. **Google Gemini**: Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🧠 AI Features

### RAG Model Architecture

The Python microservice implements a custom RAG (Retrieval-Augmented Generation) model:

1. **Knowledge Graph**: Village data stored as GraphML with 15,058 nodes
2. **Real-time Search**: SerpAPI integration for live web data
3. **AI Processing**: Google Gemini for intelligent content generation
4. **Response Enrichment**: Structured data extraction and formatting

### API Endpoints

```typescript
// RAG Search
POST /search
{
  "query": "village name or description"
}

// Village Data
GET /api/villages
GET /api/villages/{id}

// Internships
GET /api/internships
GET /api/internships/{id}

// Bookings
GET /api/bookings?ownerId={id}

// Health Check
GET /health
```

## 🎨 UI Components

Built with modern design principles:

- **shadcn/ui**: High-quality React components
- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Theme switching support
- **Accessibility**: WCAG 2.1 AA compliant

## 📊 Data Models

### Village Structure
```typescript
interface Village {
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
    accommodation: PriceRange;
    activities: ActivityPrice[];
  };
  owner: OwnerInfo;
  ratings: Rating[];
}
```

### AI Enrichment Response
```typescript
interface EnrichmentResponse {
  primary_attractions: string[];
  local_specialties: string[];
  activities: string[];
}
```

## 🚀 Deployment

### Production Deployment

1. **Build the containers**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Set production environment variables**
   ```bash
   export NEXT_PUBLIC_MICROSERVICE_URL=https://your-microservice-domain.com
   export SERPAPI_KEY=your_production_key
   export GEMINI_API_KEY=your_production_key
   ```

3. **Deploy to your preferred platform**
   - **Vercel**: For Next.js frontend
   - **Railway/Heroku**: For Python microservice
   - **AWS/GCP**: For full-stack deployment

### Monitoring

- **Health Checks**: `/health` endpoint for service monitoring
- **Logging**: Structured logging for debugging
- **Performance**: Response time tracking
- **Error Handling**: Graceful fallbacks and error recovery

## 🧪 Testing

### Frontend Tests
```bash
npm run test
npm run test:watch
```

### Microservice Tests
```bash
cd python_microservice
python -m pytest tests/
```

### Integration Tests
```bash
# Test microservice connectivity
curl http://localhost:8001/health

# Test RAG search
curl -X POST http://localhost:8001/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Mawlynnong village"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commits
- Write comprehensive tests
- Update documentation
- Follow the existing code style

## 📚 Documentation

- **[Product Requirements Document](docs/PRD_VillageStay_Plus.md)**: Comprehensive PRD
- **[Python Microservice Integration Guide](docs/Python_Microservice_Integration_Guide.md)**: Detailed integration guide
- **[API Documentation](http://localhost:8001/docs)**: Auto-generated FastAPI docs

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.3**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **shadcn/ui**: Component library
- **Firebase**: Authentication & database
- **Pannellum**: 360° image viewer

### Backend
- **Python 3.9+**: Microservice runtime
- **FastAPI**: Web framework
- **NetworkX**: Graph operations
- **SerpAPI**: Web search integration
- **Google Gemini**: AI processing

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Orchestration
- **GitHub Actions**: CI/CD (planned)

## 📈 Roadmap

### Phase 1: MVP ✅
- [x] Basic village discovery
- [x] Python RAG microservice
- [x] Simple booking system
- [x] User authentication

### Phase 2: Enhanced Features 🚧
- [ ] Advanced AI recommendations
- [ ] Image recognition capabilities
- [ ] Community features
- [ ] Mobile app development

### Phase 3: Scale & Optimize 📋
- [ ] Performance optimization
- [ ] Advanced analytics
- [ ] International expansion
- [ ] Enterprise features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Village Communities**: For preserving cultural heritage
- **Open Source Contributors**: For amazing tools and libraries
- **AI/ML Community**: For advancing rural tourism technology

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@villagestay.com

---

**Made with ❤️ for sustainable rural tourism**
