'use server'

import { stripe } from '@/lib/stripe/client'
import { getEvent } from '@/lib/actions/events'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(eventId: string) {
  const event = await getEvent(eventId)
  
  if (!event) {
    throw new Error('Event not found')
  }

  // Calculate total price again just to be safe or use stored one
  // Stored total_price is updated by triggers, so it should be accurate
  // But let's verify > 0 ?
  
  if (!event.total_price || event.total_price <= 0) {
      // Allow free checkout? Or error.
      // If base price is 0 and no addons, total is 0.
      // Stripe requires amount > 0.
      // Maybe we charge €1 minimum? Or just skip stripe if 0?
      // Spec says MVP charges money. Let's assume > 0.
      throw new Error('Total price must be greater than 0')
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: { name: `Micro Event Plan: ${event.event_type}` },
        unit_amount: Math.round(event.total_price * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/events/${eventId}/invitation?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/create/review?id=${eventId}&canceled=true`,
    metadata: { event_id: eventId },
  })

  if (session.url) {
    redirect(session.url)
  }
}
