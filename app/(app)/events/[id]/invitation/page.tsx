import { getEvent } from '@/lib/actions/events'
import { getInvitation } from '@/lib/actions/invitations'
import { InvitationGenerator } from '@/components/invitation-generator'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: { id: string },
  searchParams: { success?: string }
}) {
  const { id } = await params
  const { success } = await searchParams
  
  const event = await getEvent(id)
  if (!event) {
    redirect('/dashboard')
  }
  
  // If not paid, redirect to review? Or allow preview?
  // Spec says: "invitation editable anytime post-payment", implies locked before?
  // "Draft exists... Checkout enabled...".
  // Maybe user can SEE it but not share it?
  // Let's assume this page is the "Result" page. If not paid, maybe show a "Draft Preview" badge.
  
  const invitation = await getInvitation(id)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm">
          <p className="font-bold">Payment Successful!</p>
          <p>Your event is locked in. Now let's create the perfect invitation.</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Invitation Studio</h1>
          <p className="text-muted-foreground">
             Event: <span className="font-semibold text-foreground">{event.name}</span>
          </p>
        </div>
        <Badge variant={event.status === 'paid' ? 'default' : 'secondary'} className="uppercase">
          {event.status}
        </Badge>
      </div>

      <InvitationGenerator 
        eventId={id} 
        event={event}
        initialContent={invitation?.content}
      />
    </div>
  )
}
