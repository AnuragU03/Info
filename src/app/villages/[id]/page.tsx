import { getVillageById } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trees, Sun } from "lucide-react";
import { BookingCard } from "@/components/booking-card";
import { NearbyAttractions } from "@/components/nearby-attractions";
import { InstagramSummary } from "@/components/instagram-summary";

type VillagePageProps = {
  params: {
    id: string;
  };
};

export default function VillagePage({ params }: VillagePageProps) {
  const village = getVillageById(params.id);

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
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-headline font-semibold mb-4">VR Preview</h2>
            <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {village.vrImages.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <Image
                        src={src}
                        alt={`VR Preview of ${village.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        data-ai-hint="360 landscape"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          <div className="prose prose-lg max-w-none text-foreground/90 mb-8">
            <p>{village.longDescription}</p>
          </div>

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
        </div>

        <div className="lg:col-span-1 space-y-8">
          <BookingCard />
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
