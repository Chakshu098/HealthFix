'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, AlertTriangle, Upload, HeartPulse } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { diagnoseImage } from '@/lib/actions';
import Image from 'next/image';
import type { ImageDiagnosisOutput } from '@/ai/flows/image-diagnosis';
import { useReports } from '@/context/reports-context';
import type { Report } from '@/lib/types';
import { Badge } from '../ui/badge';
import Link from 'next/link';

const riskColorMap: Record<string, string> = {
  Low: 'bg-green-500/20 text-green-700 border-green-400/50',
  Medium: 'bg-yellow-500/20 text-yellow-700 border-yellow-400/50',
  High: 'bg-red-500/20 text-red-700 border-red-400/50',
};

// 🧠 Gemini API call
async function getGeminiExplanation(condition: string, remedy: string, risk: string) {
  const prompt = `I have a condition called ${condition} with a risk level of ${risk}. The suggested remedy is: ${remedy}. Explain this in a friendly, emotionally supportive tone.`;
  
  try {
    const res = await fetch("AIzaSyCiyNqt5xjzg2-4kCljTYtvLhmqmnBYCe8", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini could not explain this.";
  } catch (err) {
    return "Error while contacting Gemini.";
  }
}

export function ImageDiagnosisForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<ImageDiagnosisOutput | null>(null);
  const [geminiMessage, setGeminiMessage] = React.useState<string | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addReport } = useReports();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Please upload an image smaller than 4MB.', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPhotoDataUri(dataUri);
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  async function onSubmit() {
    if (!photoDataUri) {
      toast({ title: 'No Image', description: 'Please upload an image first.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    setGeminiMessage(null);

    const response = await diagnoseImage({ photoDataUri });

    if (response.error || !response.success) {
      setError(response.error || 'An unknown error occurred.');
    } else {
      setResult(response.data);

      // Save to reports
      const newReport: Report = {
        id: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-CA'),
        type: 'Image',
        diagnosis: response.data,
        userInput: 'Image of a skin condition.',
      };
      addReport(newReport);

      // Gemini explanation
      const gResponse = await getGeminiExplanation(response.data.condition, response.data.remedy, response.data.riskLevel);
      setGeminiMessage(gResponse);

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
    setGeminiMessage(null);
    setImagePreview(null);
    setPhotoDataUri(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        {!result ? (
          <div className="flex flex-col items-center gap-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
            />
            <div
              className="w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-background/50"
              onClick={handleTriggerUpload}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Image preview" width={256} height={256} className="h-full w-auto object-contain rounded-md" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="mx-auto h-12 w-12" />
                  <p className="mt-2">Click to upload or drag and drop</p>
                  <p className="text-xs">PNG, JPG, WEBP (max 4MB)</p>
                </div>
              )}
            </div>

            {error && <div className="text-destructive text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4" />{error}</div>}

            <Button onClick={onSubmit} className="w-full" disabled={isSubmitting || !imagePreview}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Diagnosing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Diagnose Image
                </>
              )}
            </Button>
          </div>
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

            {/* Gemini AI Support Message */}
            {geminiMessage && (
              <div className="mt-4 text-sm bg-muted p-4 rounded-lg border border-border text-left">
                <p><strong>Gemini says:</strong></p>
                <p className="mt-1">{geminiMessage}</p>
              </div>
            )}

            <Button onClick={resetForm} className="w-full">
              Start New Diagnosis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

