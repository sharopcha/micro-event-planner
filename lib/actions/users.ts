'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getUsersStats() {
  const supabase = await createClient(); // For auth check
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const adminClient = createAdminClient();

  // 1. List all users
  const { data: { users }, error: usersError } = await adminClient.auth.admin.listUsers();

  if (usersError) {
    throw new Error(usersError.message);
  }

  // 2. Fetch all events to aggregate counts
  // Optimization: For large datasets, use .rpc() or raw SQL. 
  // For "micro-event-planner", distinct queries are acceptable for now.
  const { data: events, error: eventsError } = await adminClient
    .from('events')
    .select('user_id, date');

  if (eventsError) {
    throw new Error(eventsError.message);
  }

  // 3. Aggregate data
  const now = new Date();
  
  const stats = users.map(u => {
    const userEvents = events?.filter(e => e.user_id === u.id) || [];
    const totalEvents = userEvents.length;
    const upcomingEvents = userEvents.filter(e => {
       if (!e.date) return false;
       return new Date(e.date) >= now;
    }).length;

    return {
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      total_events: totalEvents,
      upcoming_events: upcomingEvents,
    };
  });

  // Sort by created_at desc
  return stats.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
