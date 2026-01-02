'use server'

import { updateEvent } from '@/lib/actions/events'
import { redirect } from 'next/navigation'

interface ContactDetails {
  contact_name: string
  contact_email: string
  contact_phone: string
}

export async function finalizeEvent(eventId: string, contactDetails: ContactDetails) {
  // Update event status to ready and save contact details
  await updateEvent(eventId, {
    status: 'ready',
    paid_at: new Date().toISOString(),
    ...contactDetails
  })

  // Redirect to invitation page
  redirect(`/events/${eventId}/invitation`)
}
