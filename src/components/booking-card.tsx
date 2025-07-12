'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { BookingDialog } from './booking-dialog';

export function BookingCard() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Book Your Stay</CardTitle>
          <CardDescription>
            Experience authentic village life.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Select your dates and number of guests to begin your adventure.</p>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-2">
          <Button size="lg" className="text-lg h-12" onClick={() => setIsBookingOpen(true)}>
            <CreditCard className="mr-2 h-5 w-5" />
            Check Availability
          </Button>
          <div className="flex items-center justify-center text-xs text-muted-foreground pt-2">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-accent" />
            <span>Booking secured by blockchain for transparency.</span>
          </div>
        </CardFooter>
      </Card>
      <BookingDialog 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        accommodationName="your stay"
      />
    </>
  );
}
