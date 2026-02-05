import { getUserWithEvents } from '@/lib/actions/users';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function UserDetailsPage({
  params,
}: {
  params: { userId: string }
}) {
  const { userId } = await params;
  const { user, events } = await getUserWithEvents(userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/users">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
           <div className="text-sm font-medium leading-none tracking-tight text-muted-foreground">User ID</div>
           <div className="text-2xl font-bold mt-2 truncate text-xs" title={user.id}>{user.id}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
           <div className="text-sm font-medium leading-none tracking-tight text-muted-foreground">Joined</div>
           <div className="text-2xl font-bold mt-2">{format(new Date(user.created_at), 'PPP')}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
           <div className="text-sm font-medium leading-none tracking-tight text-muted-foreground">Last Sign In</div>
           <div className="text-2xl font-bold mt-2 text-sm">
             {user.last_sign_in_at ? format(new Date(user.last_sign_in_at), 'PPP p') : 'Never'}
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Events History</h2>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location (Venue)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name || 'Untitled Event'}</TableCell>
                  <TableCell className="capitalize">{event.event_type.replace('_', ' ')}</TableCell>
                  <TableCell>{event.venue_name}</TableCell>
                  <TableCell>
                    {event.date ? format(new Date(event.date), 'PPP') : 'No Date Set'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={event.status === 'paid' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {events.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No events found for this user.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
