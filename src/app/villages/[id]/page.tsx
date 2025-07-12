
import { getVillageById } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { MapPin, Trees, Sun } from "lucide-react";
import { NearbyAttractions } from "@/components/nearby-attractions";
import { InstagramSummary } from "@/components/instagram-summary";
import { PannellumViewer } from "@/components/pannellum-viewer";
import { AccommodationsList } from "@/components/accommodations-list";
import { Separator } from "@/components/ui/separator";
import { ItineraryPlanner } from "@/components/itinerary-planner";

type VillagePageProps = {
  params: {
    id: string;
  };
};

export default async function VillagePage({ params }: VillagePageProps) {
  const village = await getVillageById(params.id);

  if (!village) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          {village.name}
        </h1>
        <div className="flex items-center text-lg text-muted-foreground mt-2">
          <MapPin className="h-5 w-5 mr-2" />
          {village.location}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
           {village.vrImages && village.vrImages.length > 0 ? (
            <div>
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                <PannellumViewer images={village.vrImages} />
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No 360° view available for this location.</p>
            </div>
          )}

          <div className="prose prose-lg max-w-none text-foreground/90">
            <p>{village.longDescription}</p>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold flex items-center gap-2"><Trees className="text-accent h-6 w-6" />Cultural Attractions</h3>
                <p className="text-foreground/80">{village.culturalAttractions}</p>
            </div>
            <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold flex items-center gap-2"><Sun className="text-primary h-6 w-6" />Unique Offerings</h3>
                <p className="text-foreground/80">{village.uniqueOfferings}</p>
            </div>
          </div>
          
          <Separator />
          
          <AccommodationsList accommodations={village.accommodations} />

        </div>

        <div className="lg:col-span-1 space-y-8">
          <ItineraryPlanner
            villageName={village.name}
            culturalAttractions={village.culturalAttractions}
            uniqueOfferings={village.uniqueOfferings}
          />
          <NearbyAttractions
            villageName={village.name}
            latitude={village.coordinates.latitude}
            longitude={village.coordinates.longitude}
          />
          <InstagramSummary
            villageName={village.name}
            posts={village.instagramPosts}
          />
        </div>
      </div>
    </div>
  );
}
