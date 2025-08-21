'use server';

/**
 * @fileOverview An AI agent that generates a description of a village.
 *
 * - generateVillageDescription - A function that generates a description of a village.
 * - GenerateVillageDescriptionInput - The input type for the generateVillageDescription function.
 * - GenerateVillageDescriptionOutput - The return type for the generateVillageDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVillageDescriptionInputSchema = z.object({
  villageName: z.string().describe('The name of the village.'),
  culturalAttractions: z.string().describe('A description of the cultural attractions in the village.'),
  uniqueOfferings: z.string().describe('A description of the unique offerings in the village.'),
});
export type GenerateVillageDescriptionInput = z.infer<typeof GenerateVillageDescriptionInputSchema>;

const GenerateVillageDescriptionOutputSchema = z.object({
  villageDescription: z.string().describe('A description of the village.'),
});
export type GenerateVillageDescriptionOutput = z.infer<typeof GenerateVillageDescriptionOutputSchema>;

export async function generateVillageDescription(
  input: GenerateVillageDescriptionInput
): Promise<GenerateVillageDescriptionOutput> {
  return generateVillageDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVillageDescriptionPrompt',
  input: {schema: GenerateVillageDescriptionInputSchema},
  output: {schema: GenerateVillageDescriptionOutputSchema},
  prompt: `You are an expert travel writer specializing in describing unique villages.

  Based on the following information, generate a compelling description of the village.

  Village Name: {{{villageName}}}
  Cultural Attractions: {{{culturalAttractions}}}
  Unique Offerings: {{{uniqueOfferings}}}
  `,
});

const generateVillageDescriptionFlow = ai.defineFlow(
  {
    name: 'generateVillageDescriptionFlow',
    inputSchema: GenerateVillageDescriptionInputSchema,
    outputSchema: GenerateVillageDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
