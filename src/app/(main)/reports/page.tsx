import { ReportList } from "@/components/features/report-list";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
       <div className="text-left mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Health Reports</h1>
        <p className="text-muted-foreground">Review your past diagnoses and AI-powered suggestions.</p>
      </div>
      <ReportList />
    </div>
  );
}
