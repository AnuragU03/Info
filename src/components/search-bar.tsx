
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mic, ArrowRight, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";

export function SearchBar() {
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
  );
}
