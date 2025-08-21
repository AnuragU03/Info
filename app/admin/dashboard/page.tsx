
import { getAllBookings, getAllApplications } from '@/lib/mock-data';
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
import { BookCopy, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDashboardPage() {
  const allBookings = getAllBookings();
  const allApplications = getAllApplications();

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
          Admin Dashboard
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Platform-wide overview of bookings and applications.
        </p>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookCopy className="h-6 w-6 text-primary" />
                All Bookings
              </CardTitle>
              <CardDescription>
                A comprehensive list of all reservations.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  {allBookings.map((booking) => (
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                All Applications
              </CardTitle>
              <CardDescription>
                All internship and volunteering applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Opportunity</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.id}</TableCell>
                      <TableCell>{app.userName}</TableCell>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
