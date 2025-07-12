
'use client';

import { getBookingsByOwner, getApplicationsByUser } from '@/lib/mock-data';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, FileText, CircleDollarSign } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UserDashboardPage() {
  const { userRole, villageCoins } = useAuth();
  // In a real app, userRole would be a user ID. We use the role as a proxy for the user ID here.
  const userId = userRole || 'guest';
  
  const ownerBookings = getBookingsByOwner(userId);
  const userApplications = getApplicationsByUser(userId);

  const statusVariant = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Accepted':
        return 'default';
      case 'Pending':
      case 'Under Review':
      case 'Applied':
        return 'secondary';
      case 'Cancelled':
      case 'Rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          User Dashboard
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your bookings, applications, and rewards.
        </p>
      </div>

      <Card className="mb-8 bg-accent/20 border-accent/50">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <CircleDollarSign className="h-6 w-6 text-accent" />
                VillageCoins Balance
            </CardTitle>
            <CardDescription>Your rewards for contributing to the rural economy.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-4xl font-bold text-accent">{villageCoins.toLocaleString()}</div>
            <p className="text-sm text-accent/80 mt-1">Earn coins by hosting, teaching skills, and adopting eco-practices. Use them for supplies or promoting your listing!</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="bookings" disabled={userRole !== 'owner'}>My Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                My Applications
              </CardTitle>
              <CardDescription>
                Track the status of your internship and volunteering applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userApplications.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Opportunity</TableHead>
                        <TableHead>Village</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {userApplications.map((app) => (
                        <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>{app.opportunityTitle}</TableCell>
                        <TableCell>{app.villageName}</TableCell>
                        <TableCell>
                            <Badge variant={statusVariant(app.status) as any}>
                                {app.status}
                            </Badge>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">You haven't applied for any opportunities yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-6 w-6 text-primary" />
                My Bookings
              </CardTitle>
              <CardDescription>
                Here are the reservations for your properties. This is only available for property owners.
              </CardDescription>
            </CardHeader>
            <CardContent>
               {ownerBookings.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Village</TableHead>
                        <TableHead>Guest Name</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {ownerBookings.map((booking) => (
                        <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{booking.villageName}</TableCell>
                        <TableCell>{booking.guestName}</TableCell>
                        <TableCell>{booking.checkIn}</TableCell>
                        <TableCell>{booking.checkOut}</TableCell>
                        <TableCell>
                            <Badge variant={statusVariant(booking.status) as any}>
                            {booking.status}
                            </Badge>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                 ) : (
                    <p className="text-muted-foreground text-center py-8">You have no bookings for your properties.</p>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
