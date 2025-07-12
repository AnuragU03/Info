
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Upload, Leaf, ScanSearch, Loader2, Sparkles, ChevronDown, BadgePercent, Tag, CircleDollarSign } from 'lucide-react';
import { useState } from 'react';
import { getLocationFromImage, getSuggestedPrice } from '../actions';
import type { SuggestPriceOutput } from '@/ai/flows/suggest-price';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';

const formSchema = z.object({
  villageName: z.string().min(2, {
    message: 'Village name must be at least 2 characters.',
  }),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  culturalAttractions: z.string().min(10, {
    message: 'Please describe the cultural attractions.',
  }),
  uniqueOfferings: z.string().min(10, {
    message: 'Please describe the unique offerings.',
  }),
  ecoBadges: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one eco-badge.',
  }),
  images: z.any().optional(),
});

const ecoBadges = [
  { id: 'eco-friendly', label: 'Eco-friendly Stay' },
  { id: 'organic-farming', label: 'Organic Farming' },
  { id: 'local-handicrafts', label: 'Local Handicrafts Showcase' },
  { id: 'community-tourism', label: 'Community-led Tourism' },
  { id: 'waste-management', label: 'Waste Management Practices' },
];

const MarkdownRenderer = ({ content }: { content: string }) => {
  const html = content
    .split('\n')
    .map(line => {
      if (line.trim().startsWith('✅')) {
        return `<li class="flex items-start gap-2 mb-2"><span class="mt-1">✅</span><span>${line.substring(2).trim()}</span></li>`;
      }
      return '';
    })
    .join('');
  return <ul className="list-none p-0" dangerouslySetInnerHTML={{ __html: html }} />;
};


export default function ListYourSpacePage() {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutofillOpen, setIsAutofillOpen] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState<SuggestPriceOutput | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      villageName: '',
      imageUrl: '',
      description: '',
      culturalAttractions: '',
      uniqueOfferings: '',
      ecoBadges: [],
    },
  });

  const handleAutofill = async () => {
    const imageUrl = form.getValues('imageUrl');
    if (!imageUrl) {
      form.setError('imageUrl', { type: 'manual', message: 'Please provide an image URL to analyze.' });
      return;
    }
    setIsScanning(true);
    try {
      const location = await getLocationFromImage(imageUrl);
      if (location?.villageName) {
        form.setValue('villageName', location.villageName);
        toast({
          title: 'Location Identified!',
          description: `We've pre-filled the village name as ${location.villageName}.`,
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


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await getSuggestedPrice(values);
      setPriceSuggestion(result);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Could not generate a price suggestion at this time.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const handleFinalizeListing = () => {
    setPriceSuggestion(null);
    toast({
      title: 'Listing Submitted!',
      description: 'Your space has been submitted for review. You have earned 50 VillageCoins for your contribution!',
    });
    form.reset();
  }

  const handleGenerateQr = async () => {
    const values = form.getValues();
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Form',
        description: 'Please fill out all required fields before generating a QR code.',
      });
      return;
    }
    
    const qrData = JSON.stringify({
      villageName: values.villageName,
      description: values.description,
      culturalAttractions: values.culturalAttractions,
      uniqueOfferings: values.uniqueOfferings,
      ecoBadges: values.ecoBadges,
    });

    try {
      const QRCode = await import('qrcode');
      const url = await QRCode.toDataURL(qrData);
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'QR Code Error',
        description: 'Could not generate the QR code.',
      });
    }
  };


  return (
    <>
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            List Your Space
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Join our community and share your unique village experience with the world.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Collapsible open={isAutofillOpen} onOpenChange={setIsAutofillOpen}>
              <Card>
                <CardHeader>
                  <CollapsibleTrigger asChild>
                    <button type="button" className="flex justify-between items-center w-full">
                        <div className="text-left">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Autofill from Image
                            </h2>
                            <p className="text-sm text-muted-foreground">Save time by letting AI identify your location.</p>
                        </div>
                        <ChevronDown className={`h-5 w-5 transition-transform ${isAutofillOpen ? 'rotate-180' : ''}`} />
                    </button>
                    </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent>
                      <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormDescription>
                                  Paste an image URL (e.g., from a social media post) and we'll try to identify the location.
                                </FormDescription>
                              <FormControl>
                                <div className="flex items-center gap-2">
                                  <Input placeholder="https://instagram.com/p/..." {...field} />
                                  <Button type="button" onClick={handleAutofill} disabled={isScanning}>
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
                    </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
            
            <FormField
              control={form.control}
              name="villageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Village Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mawali" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your village and the stay you offer..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="culturalAttractions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Cultural Attractions</FormLabel>
                  <FormControl>
                    <Input placeholder="Living root bridges, folk dances, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="uniqueOfferings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Unique Offerings</FormLabel>
                  <FormControl>
                    <Input placeholder="Bamboo craft workshops, local cuisine..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ecoBadges"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-lg">Eco-Badges</FormLabel>
                    <FormDescription>
                      Select the sustainability practices you follow. Each badge earns you VillageCoins!
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ecoBadges.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="ecoBadges"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-accent" /> {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormItem>
                  <FormLabel className="text-lg">Upload Images</FormLabel>
                   <FormDescription>
                      Showcase the beauty of your space. Upload a picture of your eco-practices for verification and to earn extra VillageCoins.
                    </FormDescription>
                  <FormControl>
                    <div className="relative">
                      <Input type="file" className="opacity-0 absolute inset-0 w-full h-full z-10" {...form.register('images')} />
                      <Button variant="outline" type="button" className="w-full h-12">
                        <Upload className="mr-2 h-4 w-4" />
                        Choose files to upload
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>

            <div className="flex flex-col md:flex-row gap-4">
              <Button type="button" variant="secondary" className="w-full" onClick={handleGenerateQr}>
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </Button>
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BadgePercent className="mr-2 h-4 w-4" />
                )}
                Suggest Price & Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
    
    <Dialog open={!!priceSuggestion} onOpenChange={(isOpen) => !isOpen && setPriceSuggestion(null)}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    AI-Powered Price Suggestion
                </DialogTitle>
                <DialogDescription>
                    Based on your listing details, here’s a recommended nightly price to attract travelers.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="text-center bg-primary/10 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Suggested Price</p>
                    <p className="text-4xl font-bold text-primary">
                        ₹{priceSuggestion?.suggestedPrice}
                        <span className="text-lg font-normal text-muted-foreground">/night</span>
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Justification:</h4>
                    {priceSuggestion?.justification && <MarkdownRenderer content={priceSuggestion.justification} />}
                </div>
                 <div className="text-center border-t pt-4">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <CircleDollarSign className="h-5 w-5 text-accent"/>
                        You'll also earn <span className="font-bold text-accent">50 VillageCoins</span> for this listing!
                    </p>
                </div>
            </div>
            <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" onClick={() => setPriceSuggestion(null)}>
                    <Tag className="mr-2 h-4 w-4" />
                    Set Price Manually
                </Button>
                <Button type="button" onClick={handleFinalizeListing}>
                    Accept & Finalize Listing
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    
    <Dialog open={!!qrCodeUrl} onOpenChange={(isOpen) => !isOpen && setQrCodeUrl(null)}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">Your Listing QR Code</DialogTitle>
            <DialogDescription>
              Share this code to link directly to your listing details.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 flex justify-center">
            {qrCodeUrl && <Image src={qrCodeUrl} alt="Listing QR Code" width={256} height={256} />}
          </div>
          <DialogFooter>
            <Button onClick={() => setQrCodeUrl(null)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
