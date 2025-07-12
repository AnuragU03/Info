import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-instagram-posts.ts';
import '@/ai/flows/generate-village-description.ts';
import '@/ai/flows/suggest-nearby-attractions.ts';
import '@/ai/flows/identify-location-from-image.ts';
import '@/ai/flows/generate-itinerary.ts';
import '@/ai/flows/suggest-price.ts';
import '@/ai/flows/translate-text.ts';
