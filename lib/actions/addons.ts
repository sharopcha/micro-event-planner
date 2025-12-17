'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/lib/supabase/types'

type AddonCategory = Database['public']['Enums']['addon_category']
type EventType = Database['public']['Enums']['event_type']

export async function getAddonsByCategory(
  category: AddonCategory, 
  eventType: EventType, 
  budget?: number | null
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('addons')
    .select('*')
    .eq('category', category)
    .contains('compatible_event_types', [eventType])
    .eq('active', true)
    .order('price', { ascending: true })

  if (error) {
    console.error('Error fetching addons:', error)
    return []
  }

  return data
}

export async function getEventAddons(eventId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('event_addons')
    .select(`
      addon_id,
      quantity,
      price_at_purchase,
      addons (
        id,
        name,
        price,
        image_url
      )
    `)
    .eq('event_id', eventId)

  if (error) {
    console.error('Error fetching event addons:', error)
    return []
  }

  return data
}

export async function addAddonToEvent(eventId: string, addonId: string, price: number) {
  const supabase = await createClient()

  // Check if already exists
  const { data: existing } = await supabase
    .from('event_addons')
    .select('id, quantity')
    .eq('event_id', eventId)
    .eq('addon_id', addonId)
    .single()

  if (existing) {
    // Increment
    await supabase
      .from('event_addons')
      // Ensure quantity is treated as number, default to 0 if null (shouldn't be)
      .update({ quantity: (existing.quantity || 0) + 1, price_at_purchase: price })
      .eq('id', existing.id)
  } else {
    // Insert
    await supabase
      .from('event_addons')
      .insert({
        event_id: eventId,
        addon_id: addonId,
        quantity: 1,
        price_at_purchase: price,
      })
  }

  revalidatePath(`/create/addons`)
}

export async function removeAddonFromEvent(eventId: string, addonId: string) {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('event_addons')
    .select('id, quantity')
    .eq('event_id', eventId)
    .eq('addon_id', addonId)
    .single()

  if (existing && (existing.quantity || 0) > 1) {
    // Decrement
    await supabase
      .from('event_addons')
      .update({ quantity: (existing.quantity || 0) - 1 })
      .eq('id', existing.id)
  } else {
    // Delete
    await supabase
      .from('event_addons')
      .delete()
      .eq('event_id', eventId)
      .eq('addon_id', addonId)
  }

  revalidatePath(`/create/addons`)
}

export async function clearAddon(eventId: string, addonId: string) {
   const supabase = await createClient()
   
   await supabase
     .from('event_addons')
     .delete()
     .eq('event_id', eventId)
     .eq('addon_id', addonId)

   revalidatePath(`/create/addons`)
}
