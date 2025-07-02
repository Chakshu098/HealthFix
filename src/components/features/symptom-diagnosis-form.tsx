'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, AlertTriangle, HeartPulse } from 'lucide-react';
import { diagnoseSymptoms } from '@/lib/actions';
import type { SymptomDiagnosisOutput } from '@/ai/flows/symptom-diagnosis';
import { Badge } from '@/components/ui/badge';
import { useReports } from '@/context/reports-context';
import type { Report } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const symptomsList = [
  { id: 'fever', label: 'Fever' },
  { id: 'cough', label: 'Cough' },
  { id: 'sore_throat', label: 'Sore Throat' },
  { id: 'headache', label: 'Headache' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'nausea', label: 'Nausea' },
  { id: 'skin_rash', label: 'Skin Rash' },
  { id: 'dizziness', label: 'Dizziness' },
];

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  age: z.coerce.number().min(1, 'Age is required.').max(120),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select a gender.',
  }),
  symptoms: z.array(z.string()).min(1, 'Please select at least one symptom.'),
});

const riskColorMap: Record<string, string> = {
  Low: 'bg-green-500/20 text-green-700 border-green-400/50',
  Medium: 'bg-yellow-500/20 text-yellow-700 border-yellow-400/50',
  High: 'bg-red-500/20 text-red-700 border-red-400/50',
};

export function SymptomDiagnosisForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<SymptomDiagnosisOutput | null>(null);
  const { addReport } = useReports();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: undefined,
      symptoms: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    const response = await diagnoseSymptoms(values);
    
    if (response.error || !response.data) {
      setError(response.error || 'An unknown error occurred.');
    } else {
      setResult(response.data);
      const newReport: Report = {
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        type: 'Symptom',
        diagnosis: response.data,
        userInput: `Name: ${values.name}, Age: ${values.age}, Gender: ${values.gender}, Symptoms: ${values.symptoms.join(', ')}`,
      };
      addReport(newReport);
      toast({
        title: 'Diagnosis Complete',
        description: 'A new report has been generated and saved.',
        action: (
           <Button asChild variant="secondary" size="sm">
            <Link href="/reports">View Reports</Link>
           </Button>
        ),
      });
    }
    
    setIsSubmitting(false);
  }

  const resetForm = () => {
    setResult(null);
    setError(null);
    form.reset();
  }

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        {!result ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4 pt-2"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl><RadioGroupItem value="male" /></FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl><RadioGroupItem value="female" /></FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                       <FormItem className="flex items-center space-x-2">
                        <FormControl><RadioGroupItem value="other" /></FormControl>
                        <FormLabel className="font-normal">Other</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms</FormLabel>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {symptomsList.map((symptom) => (
                      <Button
                        key={symptom.id}
                        type="button"
                        variant={field.value.includes(symptom.id) ? 'default' : 'outline'}
                        onClick={() => {
                          const symptoms = field.value;
                          const newSymptoms = symptoms.includes(symptom.id)
                            ? symptoms.filter((s) => s !== symptom.id)
                            : [...symptoms, symptom.id];
                          field.onChange(newSymptoms);
                        }}
                      >
                        {symptom.label}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && <div className="text-destructive text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4" />{error}</div>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Diagnosing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Diagnose Now
                </>
              )}
            </Button>
          </form>
        </Form>
        ) : (
          <div className="text-center flex flex-col items-center gap-4">
            <HeartPulse className="h-16 w-16 text-primary" />
            <h2 className="text-2xl font-bold">Diagnosis Result</h2>
            <Card className="w-full text-left">
              <CardHeader>
                 <div className="flex justify-between items-start">
                    <CardTitle>Likely Condition: {result.condition}</CardTitle>
                    <Badge variant="outline" className={riskColorMap[result.riskLevel]}>
                        {result.riskLevel} Risk
                    </Badge>
                 </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <strong>Suggested Remedy:</strong> {result.remedy}
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-4">Disclaimer: This is an AI-generated diagnosis and not a substitute for professional medical advice.</p>
              </CardContent>
            </Card>
            <Button onClick={resetForm} className="w-full">
              Start New Diagnosis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
