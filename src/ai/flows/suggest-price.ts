'use server';

/**
 * @fileOverview An AI agent that suggests a price for a village stay listing.
 *
 * - suggestPrice - A function that suggests a price for a listing.
 * - SuggestPriceInput - The input type for the suggestPrice function.
 * - SuggestPriceOutput - The return type for the suggestPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SuggestPriceInputSchema = z.object({
  villageName: z.string().describe('The name of the village.'),
  description: z.string().describe('A description of the stay being offered.'),
  culturalAttractions: z.string().describe('A description of the cultural attractions in the village.'),
  uniqueOfferings: z.string().describe('A description of the unique offerings of the stay.'),
  ecoBadges: z.array(z.string()).describe('A list of selected eco-friendly badges.'),
});
export type SuggestPriceInput = z.infer<typeof SuggestPriceInputSchema>;

export const SuggestPriceOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested price per night in Indian Rupees (INR).'),
  justification: z.string().describe('A Markdown-formatted string explaining the reasoning for the suggested price, with each point starting with a check emoji (✅).'),
});
export type SuggestPriceOutput = z.infer<typeof SuggestPriceOutputSchema>;

export async function suggestPrice(
  input: SuggestPriceInput
): Promise<SuggestPriceOutput> {
  return suggestPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPricePrompt',
  input: {schema: SuggestPriceInputSchema},
  output: {schema: SuggestPriceOutputSchema},
  prompt: `You are an expert pricing analyst for VillageStay+, a platform for rural Indian tourism. Your goal is to suggest a fair and attractive nightly price (in INR) for a new listing.

  Analyze the following listing details. Consider factors like location uniqueness, quality of experience, eco-friendliness, and cultural value.

  **Listing Details:**
  - **Village Name:** {{{villageName}}}
  - **Description:** {{{description}}}
  - **Cultural Attractions:** {{{culturalAttractions}}}
  - **Unique Offerings:** {{{uniqueOfferings}}}
  - **Eco-Badges:** {{#each ecoBadges}}* {{{this}}}\n{{/each}}

  **Your Task:**
  1.  **Suggest a Price:** Determine a fair nightly price in INR. Use a base of around ₹800 and adjust it up or down based on the details. A truly unique, eco-friendly offering in a remote, culturally rich area could be worth over ₹2000, while a basic stay might be closer to ₹800-₹1200.
  2.  **Provide Justification:** Create a short, bulleted list explaining *why* you're suggesting this price. Each point must start with a check emoji (✅). Be specific and tie your justification directly to the listing details provided.

  The final output must be in the specified JSON format.
  `,
});

const suggestPriceFlow = ai.defineFlow(
  {
    name: 'suggestPriceFlow',
    inputSchema: SuggestPriceInputSchema,
    outputSchema: SuggestPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
