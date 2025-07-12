'use server';

/**
 * @fileOverview An AI agent that generates a travel itinerary for a village.
 *
 * - generateItinerary - A function that generates a travel itinerary for a specified number of days.
 * - GenerateItineraryInput - The input type for the generateItinerary function.
 * - GenerateItineraryOutput - The return type for the generateItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItineraryInputSchema = z.object({
  villageName: z.string().describe('The name of the village.'),
  culturalAttractions: z.string().describe('A description of the cultural attractions in the village.'),
  uniqueOfferings: z.string().describe('A description of the unique offerings in the village.'),
  numberOfDays: z.number().min(1).max(10).describe('The number of days for the itinerary.'),
});
export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const GenerateItineraryOutputSchema = z.object({
  itinerary: z.string().describe('The itinerary for the village, formatted as a markdown string.'),
});
export type GenerateItineraryOutput = z.infer<typeof GenerateItineraryOutputSchema>;

export async function generateItinerary(
  input: GenerateItineraryInput
): Promise<GenerateItineraryOutput> {
  return generateItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItineraryPrompt',
  input: {schema: GenerateItineraryInputSchema},
  output: {schema: GenerateItineraryOutputSchema},
  prompt: `You are an expert travel planner creating an exciting and immersive itinerary for a traveler visiting a rural Indian village.

  The user wants an itinerary for {{{numberOfDays}}} days in the village of {{{villageName}}}.

  Here's what you know about the village:
  - Cultural Attractions: {{{culturalAttractions}}}
  - Unique Offerings & Activities: {{{uniqueOfferings}}}

  Based on this information, create a detailed {{{numberOfDays}}}-day itinerary. Structure it clearly with headings for each day (e.g., Day 1, Day 2, etc.). For each day, suggest activities for the morning, afternoon, and evening.

  Make the itinerary sound appealing and practical. Include a mix of cultural experiences, nature, relaxation, and interaction with the local community.

  The output should be a single string formatted in Markdown.
  `,
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: GenerateItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
