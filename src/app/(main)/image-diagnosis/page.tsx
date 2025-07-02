import { ImageDiagnosisForm } from "@/components/features/image-diagnosis-form";

export default function ImageDiagnosisPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Diagnose from Image</h1>
        <p className="text-muted-foreground">Upload a photo of your condition for an AI-powered visual analysis.</p>
      </div>
      <ImageDiagnosisForm />
    </div>
  );
}
