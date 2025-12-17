import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const session = event.data.object as any

  if (event.type === 'checkout.session.completed') {
    const eventId = session.metadata.event_id
    const paymentIntentId = session.payment_intent

    console.log(`Payment successful for event: ${eventId}`)

    // Update event status
    // Need a service role client or handle RLS. 
    // Since webhook is external, we probably CANNOT use cookies(). 
    // We need SUPABASE_SERVICE_ROLE_KEY to bypass RLS for webhook updates.
    
    // Create admin client
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabaseAdmin
      .from('events')
      .update({ 
        status: 'paid',
        stripe_payment_intent_id: paymentIntentId,
        paid_at: new Date().toISOString()
      })
      .eq('id', eventId)
    
    if (error) {
      console.error('Error updating event:', error)
      return new NextResponse('Database Error', { status: 500 })
    }
  }

  return new NextResponse(null, { status: 200 })
}
