'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IndianRupee, Video, AlertTriangle } from 'lucide-react';

export default function VideoConsultationPage() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [paid, setPaid] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!paid) return;

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();
  }, [paid, toast]);

  const handlePayment = () => {
    // This is a mock payment simulation.
    toast({
      title: 'Payment Successful',
      description: 'You can now start your consultation.',
    });
    setPaid(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Video Consultation</h1>
        <p className="text-muted-foreground">Connect with a qualified doctor from the comfort of your home.</p>
      </div>
      
      {!paid ? (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video /> One-Time Consultation
            </CardTitle>
            <CardDescription>
              Get a 15-minute video consultation with a certified doctor. No subscription required.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold flex items-center justify-center">
              <IndianRupee className="h-10 w-10" />99
            </p>
            <p className="text-muted-foreground">per call</p>
          </CardContent>
          <CardContent>
            <Button className="w-full" size="lg" onClick={handlePayment}>
              Pay & Start Consultation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle>Live Consultation</CardTitle>
                <CardDescription>You are connected. The doctor will join shortly.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-background/50 rounded-lg p-2">
                    <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                </div>
                 {hasCameraPermission === false && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access in your browser to use this feature.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
