import { getEventByToken } from '@/lib/actions/share'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, MapPin } from 'lucide-react'
import { format } from 'date-fns'

export default async function SharePage({
  params,
}: {
  params: { token: string }
}) {
  const { token } = await params
  const data = await getEventByToken(token)

  if (!data) {
    notFound()
  }

  const { event, invitation } = data
  const content = invitation?.content || {}

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border-2 border-primary/20">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-serif text-primary">
              {content.headline || event.name}
            </h1>
          </div>

          <div className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap font-serif">
            {content.body || "You are invited!"}
          </div>

          <div className="py-6 space-y-3 bg-slate-50 rounded-lg">
             <div className="flex items-center justify-center space-x-2 text-slate-600">
               <CalendarDays className="h-5 w-5" />
               <span className="font-medium">
                 {event.date ? format(new Date(event.date), 'MMMM d, yyyy') : 'Date TBD'}
                 {event.time && ` at ${event.time}`}
               </span>
             </div>
             {event.city && (
               <div className="flex items-center justify-center space-x-2 text-slate-600">
                 <MapPin className="h-5 w-5" />
                 <span className="font-medium">{event.city}</span>
               </div>
             )}
          </div>

          {content.key_details && (
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
              {content.key_details}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
