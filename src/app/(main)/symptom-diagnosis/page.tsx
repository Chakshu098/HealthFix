import { SymptomDiagnosisForm } from "@/components/features/symptom-diagnosis-form";

export default function SymptomDiagnosisPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Diagnose from Symptoms</h1>
        <p className="text-muted-foreground">Enter your details and symptoms to get an AI-powered analysis.</p>
      </div>
      <SymptomDiagnosisForm />
    </div>
  );
}
