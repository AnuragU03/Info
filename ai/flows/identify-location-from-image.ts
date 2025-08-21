'use server';

/**
 * @fileOverview An AI agent that identifies the location from an image.
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
      "A data URI of an image of a place. This will be used to identify the location."
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
): Promise<IdentifyLocationFromImageOutput | null> {
  return identifyLocationFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyLocationFromImagePrompt',
  input: {schema: z.object({ imageUrl: z.string() }) },
  output: {schema: z.object({
    villageName: z.string().describe('The name of the village or city identified in the image.'),
    country: z.string().describe('The country where the location is.'),
  })},
  prompt: `You are an expert at identifying locations from images.

  Analyze the following image and identify the village/city and country. Pay close attention to landmarks, geography, architecture, and any text that might be visible. Your goal is to be as precise as possible with the location name.

  Image: {{media url=imageUrl}}`,
});

const identifyLocationFromImageFlow = ai.defineFlow(
  {
    name: 'identifyLocationFromImageFlow',
    inputSchema: IdentifyLocationFromImageInputSchema,
    outputSchema: IdentifyLocationFromImageOutputSchema.nullable(),
  },
  async (input) => {
    try {
        const {output} = await prompt(input);
        if (output) {
            return {
                ...output,
                generatedImageUrl: 'https://placehold.co/600x400.png',
            };
        }
        return null;
    } catch (e) {
        console.error("Error in identifyLocationFromImageFlow:", e);
        return null;
    }
  }
);
