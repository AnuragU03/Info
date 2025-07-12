
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Eye } from 'lucide-react';
import { get360Image } from '../actions';
import { villages, type Village } from '@/lib/mock-data';
import { PannellumViewer } from '@/components/pannellum-viewer';

export default function Discover360Page() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);

  const handleVillageChange = (villageId: string) => {
    const village = villages.find(v => v.id === villageId) || null;
    setSelectedVillage(village);
    setImageUrl(null); // Reset image on village change
  };

  const handleGenerateImage = async () => {
    if (!selectedVillage) {
      toast({
        variant: 'destructive',
        title: 'No Village Selected',
        description: 'Please select a village to generate an image for.',
      });
      return;
    }

    setIsGenerating(true);
    setImageUrl(null);

    try {
      const result = await get360Image({
        villageName: selectedVillage.name,
        location: selectedVillage.location,
        shortDescription: selectedVillage.shortDescription,
      });

      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Image Generation Failed',
          description: result.error,
        });
      } else {
        setImageUrl(result.imageUrl);
        toast({
          title: 'Image Generated!',
          description: `A 360° view of ${selectedVillage.name} is ready.`,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Something went wrong while generating the image.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Discover in 360°</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Generate an immersive, AI-powered 360° panoramic view of our villages.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate a Virtual Tour</CardTitle>
            <CardDescription>
              Select a village and let our AI create a unique 360° image for you to explore.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <Select onValueChange={handleVillageChange}>
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Select a village..." />
              </SelectTrigger>
              <SelectContent>
                {villages.map(village => (
                  <SelectItem key={village.id} value={village.id}>
                    {village.name}, {village.location.split(',')[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleGenerateImage} disabled={isGenerating || !selectedVillage} className="w-full sm:w-auto">
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate View
            </Button>
          </CardContent>
        </Card>

        <Card className="min-h-[50vh] flex items-center justify-center">
            <CardContent className="p-0 w-full h-full">
                {isGenerating && (
                    <div className="flex flex-col items-center justify-center gap-4 h-[50vh]">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground">Generating your 360° view...</p>
                        <p className="text-sm text-muted-foreground/80">This can take up to a minute.</p>
                    </div>
                )}
                
                {!isGenerating && imageUrl && (
                    <div className="aspect-video w-full h-[50vh] rounded-lg overflow-hidden">
                        <PannellumViewer images={[imageUrl]} />
                    </div>
                )}

                {!isGenerating && !imageUrl && (
                    <div className="flex flex-col items-center justify-center gap-4 text-center h-[50vh]">
                        <Eye className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">Your generated 360° view will appear here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
