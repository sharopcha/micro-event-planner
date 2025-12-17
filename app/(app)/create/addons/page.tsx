import { getEvent } from '@/lib/actions/events'
import { getAddonsByCategory, getEventAddons } from '@/lib/actions/addons'
import { WizardProgress } from '@/components/wizard-progress'
import AddonsPageContent from '@/components/addons-page-content'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AddonsPage({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  const { id } = await searchParams
  
  if (!id) {
    redirect('/create')
  }

  const event = await getEvent(id)
  if (!event) {
    redirect('/create')
  }

  // Fetch ALL compatible addons (since catalog is small)
  // We can do this by iterating categories, or just make a new function to get ALL by event type
  // For now I'll use raw query here or make a helper
  const supabase = await createClient()
  const { data: allAddons } = await supabase
    .from('addons')
    .select('*')
    .contains('compatible_event_types', [event.event_type])
    .eq('active', true)
    .order('price', { ascending: true })

  const selectedAddons = await getEventAddons(id)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Customize Your Experience</h1>
        <p className="text-muted-foreground">Add decorations, food, and activities.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <WizardProgress currentStep={3} />
      </div>

      <AddonsPageContent 
        eventId={id}
        initialCategory="decor"
        addons={allAddons || []}
        selectedAddons={(selectedAddons || []).map(a => ({ ...a, quantity: a.quantity ?? 1 }))}
      />
    </div>
  )
}
