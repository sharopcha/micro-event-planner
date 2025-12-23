'use server'

import { updateEvent } from '@/lib/actions/events'
import { redirect } from 'next/navigation'

export async function finalizeEvent(eventId: string) {
  // Update event status to ready (skipping payment)
  await updateEvent(eventId, {
    status: 'ready', // or 'paid' if that's what triggers the "ready" state in UI, but 'ready' seems more appropriate for free flow
    paid_at: new Date().toISOString(), // Keeping this to denote completion time
  })

  // Redirect to invitation page
  redirect(`/events/${eventId}/invitation`)
}
