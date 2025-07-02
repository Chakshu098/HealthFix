import { NearbyCenters } from "@/components/features/nearby-centers";

export default function NearbyCentersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Find Health Centers</h1>
        <p className="text-muted-foreground">Discover clinics, hospitals, and pharmacies near your location.</p>
      </div>
      <NearbyCenters />
    </div>
  );
}
