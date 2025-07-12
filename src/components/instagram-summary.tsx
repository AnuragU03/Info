
'use client';

import { useEffect, useState } from 'react';
import { getInstagramSummary } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Instagram, MessageCircle } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

type InstagramSummaryProps = {
  villageName: string;
  posts: string[];
};

export function InstagramSummary({ villageName, posts }: InstagramSummaryProps) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      const result = await getInstagramSummary(villageName, posts);
      setSummary(result);
      setLoading(false);
    }
    fetchSummary();
  }, [villageName, posts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Instagram className="h-6 w-6 text-primary" />
          <span>Social Buzz</span>
        </CardTitle>
        <CardDescription>An AI-powered summary of what people are saying online.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="text-foreground/80 italic">"{summary}"</p>
        )}
      </CardContent>
    </Card>
  );
}
