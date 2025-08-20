// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview A flow to generate a random paragraph using a generative AI model.
 *
 * - generateRandomParagraph - A function that generates a random paragraph.
 * - GenerateRandomParagraphInput - The input type for the generateRandomParagraph function.
 * - GenerateRandomParagraphOutput - The return type for the generateRandomParagraph function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRandomParagraphInputSchema = z.object({
  length: z.number().default(3).describe('The approximate number of sentences in the paragraph.'),
});
export type GenerateRandomParagraphInput = z.infer<typeof GenerateRandomParagraphInputSchema>;

const GenerateRandomParagraphOutputSchema = z.object({
  paragraph: z.string().describe('The generated random paragraph.'),
});
export type GenerateRandomParagraphOutput = z.infer<typeof GenerateRandomParagraphOutputSchema>;

export async function generateRandomParagraph(input: GenerateRandomParagraphInput): Promise<GenerateRandomParagraphOutput> {
  return generateRandomParagraphFlow(input);
}

const generateRandomParagraphPrompt = ai.definePrompt({
  name: 'generateRandomParagraphPrompt',
  input: {schema: GenerateRandomParagraphInputSchema},
  output: {schema: GenerateRandomParagraphOutputSchema},
  prompt: `Generate a random, meaningful paragraph consisting of approximately {{length}} sentences.`,
});

const generateRandomParagraphFlow = ai.defineFlow(
  {
    name: 'generateRandomParagraphFlow',
    inputSchema: GenerateRandomParagraphInputSchema,
    outputSchema: GenerateRandomParagraphOutputSchema,
  },
  async input => {
    const {output} = await generateRandomParagraphPrompt(input);
    return output!;
  }
);
