'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PhoneOutgoing, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export function EmergencySos() {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGetLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Could not retrieve your location. Please enable location services.",
            variant: "destructive",
          });
          setLocation('Could not retrieve location.');
          setLoading(false);
        }
      );
    } else {
      toast({
        title: "Unsupported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      setLocation('Geolocation not supported.');
      setLoading(false);
    }
  };

  const handleSendAlert = () => {
    // In a real app, this would send the location and last report to a pre-defined contact.
    toast({
      title: "SOS Alert Sent",
      description: "Your location and last diagnosis have been sent to your emergency contact.",
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          onClick={handleGetLocation}
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl z-50 animate-pulse"
          size="icon"
        >
          <PhoneOutgoing className="h-8 w-8" />
          <span className="sr-only">Emergency SOS</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Emergency SOS</AlertDialogTitle>
          <AlertDialogDescription>
            This will send your current location and last diagnosis report to your emergency contact. Are you sure?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold">Your Location:</h4>
          {loading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> <p>Fetching location...</p></div> : <p>{location}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSendAlert} disabled={!location || location.includes('Could not retrieve')}>Send Alert</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
