'use server';

/**
 * @fileOverview A flow to generate a paragraph on a custom topic using a generative AI model.
 *
 * - generateCustomParagraph - A function that generates a paragraph based on a topic.
 * - GenerateCustomParagraphInput - The input type for the generateCustomParagraph function.
 * - GenerateCustomParagraphOutput - The return type for the generateCustomParagraph function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomParagraphInputSchema = z.object({
  topic: z.string().describe('The topic for the paragraph.'),
});
export type GenerateCustomParagraphInput = z.infer<typeof GenerateCustomParagraphInputSchema>;

const GenerateCustomParagraphOutputSchema = z.object({
  paragraph: z.string().describe('The generated paragraph for the typing test.'),
});
export type GenerateCustomParagraphOutput = z.infer<typeof GenerateCustomParagraphOutputSchema>;

export async function generateCustomParagraph(input: GenerateCustomParagraphInput): Promise<GenerateCustomParagraphOutput> {
  return generateCustomParagraphFlow(input);
}

const generateCustomParagraphPrompt = ai.definePrompt({
  name: 'generateCustomParagraphPrompt',
  input: {schema: GenerateCustomParagraphInputSchema},
  output: {schema: GenerateCustomParagraphOutputSchema},
  prompt: `Generate a paragraph of about 5 sentences on the following topic: {{topic}}. The paragraph should be suitable for a typing speed test. Do not make it a long story, just a concise paragraph.`,
});

const generateCustomParagraphFlow = ai.defineFlow(
  {
    name: 'generateCustomParagraphFlow',
    inputSchema: GenerateCustomParagraphInputSchema,
    outputSchema: GenerateCustomParagraphOutputSchema,
  },
  async input => {
    const {output} = await generateCustomParagraphPrompt(input);
    return output!;
  }
);
