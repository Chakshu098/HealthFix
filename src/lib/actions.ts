'use server';

import { z } from 'zod';
import { imageDiagnosis, ImageDiagnosisInput } from '@/ai/flows/image-diagnosis';
import { aiChatbot, AIChatbotInput } from '@/ai/flows/ai-chatbot';
import { improveReportSuggestions, ImproveReportSuggestionsInput } from '@/ai/flows/improve-report-suggestions';
import { symptomDiagnosis, SymptomDiagnosisInput } from '@/ai/flows/symptom-diagnosis';
import { revalidatePath } from 'next/cache';

const symptomSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  age: z.coerce.number().min(0).max(120),
  gender: z.enum(['male', 'female', 'other']),
  symptoms: z.array(z.string()).min(1, "Please select at least one symptom."),
});

export async function diagnoseSymptoms(values: z.infer<typeof symptomSchema>) {
  const validatedFields = symptomSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid input." };
  }
  
  try {
    const result = await symptomDiagnosis(validatedFields.data as SymptomDiagnosisInput);
    revalidatePath('/symptom-diagnosis');
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to get diagnosis: ${errorMessage}` };
  }
}


export async function diagnoseImage(values: ImageDiagnosisInput) {
  try {
    const result = await imageDiagnosis(values);
    revalidatePath('/image-diagnosis');
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to diagnose image. Please try again.' };
  }
}

export async function getChatbotReply(values: AIChatbotInput) {
  try {
    const result = await aiChatbot(values);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get a reply. Please try again.' };
  }
}

export async function getReportSuggestions(values: ImproveReportSuggestionsInput) {
  try {
    const result = await improveReportSuggestions(values);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get suggestions. Please try again.' };
  }
}
