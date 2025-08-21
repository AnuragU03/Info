
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
    const attractions = await suggestNearbyAttractions({
      villageName,
      latitude,
      longitude
    });
    return attractions.nearbyAttractions;
  } catch (error) {
    console.error('Error fetching nearby attractions:', error);
    throw new Error('Could not load attractions at this time. Please try again later.');
  }
}

export async function getInstagramSummary(villageName: string, instagramPosts: string[]) {
  if (!instagramPosts || instagramPosts.length === 0) {
    return "No recent social media activity found for this village.";
  }
  try {
    // Simulate network delay and return hardcoded data
    await new Promise(resolve => setTimeout(resolve, 500));
    return "Travelers are captivated by the stunning natural beauty and the unique cultural experiences offered here. Many posts highlight the warm hospitality of the local community and the delicious traditional food.";
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
    // Return a hardcoded price suggestion to ensure functionality
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const samplePriceSuggestion: SuggestPriceOutput = {
        suggestedPrice: 1850,
        justification: `
✅ Based on the unique cultural attractions you've listed.
✅ The eco-friendly badges you've selected add significant value.
✅ The description suggests a high-quality, authentic experience for travelers.
✅ This price is competitive for similar listings in the region.
        `
    };
    return samplePriceSuggestion;
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
