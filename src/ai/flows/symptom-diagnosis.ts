'use server';

/**
 * @fileOverview A symptom diagnosis AI agent.
 *
 * - symptomDiagnosis - A function that handles the symptom diagnosis process.
 * - SymptomDiagnosisInput - The input type for the symptomDiagnosis function.
 * - SymptomDiagnosisOutput - The return type for the symptomDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomDiagnosisInputSchema = z.object({
  name: z.string().describe('The name of the person.'),
  age: z.number().describe('The age of the person.'),
  gender: z.string().describe('The gender of the person.'),
  symptoms: z.array(z.string()).describe('The symptoms the person is experiencing.'),
});
export type SymptomDiagnosisInput = z.infer<typeof SymptomDiagnosisInputSchema>;

const SymptomDiagnosisOutputSchema = z.object({
  condition: z.string().describe('The likely medical condition.'),
  remedy: z.string().describe('A suggested remedy or course of action.'),
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The estimated risk level associated with the symptoms.'),
});
export type SymptomDiagnosisOutput = z.infer<typeof SymptomDiagnosisOutputSchema>;

export async function symptomDiagnosis(input: SymptomDiagnosisInput): Promise<SymptomDiagnosisOutput> {
  return symptomDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomDiagnosisPrompt',
  input: {schema: SymptomDiagnosisInputSchema},
  output: {schema: SymptomDiagnosisOutputSchema},
  prompt: `You are an expert medical diagnostician. Based on the user's name, age, gender, and symptoms, provide a likely condition, a suggested remedy, and a risk level (Low, Medium, or High).

  Name: {{name}}
  Age: {{age}}
  Gender: {{gender}}
  Symptoms: {{#each symptoms}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Provide a diagnosis. Be concise and clear. Prioritize common conditions. Frame the remedy as a suggestion, and always recommend consulting a doctor for serious issues.
  Assign a risk level based on the potential severity of the symptoms. For example, a common cold is 'Low' risk, while symptoms suggesting a heart attack would be 'High' risk.
  `,
});

const symptomDiagnosisFlow = ai.defineFlow(
  {
    name: 'symptomDiagnosisFlow',
    inputSchema: SymptomDiagnosisInputSchema,
    outputSchema: SymptomDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
