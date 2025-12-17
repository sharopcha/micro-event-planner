'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Database } from '@/lib/supabase/types'

type EventType = Database['public']['Enums']['event_type']

export async function createEvent(eventType: EventType) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: event, error } = await supabase
    .from('events')
    .insert({
      user_id: user.id,
      event_type: eventType,
      status: 'draft',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating event:', error)
    throw new Error('Failed to create event')
  }

  redirect(`/create/basics?id=${event.id}`)
}

export async function updateEvent(eventId: string, data: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('events')
    .update(data)
    .eq('id', eventId)

  if (error) {
    console.error('Error updating event:', error)
    throw new Error('Failed to update event')
  }
  
  return { success: true }
}

export async function getEvent(eventId: string) {
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (error) {
    return null
  }

  return event
}
