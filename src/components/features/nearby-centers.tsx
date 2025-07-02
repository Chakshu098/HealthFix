'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function NearbyCenters() {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapSrc, setMapSrc] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFindCenters = () => {
    setLoading(true);
    setLocation(null);
    setMapSrc(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
          
          // Use a URL that doesn't require an API key for basic embedding.
          setMapSrc(`https://maps.google.com/maps?q=hospitals+and+clinics+near+${latitude},${longitude}&z=14&output=embed`);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Could not retrieve your location. Please enable location services in your browser.",
            variant: "destructive",
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        title: "Unsupported Browser",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-8">
      <Card className="glass-card">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <MapPin className="h-12 w-12 text-primary" />
          <p className="text-center text-muted-foreground">Click the button below to find health centers near your current location.</p>
          <Button onClick={handleFindCenters} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding your location...
              </>
            ) : (
              'Find Centers Near Me'
            )}
          </Button>
          {location && <p className="text-sm text-muted-foreground">Your location: {location}</p>}
        </CardContent>
      </Card>
      
      {loading && !mapSrc && (
        <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {mapSrc && (
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-center">Interactive Map</h2>
          <Card className="w-full h-96 md:h-[600px] rounded-lg overflow-hidden shadow-lg border">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={mapSrc}
              loading="lazy"
              allowFullScreen
            ></iframe>
          </Card>
        </div>
      )}
    </div>
  );
}
