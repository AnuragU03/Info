'use client';

import { useState } from 'react';
import { type Accommodation } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { BedDouble, Home, CreditCard, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { PannellumViewer } from './pannellum-viewer';

type AccommodationsListProps = {
    accommodations: Accommodation[];
};

export function AccommodationsList({ accommodations }: AccommodationsListProps) {
    const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);

    if (!accommodations || accommodations.length === 0) {
        return null;
    }

    const accommodationIcons = {
        'Homestay': <Home className="h-6 w-6 text-primary" />,
        'Hotel': <BedDouble className="h-6 w-6 text-primary" />,
    };

    return (
        <>
            <div>
                <h2 className="text-2xl font-headline font-semibold mb-4">
                    Places to Stay
                </h2>
                <div className="grid gap-6">
                    {accommodations.map((item, index) => (
                        <Card key={index} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
                            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                                {accommodationIcons[item.type]}
                                <div className="flex-1">
                                    <CardTitle className="text-xl font-headline">{item.name}</CardTitle>
                                    <CardDescription>{item.type}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-foreground/80">{item.description}</p>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row gap-2">
                                {item.vrImages && item.vrImages.length > 0 && (
                                     <Button variant="outline" className="w-full" onClick={() => setSelectedAccommodation(item)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View in 360°
                                    </Button>
                                )}
                                <Button className="w-full">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Check Availability & Book
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
            
            <Dialog open={!!selectedAccommodation} onOpenChange={(isOpen) => !isOpen && setSelectedAccommodation(null)}>
                <DialogContent className="sm:max-w-3xl h-[80vh]">
                    {selectedAccommodation && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-headline">360° View of {selectedAccommodation.name}</DialogTitle>
                                <DialogDescription>
                                    Look around the {selectedAccommodation.type.toLowerCase()}. Click and drag to explore.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="h-full py-4 flex-1">
                                <PannellumViewer images={selectedAccommodation.vrImages} />
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
