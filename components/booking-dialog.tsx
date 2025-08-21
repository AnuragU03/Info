
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users, CreditCard, ShieldCheck } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

type BookingDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    accommodationName: string;
};

export function BookingDialog({ isOpen, onClose, accommodationName }: BookingDialogProps) {
  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const { toast } = useToast();

  const handleBooking = () => {
    if (!date?.from || !date?.to) {
        toast({
            variant: 'destructive',
            title: 'Booking Error',
            description: 'Please select a valid date range.',
        });
        return;
    }
    toast({
        title: 'Booking Request Sent!',
        description: `Your request for ${accommodationName} has been submitted.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Book {accommodationName}</DialogTitle>
                <DialogDescription>
                    Select your dates and number of guests to proceed.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="date-range">Select Dates</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date-range"
                            variant={'outline'}
                            className={cn(
                            'w-full justify-start text-left font-normal h-11',
                            !date && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                            date.to ? (
                                <>
                                {format(date.from, 'LLL dd, y')} -{' '}
                                {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                            ) : (
                            <span>Pick a date range</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <div className="flex items-center gap-2">
                        <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        >
                        -
                        </Button>
                        <Input
                        id="guests"
                        type="number"
                        className="w-16 text-center"
                        value={guests}
                        readOnly
                        />
                        <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setGuests(guests + 1)}
                        >
                        +
                        </Button>
                        <Users className="ml-auto h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
            </div>
            <DialogFooter className="flex flex-col items-stretch gap-2">
                <Button size="lg" className="text-lg h-12" onClick={handleBooking}>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Request to Book
                </Button>
                <div className="flex items-center justify-center text-xs text-muted-foreground pt-2">
                    <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-accent" />
                    <span>Booking secured by blockchain for transparency.</span>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
