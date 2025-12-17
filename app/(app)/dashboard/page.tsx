import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Plus, MapPin, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  // Middleware protects this route, so user is present but types might say optional.
  if (!user) {
    // Fallback
    return <div>Please log in</div>
  }

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const statusColors: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    ready: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    paid: 'bg-green-100 text-green-800 hover:bg-green-100',
    cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Link href="/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </Link>
      </div>
      
      {(!events || events.length === 0) ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed">
          <div className="rounded-full bg-muted p-4 mb-4">
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle>No events yet</CardTitle>
            <CardDescription>
              Create your first micro-event plan in under 5 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/create">
              <Button>Create Event</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge className={(event.status && statusColors[event.status]) || 'bg-gray-100'}>
                    {event.status || 'unknown'}
                  </Badge>
                  {event.budget && (
                     <span className="text-sm font-medium text-muted-foreground">€{event.budget}</span>
                  )}
                </div>
                <CardTitle className="pt-2">{event.name || 'Unnamed Event'}</CardTitle>
                <CardDescription className="capitalize">{(event.event_type || '').replace('_', ' ')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 text-sm text-muted-foreground">
                 <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                    {event.date ? format(new Date(event.date), 'PPP') : 'Date TBD'}
                 </div>
                 {event.city && (
                   <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 opacity-70" />
                      {event.city}
                   </div>
                 )}
                 {event.guest_count && (
                   <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 opacity-70" />
                      {event.guest_count} guests
                   </div>
                 )}
              </CardContent>
              <CardFooter className="pt-2">
                <Link href={event.status === 'paid' ? `/events/${event.id}/invitation` : `/create/basics?id=${event.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    {event.status === 'paid' ? 'Manage Invitation' : 'Continue Planning'} 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
