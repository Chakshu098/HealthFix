// This is an AI-powered tool designed to provide users with suggestions on how to improve their diagnosis reports.
// It provides recommendations on redoing a diagnosis or providing better inputs for a more accurate result.
// The interface is the `improveReportSuggestions` function, which takes `ImproveReportSuggestionsInput` as input and returns `ImproveReportSuggestionsOutput`.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveReportSuggestionsInputSchema = z.object({
  report: z.string().describe('The content of the diagnosis report to be improved.'),
  userInputs: z.string().describe('The user inputs used to generate the report, such as symptoms, age, and gender.'),
});
export type ImproveReportSuggestionsInput = z.infer<typeof ImproveReportSuggestionsInputSchema>;

const ImproveReportSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('A list of suggestions on how to improve the diagnosis report.')
  ).describe('The suggestions for improving the diagnosis report, including redoing the diagnosis with specific input changes.')
});
export type ImproveReportSuggestionsOutput = z.infer<typeof ImproveReportSuggestionsOutputSchema>;

export async function improveReportSuggestions(input: ImproveReportSuggestionsInput): Promise<ImproveReportSuggestionsOutput> {
  return improveReportSuggestionsFlow(input);
}

const improveReportSuggestionsPrompt = ai.definePrompt({
  name: 'improveReportSuggestionsPrompt',
  input: {schema: ImproveReportSuggestionsInputSchema},
  output: {schema: ImproveReportSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide suggestions on how to improve a diagnosis report.

  Based on the current report and the user inputs that generated it, suggest ways to improve the quality of the diagnosis.
  This could include suggestions for redoing the diagnosis with more specific or different inputs.

  Current Report:
  {{report}}

  User Inputs:
  {{userInputs}}

  Suggestions:
  `,
});

const improveReportSuggestionsFlow = ai.defineFlow(
  {
    name: 'improveReportSuggestionsFlow',
    inputSchema: ImproveReportSuggestionsInputSchema,
    outputSchema: ImproveReportSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await improveReportSuggestionsPrompt(input);
    return output!;
  }
);
