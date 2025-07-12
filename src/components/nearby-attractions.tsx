
'use client';

import { useEffect, useState } from 'react';
import { getNearbyAttractions } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { List, MapPin } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

type NearbyAttractionsProps = {
  villageName: string;
  latitude: number;
  longitude: number;
};

export function NearbyAttractions({ villageName, latitude, longitude }: NearbyAttractionsProps) {
  const [attractions, setAttractions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttractions() {
      if (!villageName) return; // Don't fetch if props aren't ready
      setLoading(true);
      try {
        const result = await getNearbyAttractions(villageName, latitude, longitude);
        setAttractions(result);
      } catch (error) {
        console.error("Failed to fetch nearby attractions", error);
        setAttractions(["Could not load attractions."]);
      } finally {
        setLoading(false);
      }
    }
    fetchAttractions();
  }, [villageName, latitude, longitude]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <List className="h-6 w-6 text-primary" />
          <span>Nearby Attractions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {attractions.map((attraction, index) => (
              <li key={index} className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent mt-1 shrink-0" />
                <span>{attraction}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
