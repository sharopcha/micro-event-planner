import { getEvent } from '@/lib/actions/events'
import { getInvitation } from '@/lib/actions/invitations'
import { InvitationGenerator } from '@/components/invitation-generator'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function InvitationPage({
  params,
}: {
    params: { id: string }
}) {
  const { id } = await params
  
  const event = await getEvent(id)
  if (!event) {
    redirect('/dashboard')
  }

  const invitation = await getInvitation(id)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Invitation Studio</h1>
          <p className="text-muted-foreground">
             Event: <span className="font-semibold text-foreground">{event.name}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/create/review?id=${id}`}>
            <Button variant="outline">
              Edit Event Details
            </Button>
          </Link>
        </div>
      </div>

      <InvitationGenerator 
        eventId={id} 
        event={event}
        initialContent={invitation?.content}
      />
    </div>
  )
}
