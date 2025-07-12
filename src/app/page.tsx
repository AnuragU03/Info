
'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VillageCard } from "@/components/village-card";
import { villages } from "@/lib/mock-data";
import { Search, Mic, ArrowRight, Loader2, Eye } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { PannellumViewer } from "@/components/pannellum-viewer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const panoramaImages = [
    {
        src: "https://pannellum.org/images/alma.jpg",
        title: "Alma, Colorado",
        description: "A historic mining town in the Rocky Mountains."
    },
    {
        src: "https://pannellum.org/images/jampan-korea.jpg",
        title: "Jampan, South Korea",
        description: "A beautiful coastal scene."
    },
    {
        src: "https://pannellum.org/images/cerro-toco-0.jpg",
        title: "Andes Mountains",
        description: "Stark, beautiful high-altitude landscapes."
    }
];

export default function Home() {
  const { t, currentLanguage } = useTranslation();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleVoiceSearch = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        variant: 'destructive',
        title: t('Voice search not supported'),
        description: t('Your browser does not support voice search. Please try Chrome.'),
      });
      return;
    }

    if (!recognitionRef.current) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLanguage;

        recognition.onstart = () => {
            setIsListening(true);
            toast({ title: t('Listening...'), description: t('Speak now to search.') });
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
            toast({ title: t('Search term updated:'), description: transcript });
        };

        recognition.onerror = (event) => {
            toast({
                variant: 'destructive',
                title: t('Voice search error'),
                description: event.error === 'not-allowed' ? t('Permission denied. Please allow microphone access.') : t('Something went wrong.'),
            });
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }
    
    // Update language for every request
    recognitionRef.current.lang = currentLanguage;

    if (isListening) {
        recognitionRef.current.stop();
    } else {
        recognitionRef.current.start();
    }
  }, [isListening, t, toast, currentLanguage]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <section 
        className="w-full py-20 md:py-32 text-center bg-muted/50"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 text-foreground">{t("Discover India's Soul")}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-muted-foreground">
            {t("Journey beyond the cities. Find authentic stays and cultural experiences in India's most beautiful villages.")}
          </p>
          <div className="max-w-2xl mx-auto">
            <form className="flex items-center gap-2 bg-background p-2 rounded-lg shadow-lg">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("Search for a village, experience, or region...")}
                  className="w-full pl-10 pr-4 py-2 h-12 text-base text-foreground bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="ghost" size="icon" type="button" onClick={handleVoiceSearch} className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:bg-primary/10">
                  {isListening ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
                </Button>
              </div>
              <Button type="submit" size="lg" className="h-12 text-base">
                {t('Search')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-4">{t('Immerse Yourself in 360°')}</h2>
           <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            {t('Step inside India\'s most breathtaking landscapes. Click and drag to explore these panoramic views.')}
          </p>
          <Carousel className="w-full max-w-4xl mx-auto" opts={{ loop: true }}>
            <CarouselContent>
              {panoramaImages.map((image, index) => (
                <CarouselItem key={index}>
                    <div className="relative">
                        <div className="aspect-video w-full rounded-lg overflow-hidden border">
                            <PannellumViewer images={[image.src]} />
                        </div>
                        <div className="absolute bottom-4 left-4 bg-black/50 text-white p-3 rounded-lg">
                            <h3 className="font-bold font-headline">{t(image.title)}</h3>
                            <p className="text-sm">{t(image.description)}</p>
                        </div>
                    </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-[-50px]" />
            <CarouselNext className="right-[-50px]" />
          </Carousel>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">{t('Featured Villages')}</h2>
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
