'use server'

import { openai } from '@/lib/openai/client'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function generateInvitationContent(eventId: string, preferences: { tone: string, length: string }) {
  const supabase = await createClient()

  // Fetch event details
  const { data: event } = await supabase.from('events').select('*').eq('id', eventId).single()
  if (!event) throw new Error('Event not found')
  
  const prompt = `
    Create an invitation for a ${event.event_type} event.
    Name: ${event.name || 'Event'}
    Date: ${event.date}
    Time: ${event.time}
    Location: ${event.city}
    Guest count: ${event.guest_count}
    
    Tone: ${preferences.tone}
    Length: ${preferences.length}
    
    Return a JSON object with:
    - headline (string)
    - body (string)
    - key_details (string, e.g. "RSVP by Dec 20")
  `

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful event planner. Output valid JSON only." },
      { role: "user", content: prompt }
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  })
  
  const content = JSON.parse(completion.choices[0].message.content || '{}')

  // Save to DB
  const { data: existing } = await supabase.from('invitations').select('id').eq('event_id', eventId).single()
  
  if (existing) {
    await supabase.from('invitations').update({ 
      ai_generated_text: content,
      updated_at: new Date().toISOString()
    }).eq('id', existing.id)
  } else {
    await supabase.from('invitations').insert({
      event_id: eventId,
      ai_generated_text: content,
      template_slug: 'classic',
    })
  }
  
  revalidatePath(`/events/${eventId}/invitation`)
  return content
}

export async function getInvitation(eventId: string) {
  const supabase = await createClient()
  
  const { data } = await supabase.from('invitations').select('*').eq('event_id', eventId).single()
  
  if (data) {
     return {
        ...data,
        content: data.ai_generated_text // Map back for UI compatibility
     }
  }
  return null
}

export async function updateInvitation(invitationId: string, data: any) {
  const supabase = await createClient()
  
  // Map content back to ai_generated_text if present in data
  const updateData = { ...data }
  if (updateData.content) {
     updateData.ai_generated_text = updateData.content
     delete updateData.content
  }
  
  await supabase.from('invitations').update(updateData).eq('id', invitationId)
  if (data.event_id) {
    revalidatePath(`/events/${data.event_id}/invitation`)
  }
}
