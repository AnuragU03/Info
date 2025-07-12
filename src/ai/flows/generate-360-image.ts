
'use server';

/**
 * @fileOverview An AI agent that generates a 360 panoramic image for a village.
 * 
 * - generate360Image - Generates a 360 image based on village details.
 * - Generate360ImageInput - Input schema for the flow.
 * - Generate360ImageOutput - Output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const Generate360ImageInputSchema = z.object({
  villageName: z.string().describe('The name of the village.'),
  location: z.string().describe('The location of the village (e.g., Meghalaya, India).'),
  shortDescription: z.string().describe('A short description of the village.'),
});
export type Generate360ImageInput = z.infer<typeof Generate360ImageInputSchema>;

const Generate360ImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated 360-degree panoramic image.'),
});
export type Generate360ImageOutput = z.infer<typeof Generate360ImageOutputSchema>;

export async function generate360Image(input: Generate360ImageInput): Promise<Generate360ImageOutput> {
  return generate360ImageFlow(input);
}

const generate360ImageFlow = ai.defineFlow(
  {
    name: 'generate360ImageFlow',
    inputSchema: Generate360ImageInputSchema,
    outputSchema: Generate360ImageOutputSchema,
  },
  async (input) => {
    const prompt = `A breathtaking, high-resolution, 360-degree equirectangular panoramic image of a rural village scene in ${input.villageName}, ${input.location}. The style should be photorealistic. The scene should capture the essence of the village's description: "${input.shortDescription}". The image must be a full 360x180 panorama suitable for a VR viewer.`;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
        throw new Error('Image generation failed to return an image.');
    }

    return { imageUrl: media.url };
  }
);
