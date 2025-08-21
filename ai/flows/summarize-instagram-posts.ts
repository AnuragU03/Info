// Summarize instagram posts about villages to get a sense of how they're perceived by tourists.
'use server';
/**
 * @fileOverview Summarizes Instagram posts about villages.
 *
 * - summarizeInstagramPosts - A function that summarizes Instagram posts about villages.
 * - SummarizeInstagramPostsInput - The input type for the summarizeInstagramPosts function.
 * - SummarizeInstagramPostsOutput - The return type for the summarizeInstagramPosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeInstagramPostsInputSchema = z.object({
  villageName: z.string().describe('The name of the village.'),
  instagramPosts: z.array(z.string()).describe('An array of Instagram post captions about the village.'),
});
export type SummarizeInstagramPostsInput = z.infer<typeof SummarizeInstagramPostsInputSchema>;

const SummarizeInstagramPostsOutputSchema = z.object({
  summary: z.string().describe('A summary of the sentiment and topics discussed in the Instagram posts.'),
});
export type SummarizeInstagramPostsOutput = z.infer<typeof SummarizeInstagramPostsOutputSchema>;

export async function summarizeInstagramPosts(input: SummarizeInstagramPostsInput): Promise<SummarizeInstagramPostsOutput> {
  return summarizeInstagramPostsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeInstagramPostsPrompt',
  input: {schema: SummarizeInstagramPostsInputSchema},
  output: {schema: SummarizeInstagramPostsOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing Instagram posts about villages to understand tourist perceptions.

  Village Name: {{{villageName}}}
  Instagram Posts:\n{{#each instagramPosts}}- {{{this}}}\n{{/each}}

  Please provide a concise summary of the sentiment and main topics discussed in these posts.`,
});

const summarizeInstagramPostsFlow = ai.defineFlow(
  {
    name: 'summarizeInstagramPostsFlow',
    inputSchema: SummarizeInstagramPostsInputSchema,
    outputSchema: SummarizeInstagramPostsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
