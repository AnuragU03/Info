import { type Accommodation } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { BedDouble, Home, CreditCard } from "lucide-react";
import { Button } from "./ui/button";

type AccommodationsListProps = {
    accommodations: Accommodation[];
};

export function AccommodationsList({ accommodations }: AccommodationsListProps) {
    if (!accommodations || accommodations.length === 0) {
        return null;
    }

    const accommodationIcons = {
        'Homestay': <Home className="h-6 w-6 text-primary" />,
        'Hotel': <BedDouble className="h-6 w-6 text-primary" />,
    };

    return (
        <div>
            <h2 className="text-2xl font-headline font-semibold mb-4">
                Places to Stay
            </h2>
            <div className="grid gap-6">
                {accommodations.map((item, index) => (
                    <Card key={index} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            {accommodationIcons[item.type]}
                            <div className="flex-1">
                                <CardTitle className="text-xl font-headline">{item.name}</CardTitle>
                                <CardDescription>{item.type}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-foreground/80">{item.description}</p>
                        </CardContent>
                        <CardFooter>
                             <Button className="w-full">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Check Availability & Book
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
