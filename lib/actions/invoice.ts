'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getEvent } from './events';
import { getEventAddons } from './addons';
import { sendInvoiceEmail } from '@/lib/email';
import { format } from 'date-fns';

export async function generateAndSendInvoice(eventId: string, recipientEmail: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  try {
    // Fetch event and addons data
    const event = await getEvent(eventId);
    if (!event) {
      return { success: false, error: 'Event not found' };
    }

    const addons = await getEventAddons(eventId);

    // Separate venue and other addons
    const venueAddons = addons.filter((item: any) => item.addons.category === 'venue');
    const otherAddons = addons.filter((item: any) => item.addons.category !== 'venue');

    const venueTotal = venueAddons.reduce((sum: number, item: any) => 
      sum + (item.price_at_purchase * item.quantity), 0
    );
    const addonsTotal = otherAddons.reduce((sum: number, item: any) => 
      sum + (item.price_at_purchase * item.quantity), 0
    );

    // Prepare invoice data
    const invoiceData = {
      eventName: event.name || `${event.event_type.replace(/_/g, ' ')} Event`,
      eventType: event.event_type,
      date: event.date ? format(new Date(event.date), 'PPP') : undefined,
      time: event.time || undefined,
      location: event.city || undefined,
      guestCount: event.guest_count || undefined,
      budget: event.budget ? Number(event.budget) : undefined,
      venue: venueAddons.length > 0 ? {
        name: venueAddons[0].addons.name,
        price: Number(venueAddons[0].price_at_purchase),
        quantity: venueAddons[0].quantity || 1,
      } : undefined,
      addons: otherAddons.map((item: any) => ({
        name: item.addons.name,
        price: Number(item.price_at_purchase),
        quantity: item.quantity || 1,
      })),
      venueTotal: Number(venueTotal),
      addonsTotal: Number(addonsTotal),
      total: Number(venueTotal + addonsTotal),
    };

    // Send email
    const result = await sendInvoiceEmail(recipientEmail, invoiceData);

    if (result.success) {
      return { success: true, message: 'Invoice sent successfully!' };
    } else {
      return { success: false, error: result.error || 'Failed to send invoice' };
    }
  } catch (error) {
    console.error('Error generating invoice:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate invoice' 
    };
  }
}

export async function getInvoiceData(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  try {
    const event = await getEvent(eventId);
    if (!event) {
      return null;
    }

    const addons = await getEventAddons(eventId);

    const venueAddons = addons.filter((item: any) => item.addons.category === 'venue');
    const otherAddons = addons.filter((item: any) => item.addons.category !== 'venue');

    const venueTotal = venueAddons.reduce((sum: number, item: any) => 
      sum + (item.price_at_purchase * item.quantity), 0
    );
    const addonsTotal = otherAddons.reduce((sum: number, item: any) => 
      sum + (item.price_at_purchase * item.quantity), 0
    );

    return {
      event,
      venue: venueAddons.length > 0 ? {
        name: venueAddons[0].addons.name,
        price: Number(venueAddons[0].price_at_purchase),
        quantity: venueAddons[0].quantity || 1,
      } : null,
      addons: otherAddons.map((item: any) => ({
        name: item.addons.name,
        price: Number(item.price_at_purchase),
        quantity: item.quantity || 1,
      })),
      venueTotal: Number(venueTotal),
      addonsTotal: Number(addonsTotal),
      total: Number(venueTotal + addonsTotal),
    };
  } catch (error) {
    console.error('Error fetching invoice data:', error);
    return null;
  }
}
