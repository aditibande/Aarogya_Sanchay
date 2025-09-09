'use server';

/**
 * @fileOverview Provides health information based on user queries, while emphasizing the chatbot is not a substitute for professional medical advice.
 *
 * - getHealthInformation - A function that retrieves health information based on user queries.
 * - HealthInformationInput - The input type for the getHealthInformation function.
 * - HealthInformationOutput - The return type for the getHealthInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthInformationInputSchema = z.object({
  query: z
    .string()
    .describe('The health-related question or query from the user.'),
  language: z
    .string()
    .optional()
    .describe('The language in which the query is made (e.g., Malayalam, Hindi, English).'),
});
export type HealthInformationInput = z.infer<typeof HealthInformationInputSchema>;

const HealthInformationOutputSchema = z.object({
  answer: z
    .string()
    .describe('The informative answer to the health-related question. If the query is not medical, this should state that you can only answer medical questions.'),
  disclaimer: z
    .string()
    .describe(
      'A disclaimer stating that the chatbot is not a substitute for professional medical advice. This should be empty if the query is not medical.'
    ),
});
export type HealthInformationOutput = z.infer<typeof HealthInformationOutputSchema>;

export async function getHealthInformation(
  input: HealthInformationInput
): Promise<HealthInformationOutput> {
  return healthInformationFlow(input);
}

const healthInformationPrompt = ai.definePrompt({
  name: 'healthInformationPrompt',
  input: {schema: HealthInformationInputSchema},
  output: {schema: HealthInformationOutputSchema},
  prompt: `You are a helpful AI assistant exclusively for medical-related questions.

Your role is to provide information on health topics. You must not answer questions that are not related to health or medicine.

If the user asks a question that is not about medicine or health, you must politely decline and say that you can only answer medical-related questions. In this case, the 'disclaimer' field should be empty.

If the question is medical, answer the following question in the user's preferred language (if specified). If no language is specified, answer in English.

Make sure the response is accurate, informative, and easy to understand by a layperson.

If you provide a medical answer, ALWAYS include the following disclaimer in the 'disclaimer' field: "This chatbot is not a substitute for professional medical advice. Consult with a qualified healthcare provider for any health concerns or before making any decisions related to your health or treatment."

Question: {{{query}}}

Output in JSON format.
  `,
});

const healthInformationFlow = ai.defineFlow(
  {
    name: 'healthInformationFlow',
    inputSchema: HealthInformationInputSchema,
    outputSchema: HealthInformationOutputSchema,
  },
  async input => {
    const {output} = await healthInformationPrompt(input);
    return output!;
  }
);
