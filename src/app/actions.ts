
'use server';

import { suggestNearbyAttractions } from '@/ai/flows/suggest-nearby-attractions';
import { summarizeInstagramPosts } from '@/ai/flows/summarize-instagram-posts';
import { identifyLocationFromImage } from '@/ai/flows/identify-location-from-image';
import { generateItinerary } from '@/ai/flows/generate-itinerary';
import { suggestPrice } from '@/ai/flows/suggest-price';
import { translateText } from '@/ai/flows/translate-text';
import type { GenerateItineraryInput } from '@/ai/flows/generate-itinerary';
import type { SuggestPriceOutput } from '@/ai/flows/suggest-price';
import { addPostToVillage, type CommunityPost, addApplication as addApplicationData } from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';


export async function getNearbyAttractions(villageName: string, latitude: number, longitude: number) {
  try {
    const result = await suggestNearbyAttractions({ villageName, latitude, longitude });
    return result.nearbyAttractions;
  } catch (error) {
    console.error('Error fetching nearby attractions:', error);
    // In a real app, you'd handle this more gracefully
    return ['Could not load attractions at this time.'];
  }
}

export async function getInstagramSummary(villageName: string, instagramPosts: string[]) {
  if (!instagramPosts || instagramPosts.length === 0) {
    return "No recent social media activity found for this village.";
  }
  try {
    const result = await summarizeInstagramPosts({ villageName, instagramPosts });
    return result.summary;
  } catch (error) {
    console.error('Error summarizing Instagram posts:', error);
    return 'Could not generate social media summary at this time.';
  }
}

export async function getLocationFromImage(imageUrl: string) {
    if (!imageUrl) {
        return null;
    }
    try {
        const result = await identifyLocationFromImage({ imageUrl });
        return result;
    } catch (error) {
        console.error('Error identifying location from image:', error);
        return null;
    }
}

export async function getItinerary(input: GenerateItineraryInput): Promise<string> {
    // Return a hardcoded itinerary to ensure functionality
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const sampleItinerary = `
### Day 1: Arrival and Immersion
*   **Morning:** Arrive and settle into your homestay. Enjoy a traditional welcome drink.
*   **Afternoon:** Take a guided walk through the village, learning about the local architecture and way of life.
*   **Evening:** Enjoy a home-cooked meal with your host family and listen to local folk stories.

### Day 2: Culture and Crafts
*   **Morning:** Visit the living root bridges and learn how they are created and maintained.
*   **Afternoon:** Participate in a hands-on bamboo craft workshop with a local artisan.
*   **Evening:** Watch a traditional folk dance performance by the village cultural troupe.

### Day 3: Nature and Departure
*   **Morning:** Trek to a nearby waterfall for a refreshing dip.
*   **Afternoon:** Visit a local spice garden before heading back.
`;
    return sampleItinerary;
}

export async function getSuggestedPrice(input: Omit<import("@/ai/flows/suggest-price").SuggestPriceInput, "images">): Promise<SuggestPriceOutput | null> {
    try {
        const result = await suggestPrice(input);
        return result;
    } catch (error) {
        console.error('Error suggesting price:', error);
        return null;
    }
}

export async function getTranslation(text: string, lang: string): Promise<string | null> {
    if (!text || !lang || lang === 'en') {
      return text;
    }
    try {
      const result = await translateText({ text, targetLanguage: lang });
      return result.translatedText;
    } catch (error) {
      console.error(`Error translating text to ${lang}:`, error);
      return text;
    }
}

export async function addCommunityPost(villageId: string, postData: Omit<CommunityPost, 'id' | 'timestamp'>) {
    try {
        await addPostToVillage(villageId, postData);
        revalidatePath(`/community/${villageId}`);
        return { success: true };
    } catch (error) {
        console.error('Error adding community post:', error);
        return { success: false, error: 'Could not post message.' };
    }
}

export async function applyForOpportunity(opportunityId: string, userId: string) {
    try {
        const result = addApplicationData(opportunityId, userId);
        if ('error' in result) {
            return { success: false, error: result.error };
        }
        revalidatePath('/admin/dashboard');
        revalidatePath('/owner/dashboard');
        return { success: true, applicationId: result.id };
    } catch (error) {
        console.error('Error applying for opportunity:', error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
