
import Image from 'next/image';
import { internships } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Award, BookOpen, HandHeart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function InternshipsPage() {
  const categoryIcons = {
    Internship: <BookOpen className="h-6 w-6 text-primary" />,
    Volunteering: <HandHeart className="h-6 w-6 text-accent" />,
  };

  const sdgColors: { [key: number]: string } = {
    4: 'bg-red-500', // Quality Education
    9: 'bg-orange-500', // Industry, Innovation and Infrastructure
    10: 'bg-pink-500', // Reduced Inequalities
    11: 'bg-yellow-500', // Sustainable Cities and Communities
    12: 'bg-yellow-600', // Responsible Consumption and Production
  };

  const sdgHints: { [key: number]: string } = {
    4: 'SDG 4: Quality Education',
    9: 'SDG 9: Industry, Innovation and Infrastructure',
    10: 'SDG 10: Reduced Inequalities',
    11: 'SDG 11: Sustainable Cities and Communities',
    12: 'SDG 12: Responsible Consumption and Production',
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            Internships & Volunteering
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Our "Reverse Tourism" initiative invites you to be more than a tourist. Contribute your skills, learn from local experts, and become a knowledge bridge for rural communities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {internships.map((opportunity) => (
            <Card key={opportunity.id} className="flex flex-col group hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="relative mb-4">
                  <Image
                    src={opportunity.imageUrl}
                    alt={opportunity.title}
                    width={600}
                    height={300}
                    className="rounded-lg object-cover w-full h-48"
                    data-ai-hint="volunteering students"
                  />
                  <Badge className="absolute top-3 right-3" variant={opportunity.category === 'Internship' ? 'default' : 'secondary'}>
                    {opportunity.category}
                  </Badge>
                </div>
                <CardTitle className="font-headline text-2xl flex items-center gap-3">
                  {categoryIcons[opportunity.category]}
                  {opportunity.title}
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground gap-4 pt-1">
                    <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {opportunity.villageName}</div>
                    <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {opportunity.duration}</div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-foreground/80">
                  {opportunity.description}
                </p>
                <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Award className="h-4 w-4 text-primary" />Benefits:</h4>
                    <ul className="list-disc list-inside text-sm text-foreground/70 space-y-1">
                        {opportunity.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                    </ul>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-4">
                <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-muted-foreground">SDG Impact:</p>
                    <div className="flex gap-1.5">
                    {opportunity.sdgs.map(sdg => (
                        <div key={sdg} className={`w-4 h-4 rounded-full ${sdgColors[sdg]}`} title={sdgHints[sdg]} />
                    ))}
                    </div>
                </div>
                <Button asChild className="w-full">
                    <Link href={`/internships-volunteering/${opportunity.id}`}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Learn More & Apply
                    </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
