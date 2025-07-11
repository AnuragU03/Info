# **App Name**: VillageStay+

## Core Features:

- AI Village Discovery: AI Discovery Engine: Scrapes Instagram for rural locations, filters using spaCy/BERT and Nominatim/Google Maps API, and ranks villages using RAG with FAISS/ChromaDB + LangChain as a tool.
- VR Mobile Previews: VR Previews: Mobile-first 360° image viewer built using A-Frame or Three.js, hosted on Oracle Object Storage, allows preview of workshops, homestays, or trails via smartphone.
- Voice Interface: Voice & Multilingual Interface: Speech-to-text interface built with Google Dialogflow CX or Essentials supporting voice input and translation using IndicNLP or MarianMT to enable villager interaction via speech in native languages.
- Listing Portal: Self-Service Listing Creation Portal: Villagers can list homestays or cultural experiences with eco-badge selection, image uploads (to IPFS or Oracle Storage), and QR code generation for offline discovery.
- Beckn Integration: Implements BPP-compliant APIs (/search, /select, /init, /confirm) to connect listings to the broader open commerce network using Beckn Protocol. Exposes booking and listing metadata in Beckn schema.

## Style Guidelines:

- Primary color: Earthy orange (#D2691E) evoking the warmth and groundedness of rural landscapes.
- Background color: Light beige (#F5F5DC), a soft, neutral backdrop.
- Accent color: Forest green (#228B22), symbolizing nature and sustainability.
- Font pairing: 'Playfair' (serif) for headlines, providing elegance, paired with 'PT Sans' (sans-serif) for body text, offering readability.
- Use line icons with rounded corners, in a stroke width slightly heavier than the defaults, to enhance visibility on mobile devices; icons should represent nature and local crafts, reflecting the unique character of the village.
- Mobile-first layout with clear, readable content blocks and prominent calls to action.
- Subtle, nature-inspired transitions and animations.