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
import { QrCode, Upload, Leaf } from 'lucide-react';

const formSchema = z.object({
  villageName: z.string().min(2, {
    message: 'Village name must be at least 2 characters.',
  }),
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

export default function ListYourSpacePage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      villageName: '',
      description: '',
      culturalAttractions: '',
      uniqueOfferings: '',
      ecoBadges: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Listing Submitted!',
      description: 'Your space has been submitted for review. Thank you!',
    });
    form.reset();
  }

  return (
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
                      Select the sustainability practices you follow.
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
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Upload Images</FormLabel>
                   <FormDescription>
                      Showcase the beauty of your space.
                    </FormDescription>
                  <FormControl>
                    <div className="relative">
                      <Input type="file" className="opacity-0 absolute inset-0 w-full h-full z-10" {...field} />
                      <Button variant="outline" type="button" className="w-full h-12">
                        <Upload className="mr-2 h-4 w-4" />
                        Choose files to upload
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row gap-4">
              <Button type="button" variant="secondary" className="w-full">
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </Button>
              <Button type="submit" className="w-full" size="lg">
                Submit Listing
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
