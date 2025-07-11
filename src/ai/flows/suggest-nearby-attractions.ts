'use server';
/**
 * @fileOverview Suggests nearby points of interest around a selected village.
 *
 * - suggestNearbyAttractions - A function that handles the suggestion of nearby attractions.
 * - SuggestNearbyAttractionsInput - The input type for the suggestNearbyAttractions function.
 * - SuggestNearbyAttractionsOutput - The return type for the suggestNearbyAttractions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNearbyAttractionsInputSchema = z.object({
  villageName: z.string().describe('The name of the selected village.'),
  latitude: z.number().describe('The latitude of the village.'),
  longitude: z.number().describe('The longitude of the village.'),
});
export type SuggestNearbyAttractionsInput = z.infer<typeof SuggestNearbyAttractionsInputSchema>;

const SuggestNearbyAttractionsOutputSchema = z.object({
  nearbyAttractions: z
    .array(z.string())
    .describe('A list of nearby points of interest around the village.'),
});
export type SuggestNearbyAttractionsOutput = z.infer<typeof SuggestNearbyAttractionsOutputSchema>;

export async function suggestNearbyAttractions(
  input: SuggestNearbyAttractionsInput
): Promise<SuggestNearbyAttractionsOutput> {
  return suggestNearbyAttractionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNearbyAttractionsPrompt',
  input: {schema: SuggestNearbyAttractionsInputSchema},
  output: {schema: SuggestNearbyAttractionsOutputSchema},
  prompt: `You are a travel expert specializing in suggesting hidden gems and local attractions around rural villages in India.

  Given the name and coordinates of a village, suggest a list of nearby points of interest that a traveler might enjoy.

  Village Name: {{{villageName}}}
  Latitude: {{{latitude}}}
  Longitude: {{{longitude}}}

  Consider factors such as historical significance, natural beauty, cultural experiences, and local workshops when making your suggestions.

  Format your response as a list of attractions.
  `,
});

const suggestNearbyAttractionsFlow = ai.defineFlow(
  {
    name: 'suggestNearbyAttractionsFlow',
    inputSchema: SuggestNearbyAttractionsInputSchema,
    outputSchema: SuggestNearbyAttractionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
