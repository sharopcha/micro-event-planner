import { getEvent } from '@/lib/actions/events'
import { getEventAddons } from '@/lib/actions/addons'
import { WizardProgress } from '@/components/wizard-progress'
import SelectionPageContent from '@/components/selection-page-content'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function SelectionPage({
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
        <h1 className="text-3xl font-bold">Plan Your Experience</h1>
        <p className="text-muted-foreground">Pick a venue and customize with services.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <WizardProgress currentStep={3} />
      </div>

      <SelectionPageContent 
        eventId={id}
        addons={allAddons || []}
        selectedAddons={(selectedAddons || []).map(a => ({ ...a, quantity: a.quantity ?? 1 }))}
      />
    </div>
  )
}
