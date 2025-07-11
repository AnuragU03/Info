'use client';

import { getVillageById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

type CommunityPageProps = {
  params: {
    id: string;
  };
};

export default function CommunityPage({ params }: CommunityPageProps) {
  const village = getVillageById(params.id);

  if (!village) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
            {village.name} Community
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            What's happening in {village.location}?
          </p>
        </div>

        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Join the conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea placeholder={`Share an update or ask a question in ${village.name}...`} className="min-h-[100px]" />
                <Button>
                    <Send className="mr-2 h-4 w-4" />
                    Post Message
                </Button>
            </CardContent>
        </Card>


        <div className="space-y-6">
          {village.communityPosts && village.communityPosts.length > 0 ? (
            village.communityPosts.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={post.avatarUrl} alt={post.author} data-ai-hint="person portrait" />
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="font-semibold text-foreground">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                    <p className="text-foreground/90 mt-1">{post.message}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
                <p>No posts yet in the {village.name} community.</p>
                <p>Be the first to share something!</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
