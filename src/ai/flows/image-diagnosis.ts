'use server';

/**
 * @fileOverview Image diagnosis AI agent.
 *
 * - imageDiagnosis - A function that handles the image diagnosis process.
 * - ImageDiagnosisInput - The input type for the imageDiagnosis function.
 * - ImageDiagnosisOutput - The return type for the imageDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageDiagnosisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a skin condition, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type ImageDiagnosisInput = z.infer<typeof ImageDiagnosisInputSchema>;

const ImageDiagnosisOutputSchema = z.object({
  condition: z.string().describe('The likely skin condition.'),
  remedy: z.string().describe('Potential remedies for the condition.'),
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The estimated risk level associated with the symptoms.'),
});
export type ImageDiagnosisOutput = z.infer<typeof ImageDiagnosisOutputSchema>;

export async function imageDiagnosis(input: ImageDiagnosisInput): Promise<ImageDiagnosisOutput> {
  return imageDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageDiagnosisPrompt',
  input: {schema: ImageDiagnosisInputSchema},
  output: {schema: ImageDiagnosisOutputSchema},
  prompt: `You are a dermatologist specializing in diagnosing skin conditions from images.

You will use the image provided to diagnose the likely skin condition, suggest potential remedies, and provide a risk level.
Assign a risk level based on the potential severity of the condition. For example, a minor rash is 'Low' risk, while a condition that looks potentially cancerous is 'High' risk.

Image: {{media url=photoDataUri}}
`,
});

const imageDiagnosisFlow = ai.defineFlow(
  {
    name: 'imageDiagnosisFlow',
    inputSchema: ImageDiagnosisInputSchema,
    outputSchema: ImageDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
