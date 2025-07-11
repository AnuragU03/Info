'use server';

import { suggestNearbyAttractions } from '@/ai/flows/suggest-nearby-attractions';
import { summarizeInstagramPosts } from '@/ai/flows/summarize-instagram-posts';
import { identifyLocationFromImage } from '@/ai/flows/identify-location-from-image';

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
