
'use server'

import OpenAI from 'openai'
import { Database } from '@/lib/supabase/types'

type Addon = Database['public']['Tables']['addons']['Row']

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function getAddonRecommendations(vision: string, addons: Addon[]) {
  if (!vision || !process.env.OPENAI_API_KEY) {
    return []
  }

  const addonsList = addons.map(a => `- ${a.name} (ID: ${a.id}, Category: ${a.category}): ${a.description}`).join('\n')

  const prompt = `
    Based on the following event vision, recommend the most suitable addons from the provided list.
    
    Event Vision: "${vision}"
    
    Available Addons:
    ${addonsList}
    
    Return ONLY a JSON array of the IDs of the recommended addons. Do not include any other text.
    Example: ["id1", "id2", "id3"]
  `

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0].message.content
    if (!content) return []

    const result = JSON.parse(content)
    console.log({result, addonsList})
    // Handle case where it might return { "ids": [...] } or just [...]
    const ids = Array.isArray(result) ? result : 
                Array.isArray(result.ids) ? result.ids : 
                Array.isArray(result.recommendations) ? result.recommendations : []
    
    return ids as string[]
  } catch (error) {
    console.error('OpenAI Error:', error)
    return []
  }
}
