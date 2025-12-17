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

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold">Please log in</h2>
        <p className="text-muted-foreground mt-2">You need to be authenticated to view your dashboard.</p>
        <Link href="/login" className="mt-4">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const statusColors: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
    ready: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
    paid: 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          Manage your upcoming micro-events and invitations.
        </p>
      </div>
      
      {(!events || events.length === 0) ? (
        <div className="mt-12 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-2xl bg-muted/30 min-h-[400px]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <CalendarDays className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-2xl font-bold">No events yet</h2>
          <p className="mt-2 text-muted-foreground max-w-sm">
            Create your first micro-event plan in under 5 minutes. We'll help you with the details!
          </p>
          <div className="mt-8">
            <Link href="/create">
              <Button size="lg" className="px-8 shadow-lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Event
              </Button>
            </Link>
          </div>
        </div>
      ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col group transition-all hover:shadow-md hover:border-primary/20">
              <CardHeader className="pb-3 px-6 pt-6">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={(event.status && statusColors[event.status]) || 'bg-gray-100'} variant="secondary">
                    {event.status || 'unknown'}
                  </Badge>
                  {event.budget && (
                    <span className="text-sm font-semibold text-muted-foreground">€{Number(event.budget).toLocaleString()}</span>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold line-clamp-1">{event.name || 'Unnamed Event'}</CardTitle>
                <CardDescription className="capitalize font-medium">{(event.event_type || '').replace('_', ' ')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 text-sm px-6 pb-6">
                <div className="flex items-center text-muted-foreground">
                  <CalendarDays className="mr-3 h-4 w-4 shrink-0 opacity-70" />
                  <span className="truncate">{event.date ? format(new Date(event.date), 'MMMM do, yyyy') : 'Date TBD'}</span>
                 </div>
                 {event.city && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-3 h-4 w-4 shrink-0 opacity-70" />
                    <span className="truncate">{event.city}</span>
                   </div>
                 )}
                 {event.guest_count && (
                  <div className="flex items-center text-muted-foreground">
                    <Users className="mr-3 h-4 w-4 shrink-0 opacity-70" />
                    <span>{event.guest_count} guests</span>
                   </div>
                 )}
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0 mt-auto border-t bg-muted/5 group-hover:bg-muted/10 transition-colors">
                <Link href={event.status === 'paid' ? `/events/${event.id}/invitation` : `/create/basics?id=${event.id}`} className="w-full mt-4">
                  <Button variant={event.status === 'paid' ? 'default' : 'outline'} className="w-full font-semibold">
                    {event.status === 'paid' ? 'Manage Invitation' : 'Continue Planning'} 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}

            <Link href="/create" className="group">
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6 text-center border-2 border-dashed rounded-xl bg-muted/5 group-hover:bg-muted/20 group-hover:border-primary/30 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="mt-4 font-bold text-lg">Add New Event</p>
                <p className="text-sm text-muted-foreground mt-1 px-4 text-balance">Start another plan for your next micro-event.</p>
              </div>
            </Link>
        </div>
      )}
    </div>
  )
}
