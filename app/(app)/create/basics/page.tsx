import { getEvent } from '@/lib/actions/events'
import { EventBasicsForm } from '@/components/event-basics-form'
import { WizardProgress } from '@/components/wizard-progress'
import { redirect } from 'next/navigation'

export default async function CreateBasicsPage({
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Event Essentials</h1>
        <p className="text-muted-foreground">Tell us a bit about what you're planning.</p>
      </div>

      <WizardProgress currentStep={2} />

      <div className="max-w-2xl mx-auto border rounded-xl p-8 bg-card shadow-sm">
        <EventBasicsForm event={event} />
      </div>
    </div>
  )
}
