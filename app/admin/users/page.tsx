import { getUsersStats } from '@/lib/actions/users';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

export default async function UsersPage() {
  const users = await getUsersStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Sign In</TableHead>
              <TableHead>Total Events</TableHead>
              <TableHead>Upcoming Events</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link href={`/admin/users/${user.id}`} className="hover:underline font-medium">
                    {user.email}
                  </Link>
                </TableCell>
                <TableCell>
                  {format(new Date(user.created_at), 'PPP')}
                </TableCell>
                 <TableCell>
                  {user.last_sign_in_at 
                    ? format(new Date(user.last_sign_in_at), 'PPP p') 
                    : 'Never'}
                </TableCell>
                <TableCell>{user.total_events}</TableCell>
                <TableCell>{user.upcoming_events}</TableCell>
              </TableRow>
            ))}
             {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
