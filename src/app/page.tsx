import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VillageCard } from "@/components/village-card";
import { villages } from "@/lib/mock-data";
import { Search, Mic, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section 
        className="w-full py-20 md:py-32 bg-cover bg-center text-center" 
        style={{backgroundImage: "url('https://placehold.co/1600x800.png')", backgroundBlendMode: 'multiply', backgroundColor: 'rgba(0,0,0,0.4)'}}
        data-ai-hint="Indian village sunset"
      >
        <div className="container mx-auto px-4 text-white">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">Discover India's Soul</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Journey beyond the cities. Find authentic stays and cultural experiences in India's most beautiful villages.
          </p>
          <div className="max-w-2xl mx-auto">
            <form className="flex items-center gap-2 bg-white/90 p-2 rounded-lg shadow-lg">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for a village, experience, or region..."
                  className="w-full pl-10 pr-4 py-2 h-12 text-base text-foreground bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:bg-primary/10">
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
              <Button type="submit" size="lg" className="h-12 text-base">
                Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">Featured Villages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {villages.map((village) => (
              <VillageCard key={village.id} village={village} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
