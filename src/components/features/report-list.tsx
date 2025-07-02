'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Report } from '@/lib/types';
import { getReportSuggestions } from '@/lib/actions';
import { AlertTriangle, Lightbulb, Loader2, Download, FileX2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useReports } from '@/context/reports-context';
import { Logo } from '@/components/logo';

const riskColorMap = {
  Low: 'bg-green-500/20 text-green-700 border-green-400/50',
  Medium: 'bg-yellow-500/20 text-yellow-700 border-yellow-400/50',
  High: 'bg-red-500/20 text-red-700 border-red-400/50',
};

function ImprovementSuggestions({ report }: { report: Report }) {
    const [suggestions, setSuggestions] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fetchSuggestions = async () => {
        setIsLoading(true);
        setError(null);
        setSuggestions([]);
        const response = await getReportSuggestions({
            report: JSON.stringify(report.diagnosis),
            userInputs: report.userInput,
        });
        if(response.success && response.data) {
            setSuggestions(response.data.suggestions);
        } else {
            setError(response.error || 'Could not fetch suggestions.');
        }
        setIsLoading(false);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" onClick={fetchSuggestions}>
                    <Lightbulb className="mr-2 h-4 w-4" /> Improve
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Improvement Suggestions</DialogTitle>
                    <DialogDescription>
                        Here are some AI-powered suggestions to get a more accurate diagnosis next time.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    {isLoading && <div className="flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4"/>Loading suggestions...</div>}
                    {error && <div className="text-destructive flex items-center gap-2"><AlertTriangle className="h-4 w-4"/>{error}</div>}
                    {suggestions.length > 0 && (
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                            {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

const ReportForPdf = React.forwardRef<HTMLDivElement, { report: Report }>(({ report }, ref) => {
    // This component renders the report with a white background and standard text colors for clean PDF generation.
    const pdfRiskColorMap: Record<string, string> = {
      Low: 'bg-green-100 text-green-800 border-green-300',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      High: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
        <div ref={ref} className="p-8 bg-white text-black w-[794px]">
             {/* Report Header */}
             <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                <Logo />
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-800">Health Report</h2>
                    <p className="text-sm text-gray-500">Report ID: {report.id.substring(0, 8)}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(report.date).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Patient Details */}
            <div className="py-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Patient Details</h3>
                <p className="text-gray-600">{report.userInput}</p>
            </div>

            {/* Diagnosis Details */}
            <div className="py-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">AI-Powered Diagnosis</h3>
                        <p className="text-3xl font-bold text-pink-600">{report.diagnosis.condition}</p>
                    </div>
                    <Badge variant="outline" className={`${pdfRiskColorMap[report.diagnosis.riskLevel]} px-4 py-2 text-sm`}>
                        {report.diagnosis.riskLevel} Risk
                    </Badge>
                </div>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-md text-gray-700">Suggested Remedy</h4>
                        <p className="text-gray-600 mt-1">{report.diagnosis.remedy}</p>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="pt-6 border-t mt-6 text-xs text-gray-500 border-gray-200">
                <strong>Disclaimer:</strong> This is an AI-generated diagnosis and not a substitute for professional medical advice. Always consult a qualified healthcare provider for any medical concerns. HealthFix is an AI tool and does not provide medical services.
            </div>
        </div>
    );
});
ReportForPdf.displayName = 'ReportForPdf';

function DownloadReportButton({ report }: { report: Report }) {
    const reportRef = React.useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = React.useState(false);

    const handleDownloadPdf = async () => {
        const element = reportRef.current;
        if (!element) return;
        
        setIsDownloading(true);

        const canvas = await html2canvas(element, { scale: 2 });
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`HealthFix-Report-${report.id.substring(0, 10)}.pdf`);

        setIsDownloading(false);
    };

    return (
        <>
            <div className="absolute left-[-9999px] top-[-9999px]">
                <ReportForPdf report={report} ref={reportRef} />
            </div>
            
            <Button variant="link" className="p-0 h-auto" onClick={handleDownloadPdf} disabled={isDownloading}>
                {isDownloading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Downloading...</>
                ) : (
                    'Download PDF'
                )}
            </Button>
        </>
    )
}

export function ReportList() {
  const { reports } = useReports();
  const sortedReports = React.useMemo(() => [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [reports]);

  if (sortedReports.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center min-h-[400px]">
        <FileX2 className="h-16 w-16 text-muted-foreground/50" />
        <h3 className="text-xl font-medium mt-4">No Reports Found</h3>
        <p className="text-muted-foreground mt-2">Your diagnosis reports will appear here once you use the app.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sortedReports.map((report) => (
        <Card key={report.id} className="flex flex-col glass-card">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="line-clamp-1">{report.diagnosis.condition}</CardTitle>
                <CardDescription>
                  {report.type} Diagnosis on {new Date(report.date).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge variant="outline" className={riskColorMap[report.diagnosis.riskLevel]}>
                {report.diagnosis.riskLevel} Risk
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">
              <strong>Remedy:</strong> {report.diagnosis.remedy}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <DownloadReportButton report={report} />
            <ImprovementSuggestions report={report} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
