
'use client';

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { type Village } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useTranslation } from "@/hooks/use-translation";

type VillageCardProps = {
  village: Village;
};

export function VillageCard({ village }: VillageCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out group">
      <Link href={`/villages/${village.id}`} className="block">
        <div className="relative">
          <Image
            src={village.mainImage}
            alt={`A scenic view of ${t(village.name)}`}
            width={600}
            height={400}
            className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={`${t(village.location.split(',')[0]).toLowerCase()} landscape`}
          />
          <Badge variant="secondary" className="absolute top-3 right-3">{t(village.location.split(',')[0])}</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-headline font-bold text-foreground mb-1">{t(village.name)}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1.5" />
            <span>{t(village.location)}</span>
          </div>
          <p className="text-sm text-foreground/80 mb-4 h-10 overflow-hidden">
            {t(village.shortDescription)}
          </p>
          <Button variant="ghost" className="w-full justify-start p-0 h-auto text-primary hover:text-primary/80">
            {t('Discover More')} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
