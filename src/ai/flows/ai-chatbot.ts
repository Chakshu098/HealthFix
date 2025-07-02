// Implemented AI Chatbot flow using Genkit to provide health-related assistance to users.

'use server';

/**
 * @fileOverview Implements an AI-powered chatbot for health-related queries.
 *
 * - aiChatbot - A function that handles user interactions with the chatbot.
 * - AIChatbotInput - The input type for the aiChatbot function.
 * - AIChatbotOutput - The return type for the aiChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatbotInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
});
export type AIChatbotInput = z.infer<typeof AIChatbotInputSchema>;

const AIChatbotOutputSchema = z.object({
  reply: z.string().describe('The chatbot reply to the user message.'),
});
export type AIChatbotOutput = z.infer<typeof AIChatbotOutputSchema>;

export async function aiChatbot(input: AIChatbotInput): Promise<AIChatbotOutput> {
  return aiChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: {schema: AIChatbotInputSchema},
  output: {schema: AIChatbotOutputSchema},
  prompt: `You are a helpful AI assistant specialized in providing health-related information, remedies, and first-aid advice.

  Respond to the user message in a conversational manner, offering accurate and helpful information.

  User Message: {{{message}}}
  `,
});

const aiChatbotFlow = ai.defineFlow(
  {
    name: 'aiChatbotFlow',
    inputSchema: AIChatbotInputSchema,
    outputSchema: AIChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
