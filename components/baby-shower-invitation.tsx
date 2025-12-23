import { Card } from "@/components/ui/card"
import { Database } from "@/lib/supabase/types"
import { format } from "date-fns"

type Event = Database['public']['Tables']['events']['Row']

interface BabyShowerInvitationProps {
  event: Event
}

export function BabyShowerInvitation({ event }: BabyShowerInvitationProps) {
  const formattedDate = event.date 
    ? format(new Date(event.date), 'EEEE, MMMM do') 
    : 'Date TBD'
    
  const formattedYear = event.date
    ? format(new Date(event.date), 'yyyy')
    : new Date().getFullYear()

  const formattedTime = event.time 
    ? new Date(`2000-01-01T${event.time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : 'Time TBD'

  // Format event type for display (e.g., "baby_shower" -> "Baby Shower")
  const eventTypeDisplay = event.event_type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <Card className="relative max-w-2xl w-full overflow-hidden shadow-2xl mx-auto print:shadow-none print:w-full print:max-w-none print:h-screen">
      {/* Decorative Corner Frames */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-primary" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-primary" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-primary" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-primary" />

      {/* Inner Decorative Frame */}
      <div className="absolute inset-8 border-2 border-secondary pointer-events-none" />

      {/* Decorative Circles */}
      <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-accent" />
      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-accent" />
      <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-accent" />
      <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-accent" />

      {/* Content */}
      <div className="relative z-10 px-16 py-20 md:px-20 md:py-24 text-center space-y-8 print:py-12">
        {/* Top Accent */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-accent" />
          <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <div className="h-px w-16 bg-accent" />
        </div>

        {/* Main Title */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-serif text-primary tracking-wide text-pretty">{eventTypeDisplay}</h1>
          <p className="text-lg md:text-xl tracking-[0.3em] uppercase text-muted-foreground font-light">Celebration</p>
        </div>

        {/* Subtitle */}
        <div className="space-y-3">
          <p className="text-xl md:text-2xl font-light text-foreground text-pretty">Please join us in celebrating</p>
          <p className="text-3xl md:text-4xl font-serif text-accent text-balance">{event.name}</p>
          {/* Optional: Add a custom message or description if available */}
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-2 py-4">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-secondary" />
          <div className="w-2 h-2 rounded-full bg-accent" />
        </div>

        {/* Event Details */}
        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif text-primary tracking-wide">{formattedDate}</h2>
            <p className="text-lg text-muted-foreground">{formattedYear} at {formattedTime}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-serif text-accent tracking-wide">{event.city || 'Location TBD'}</h3>
            {/* If we had street address, we'd put it here. For now, city is best we have. */}
          </div>
        </div>

        {/* RSVP Section */}
        <div className="pt-6 space-y-3">
          <div className="h-px w-24 bg-secondary mx-auto" />
          <p className="text-sm md:text-base tracking-widest uppercase text-muted-foreground font-light">
            Please RSVP 
          </p>
          {/* Placeholder for contact info - could be added to event model later */}
        </div>

        {/* Bottom Decorative Element */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <div className="h-px w-16 bg-accent" />
          <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
          </svg>
          <div className="h-px w-16 bg-accent" />
        </div>
      </div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    </Card>
  )
}
