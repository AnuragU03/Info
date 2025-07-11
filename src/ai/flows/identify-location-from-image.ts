'use server';

/**
 * @fileOverview An AI agent that identifies the location from an image and generates a representative image.
 *
 * - identifyLocationFromImage - A function that identifies the location from an image.
 * - IdentifyLocationFromImageInput - The input type for the identifyLocationFromImage function.
 * - IdentifyLocationFromImageOutput - The return type for the identifyLocationFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyLocationFromImageInputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The URL of an image of a place. This will be used to identify the location."
    ),
});
export type IdentifyLocationFromImageInput = z.infer<typeof IdentifyLocationFromImageInputSchema>;

const IdentifyLocationFromImageOutputSchema = z.object({
  villageName: z.string().describe('The name of the village or city identified in the image.'),
  country: z.string().describe('The country where the location is.'),
  generatedImageUrl: z.string().describe('A generated placeholder image URL representing the location. Should be in the format https://placehold.co/600x400.png'),
});
export type IdentifyLocationFromImageOutput = z.infer<typeof IdentifyLocationFromImageOutputSchema>;

export async function identifyLocationFromImage(
  input: IdentifyLocationFromImageInput
): Promise<IdentifyLocationFromImageOutput> {
  return identifyLocationFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyLocationFromImagePrompt',
  input: {schema: IdentifyLocationFromImageInputSchema},
  output: {schema: IdentifyLocationFromImageOutputSchema},
  prompt: `You are an expert at identifying locations from images.

  Analyze the following image and identify the village/city and country. Pay close attention to landmarks, geography, architecture, and any text that might be visible. Your goal is to be as precise as possible with the location name.

  After identifying the location, generate a placeholder image URL for it using the format https://placehold.co/600x400.png.

  Image: {{media url=imageUrl}}`,
});

const identifyLocationFromImageFlow = ai.defineFlow(
  {
    name: 'identifyLocationFromImageFlow',
    inputSchema: IdentifyLocationFromImageInputSchema,
    outputSchema: IdentifyLocationFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
