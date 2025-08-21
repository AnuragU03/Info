
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
import { ScanSearch, Loader2, Globe, Upload } from 'lucide-react';
import { getLocationFromImage } from '../actions';
import type { IdentifyLocationFromImageOutput } from '@/ai/flows/identify-location-from-image';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
  imageFile: z.any().optional(),
}).refine(data => data.imageUrl || data.imageFile, {
    message: 'Please provide an image URL or upload a file.',
    path: ['imageUrl'],
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
      imageFile: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsScanning(true);
    setLocationResult(null);
    setSubmittedImageUrl(null);

    let imageDataUri = values.imageUrl;

    if (values.imageFile && values.imageFile[0]) {
        const file = values.imageFile[0];
        imageDataUri = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    }

    if (!imageDataUri) {
        toast({
            variant: 'destructive',
            title: 'No image provided',
            description: 'Please enter a URL or upload a file.',
        });
        setIsScanning(false);
        return;
    }

    setSubmittedImageUrl(imageDataUri);

    try {
      const result = await getLocationFromImage(imageDataUri);
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
  
  const fileRef = form.register('imageFile');

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
            <CardDescription>Paste an image URL or upload a screenshot to identify the village or city.</CardDescription>
          </CardHeader>
          <CardContent>
             <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Tabs defaultValue="url" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="url">Image URL</TabsTrigger>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="url" className="pt-4">
                        <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/image.png" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </TabsContent>
                    <TabsContent value="upload" className="pt-4">
                        <FormField
                            control={form.control}
                            name="imageFile"
                            render={({ field }) => (
                               <FormItem>
                                    <FormLabel>Upload Screenshot</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="file" accept="image/*" {...fileRef} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                </Tabs>
                
                <Button type="submit" disabled={isScanning} className="w-full">
                    {isScanning ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ScanSearch className="mr-2 h-4 w-4" />
                    )}
                    Analyze
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {(isScanning || locationResult) && (
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
                    
                    {locationResult && !isScanning && (
                         <div className="flex flex-col md:flex-row gap-6 items-start">
                             <Image 
                                 src={locationResult.generatedImageUrl} 
                                 alt={`A representative image of ${locationResult.villageName}`}
                                 width={200} height={200} 
                                 className="rounded-lg object-cover aspect-square"
                                 data-ai-hint="village landscape"
                             />
                             <div className="flex-1 pt-2">
                                 {locationResult.villageName ? (
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

                    {!locationResult && !isScanning && form.formState.isSubmitted && (
                         <p className="text-destructive-foreground bg-destructive/10 border border-destructive/50 p-4 rounded-md text-center">
                            We could not confidently identify a location from this image. Please try another one.
                         </p>
                    )}
                </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

    