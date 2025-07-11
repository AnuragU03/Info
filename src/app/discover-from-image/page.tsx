
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ScanSearch, Loader2, MapPin, Globe } from 'lucide-react';
import { getLocationFromImage } from '../actions';
import type { IdentifyLocationFromImageOutput } from '@/ai/flows/identify-location-from-image';
import Image from 'next/image';

const formSchema = z.object({
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }),
});

export default function DiscoverFromImagePage() {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [locationResult, setLocationResult] = useState<IdentifyLocationFromImageOutput | null>(null);
  const [submittedImageUrl, setSubmittedImageUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsScanning(true);
    setLocationResult(null);
    setSubmittedImageUrl(values.imageUrl);
    try {
      const result = await getLocationFromImage(values.imageUrl);
      if (result) {
        setLocationResult(result);
        toast({
          title: 'Location Identified!',
          description: `We think this is ${result.villageName}, ${result.country}.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Could not identify location',
          description: 'We were unable to identify a location from the provided image.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Something went wrong while analyzing the image.',
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Discover from Image</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Have a picture of a place? Let our AI identify it for you.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analyze Image</CardTitle>
            <CardDescription>Paste the URL of an image to identify the village or city it was taken in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input placeholder="https://instagram.com/p/..." {...field} />
                          <Button type="submit" disabled={isScanning} className="min-w-[120px]">
                            {isScanning ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <ScanSearch className="mr-2 h-4 w-4" />
                            )}
                            Analyze
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {(isScanning || locationResult || submittedImageUrl) && (
          <div className="mt-8">
            <h2 className="text-2xl font-headline font-semibold mb-4 text-center">Analysis Result</h2>
            <Card>
                <CardContent className="p-6">
                    {isScanning && (
                         <div className="flex flex-col items-center justify-center gap-4 p-8">
                             <Loader2 className="h-10 w-10 animate-spin text-primary" />
                             <p className="text-muted-foreground">Analyzing image... this may take a moment.</p>
                         </div>
                    )}
                    
                    {submittedImageUrl && !isScanning && (
                         <div className="flex flex-col md:flex-row gap-6 items-start">
                             <Image 
                                 src={submittedImageUrl} 
                                 alt="Submitted for analysis" 
                                 width={200} height={200} 
                                 className="rounded-lg object-cover aspect-square"
                                 data-ai-hint="location"
                             />
                             <div className="flex-1 pt-2">
                                 {locationResult ? (
                                     <div className="space-y-3">
                                         <h3 className="text-xl font-bold font-headline">{locationResult.villageName}</h3>
                                         <div className="flex items-center text-muted-foreground">
                                             <Globe className="mr-2 h-5 w-5" />
                                             <span>{locationResult.country}</span>
                                         </div>
                                         <Button>Explore Stays in {locationResult.villageName}</Button>
                                     </div>
                                 ) : (
                                     <p className="text-destructive-foreground bg-destructive/10 border border-destructive/50 p-4 rounded-md">
                                         We could not confidently identify a location from this image. Please try another one.
                                     </p>
                                 )}
                             </div>
                         </div>
                    )}
                </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
