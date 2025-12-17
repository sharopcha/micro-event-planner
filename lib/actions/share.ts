'use server'

import { createClient } from '@/lib/supabase/server'

function generateToken(length: number = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function generateShareToken(eventId: string) {
  const supabase = await createClient()

  // Check if token exists
  const { data: existing } = await supabase
    .from('share_tokens')
    .select('token')
    .eq('event_id', eventId)
    .single()

  if (existing) {
    return existing.token
  }

  const token = generateToken(10)
  
  const { error } = await supabase
    .from('share_tokens')
    .insert({
      event_id: eventId,
      token: token
    })
  
  if (error) {
    throw new Error('Failed to create share token')
  }

  return token
}

export async function getEventByToken(token: string) {
  // Use admin client for public access via token
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: tokenData } = await supabaseAdmin
    .from('share_tokens')
    .select('event_id')
    .eq('token', token)
    .single()

  if (!tokenData) return null

  // Fetch event details
  const { data: event } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('id', tokenData.event_id)
    .single()

  const { data: invitation } = await supabaseAdmin
    .from('invitations')
    .select('*')
    .eq('event_id', tokenData.event_id)
    .single()
  
  // Transform content
  const invitationWithContent = invitation ? {
     ...invitation,
     content: invitation.ai_generated_text
  } : null

  return { event, invitation: invitationWithContent }
}
