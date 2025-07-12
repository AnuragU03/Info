
'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getInternshipById, type Internship } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Clock,
  Award,
  BookOpen,
  HandHeart,
  Sparkles,
  ListChecks,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { applyForOpportunity } from '@/app/actions';

type OpportunityPageProps = {
  params: {
    id: string;
  };
};

export default function OpportunityPage({ params }: OpportunityPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, userRole } = useAuth();
  const [opportunity, setOpportunity] = useState<Internship | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchedOpportunity = getInternshipById(params.id);
    if (fetchedOpportunity) {
      setOpportunity(fetchedOpportunity);
    }
    setIsLoading(false);
  }, [params.id]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-16 md:py-24 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
  }

  if (!opportunity) {
    notFound();
  }
  
  const handleApply = async () => {
    if (!isAuthenticated || !userRole) {
        toast({
            variant: 'destructive',
            title: 'Authentication Required',
            description: 'Please log in to apply for this opportunity.',
        });
        router.push('/login');
        return;
    }
    setIsApplying(true);
    const result = await applyForOpportunity(opportunity.id, userRole);
    if (result.success) {
        toast({
            title: 'Application Submitted!',
            description: 'Your application has been received. You can track its status on your dashboard.',
            action: <Button variant="outline" size="sm" onClick={() => router.push('/owner/dashboard')}>Go to Dashboard</Button>,

        });
    } else {
        toast({
            variant: 'destructive',
            title: 'Application Failed',
            description: result.error || 'There was an issue submitting your application.',
        });
    }
    setIsApplying(false);
  };

  const categoryIcons = {
    Internship: <BookOpen className="h-8 w-8 text-primary" />,
    Volunteering: <HandHeart className="h-8 w-8 text-accent" />,
  };
  
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8">
            <Image
                src={opportunity.imageUrl}
                alt={opportunity.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint="volunteers working"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
                <Badge variant={opportunity.category === 'Internship' ? 'default' : 'secondary'} className="mb-2">
                    {opportunity.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-headline font-bold">
                    {opportunity.title}
                </h1>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold font-headline mb-3">About this opportunity</h2>
                    <p className="text-lg text-foreground/80">{opportunity.longDescription}</p>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold font-headline mb-4 flex items-center gap-2">
                        <ListChecks className="h-6 w-6 text-primary" />
                        Responsibilities
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-foreground/80">
                        {opportunity.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                    </ul>
                </div>
            </div>
            <div className="space-y-6">
                <div className="p-6 rounded-lg border bg-card">
                    <div className="flex items-center gap-3 mb-4">
                        {categoryIcons[opportunity.category]}
                        <div>
                             <p className="text-sm text-muted-foreground">Location</p>
                             <p className="font-semibold text-lg">{opportunity.villageName}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <Clock className="h-8 w-8 text-primary" />
                        <div>
                             <p className="text-sm text-muted-foreground">Duration</p>
                             <p className="font-semibold text-lg">{opportunity.duration}</p>
                        </div>
                    </div>
                </div>
                 <div className="p-6 rounded-lg border bg-card">
                     <h3 className="font-semibold font-headline mb-3 flex items-center gap-2">
                         <Award className="h-6 w-6 text-accent" />
                         Benefits
                    </h3>
                     <ul className="list-disc list-inside text-sm text-foreground/70 space-y-1">
                        {opportunity.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                    </ul>
                </div>
                 <Button className="w-full text-lg h-12" onClick={handleApply} disabled={isApplying}>
                    {isApplying ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                         <Sparkles className="mr-2 h-5 w-5" />
                    )}
                   Apply Now
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
