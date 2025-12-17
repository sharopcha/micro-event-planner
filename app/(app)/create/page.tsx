'use client'

import { useState } from 'react'
import { createEvent } from '@/lib/actions/events'
import { EventTypeCard } from '@/components/event-type-card'
import { WizardProgress } from '@/components/wizard-progress'
import { Database } from '@/lib/supabase/types'

type EventType = Database['public']['Enums']['event_type']

export default function CreateEventPage() {
  const [loading, setLoading] = useState<EventType | null>(null)

  const handleSelect = async (type: EventType) => {
    setLoading(type)
    try {
      await createEvent(type)
    } catch (error) {
      console.error(error)
      setLoading(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Planned in Minutes</h1>
        <p className="text-muted-foreground">Choose your event type to get started</p>
      </div>

      <WizardProgress currentStep={1} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-8">
        <EventTypeCard
          type="baby_shower"
          title="Baby Shower"
          description="Celebrate the new arrival with decor, games, and treats."
          onClick={() => handleSelect('baby_shower')}
          loading={loading === 'baby_shower'}
        />
        <EventTypeCard
          type="birthday_party"
          title="Birthday Party"
          description="Ballons, cake, and everything you need for a great bash."
          onClick={() => handleSelect('birthday_party')}
          loading={loading === 'birthday_party'}
        />
        <EventTypeCard
          type="picnic"
          title="Outdoor Picnic"
          description="Enjoy the outdoors with curated food baskets and games."
          onClick={() => handleSelect('picnic')}
          loading={loading === 'picnic'}
        />
        <EventTypeCard
          type="proposal"
          title="Proposal"
          description="Create the perfect romantic moment she'll never forget."
          onClick={() => handleSelect('proposal')}
          loading={loading === 'proposal'}
        />
      </div>

      {loading && (
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          Setting up your draft...
        </p>
      )}
    </div>
  )
}
