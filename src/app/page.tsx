
import { VillageCard } from "@/components/village-card";
import { villages } from "@/lib/mock-data";
import { SearchBar } from "@/components/search-bar";
import Image from "next/image";

// NOTE: This page is now a Server Component. All client-side interactivity
// has been moved to the <SearchBar /> component.

export default function Home() {
  const t = (text: string) => text; // Simple placeholder for translation in a Server Component

  return (
    <div className="flex flex-col items-center">
      <section
        className="relative w-full h-[60vh] flex items-center justify-center text-center text-white"
      >
        <Image
          src="https://cdn.corenexis.com/media?0wqlja&168H&p&b&9zq7.jpg"
          alt="A scenic view of an Indian village"
          fill={true}
          style={{objectFit: "cover", objectPosition: "center"}}
          className="z-0"
          data-ai-hint="village landscape"
          priority
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="container relative mx-auto px-4 z-20">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">{t("Discover India's Soul")}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            {t("Journey beyond the cities. Find authentic stays and cultural experiences in India's most beautiful villages.")}
          </p>
          {/* Interactive Search Bar is now its own component */}
          <SearchBar />
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">{t('Featured Villages')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {villages.map((village) => (
              <VillageCard
                key={village.id}
                village={village}
                // Translations can be handled here or passed as simple strings
                name={t(village.name)}
                location={t(village.location)}
                shortDescription={t(village.shortDescription)}
                discoverText={t('Discover More')}
                regionText={t(village.location.split(',')[0])}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
