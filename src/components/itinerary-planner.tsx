'use client';

import { useState } from 'react';
import { getItinerary } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Sparkles } from 'lucide-react';

type ItineraryPlannerProps = {
  villageName: string;
  culturalAttractions: string;
  uniqueOfferings: string;
};

// Basic markdown to HTML renderer
const MarkdownRenderer = ({ content }: { content: string }) => {
    const html = content
      .split('\n')
      .map(line => {
        if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
        if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
        if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
        if (line.startsWith('* ')) return `<li>${line.substring(2)}</li>`;
        return `<p>${line}</p>`;
      })
      .join('')
      .replace(/<\/li>(\s*)<li>/g, '</li><li>') // fix list spacing
      .replace(/<p><\/p>/g, '<br/>');
  
    return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
  };

export function ItineraryPlanner({ villageName, culturalAttractions, uniqueOfferings }: ItineraryPlannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlanTrip = async () => {
    setIsOpen(true);
    if (itinerary) return; // Don't re-fetch if we already have it

    setLoading(true);
    const result = await getItinerary({ villageName, culturalAttractions, uniqueOfferings });
    setItinerary(result);
    setLoading(false);
  };

  return (
    <>
      <Button onClick={handlePlanTrip} className="w-full" size="lg">
        <Sparkles className="mr-2 h-5 w-5" />
        Plan My Trip with AI
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">Your 3-Day Itinerary for {villageName}</DialogTitle>
            <DialogDescription>
              An AI-generated plan to help you make the most of your visit.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ScrollArea className="h-96 pr-6">
                <MarkdownRenderer content={itinerary} />
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
