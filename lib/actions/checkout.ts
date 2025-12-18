'use server'

import { getEvent, updateEvent } from '@/lib/actions/events'
import { redirect } from 'next/navigation'
import { sendEventReceipt } from '@/lib/email'
import { createClient } from '@/lib/supabase/server'

export async function createCheckoutSession(eventId: string) {
  const event = await getEvent(eventId)
  
  if (!event) {
    throw new Error('Event not found')
  }

  // Get user email
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userEmail = user?.email || 'test@example.com'

  // Update event status to paid
  await updateEvent(eventId, {
    status: 'paid',
    paid_at: new Date().toISOString(),
    stripe_payment_intent_id: 'mock_payment_' + Math.random().toString(36).substring(7),
  })

  // Send Receipt Email
  await sendEventReceipt(userEmail, event.name || 'Micro Event', event.total_price || 0, eventId)

  // Redirect to success page
  redirect(`/events/${eventId}/invitation?success=true`)
}
