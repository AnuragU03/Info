import { villages } from '@/lib/mock-data';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesSquare, ArrowRight } from 'lucide-react';

export default function CommunityHubPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            Village Communities
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Join the conversation, ask questions, and share your experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {villages.map((village) => (
            <Link href={`/community/${village.id}`} key={village.id} className="group">
              <Card className="h-full flex flex-col hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <MessagesSquare className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline text-2xl">{village.name} Community</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground mb-4">
                    Discuss travel tips, upcoming events, and connect with fellow travelers and locals in {village.name}.
                  </p>
                  <div className="flex items-center text-primary font-semibold">
                    Join Discussion
                    <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
