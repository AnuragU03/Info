
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
import { Loader2, Sparkles, Minus, Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
        if (line.startsWith('## ')) return `<h2 class="text-xl font-semibold mt-4 mb-2">${line.substring(3)}</h2>`;
        if (line.startsWith('### ')) return `<h3 class="text-lg font-semibold mt-3 mb-1">${line.substring(4)}</h3>`;
        if (line.trim().startsWith('* ')) return `<li class="ml-4 list-disc">${line.substring(2)}</li>`;
        if (line.trim() === '') return `<br/>`
        return `<p>${line}</p>`;
      })
      .join('')
      .replace(/<\/li>(\s*)<li>/g, '</li><li>') // fix list spacing
      
  
    return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
  };

export function ItineraryPlanner({ villageName, culturalAttractions, uniqueOfferings }: ItineraryPlannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(3);

  const handlePlanTrip = async () => {
    setIsOpen(true);
    setItinerary(''); // Clear previous itinerary
    setLoading(true);
    try {
      const result = await getItinerary({ villageName, culturalAttractions, uniqueOfferings, numberOfDays: days });
      setItinerary(result);
    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      setItinerary("Sorry, we couldn't generate an itinerary at this time.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="h-6 w-6 text-primary" />
            <span>AI Itinerary Planner</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
              <Label htmlFor="days-input" className="text-sm font-medium">How many days?</Label>
              <div className="flex items-center gap-2 mt-2">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setDays(Math.max(1, days - 1))}>
                    <Minus className="h-4 w-4" />
                </Button>
                <Input id="days-input" type="number" value={days} readOnly className="w-16 h-9 text-center" />
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setDays(Math.min(10, days + 1))}>
                    <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          <Button onClick={handlePlanTrip} className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
            Plan My {days}-Day Trip
          </Button>
        </CardContent>
      </Card>


      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">Your {days}-Day Itinerary for {villageName}</DialogTitle>
            <DialogDescription>
              An AI-generated plan to help you make the most of your visit.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Crafting your personalized itinerary...</p>
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
