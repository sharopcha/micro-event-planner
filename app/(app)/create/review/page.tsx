import { getEvent } from '@/lib/actions/events'
import { getEventAddons } from '@/lib/actions/addons'
import { finalizeEvent } from '@/lib/actions/events-finalization'
import { WizardProgress } from '@/components/wizard-progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, Users, Wallet, MapPin, Check, Edit, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'

export default async function ReviewPage({
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

  // Refresh total price? Typically we rely on database trigger.
  // But strictly speaking we should query the latest total. event.total_price comes from DB.
  
  const addons = await getEventAddons(id)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Review Your Plan</h1>
        <p className="text-muted-foreground">Everything look good? Ready to finalize.</p>
      </div>

      <WizardProgress currentStep={4} />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Event Essentials</CardTitle>
              <Link href={`/create/basics?id=${id}`}>
                <Button variant="ghost" size="sm"><Edit className="h-4 w-4 mr-1" /> Edit</Button>
              </Link>
            </CardHeader>
            <CardContent className="grid gap-4 pt-4">
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {event.date ? format(new Date(event.date), 'PPP') : 'Date TBD'}
                    {event.time && ` at ${event.time}`}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Guests</p>
                    <p className="text-sm text-muted-foreground">{event.guest_count || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Budget</p>
                    <p className="text-sm text-muted-foreground">€{event.budget || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              {event.city && (
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Location</p>
                    <p className="text-sm text-muted-foreground">{event.city}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Selected Addons</CardTitle>
              <Link href={`/create/selection?id=${id}`}>
                <Button variant="ghost" size="sm"><Edit className="h-4 w-4 mr-1" /> Edit</Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {addons.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No addons selected.</p>
              ) : (
                <div className="space-y-4">
                  {addons.map((item: any) => (
                    <div key={item.addon_id} className="flex justify-between items-center text-sm">
                       <div className="flex items-center space-x-3">
                         <div className="h-8 w-8 rounded bg-muted overflow-hidden relative">
                            {/* Optimally show image */}
                         </div>
                         <div>
                           <p className="font-medium">{item.addons.name}</p>
                           <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                         </div>
                       </div>
                       <div className="font-medium">€{item.price_at_purchase * item.quantity}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Side */}
        <div className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Total Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Event Package</span>
                   <span>€0.00</span>
                 </div>
                 <div className="flex justify-between text-sm mb-2">
                   <span className="text-muted-foreground">Addons ({addons.reduce((acc: number, curr: any) => acc + curr.quantity, 0)})</span>
                   <span>€{event.total_price}</span>
                 </div>
                 <Separator />
                 <div className="flex justify-between font-bold text-lg pt-2">
                   <span>Total</span>
                   <span>€{event.total_price}</span>
                 </div>
              </div>

              <div className="flex flex-col gap-2">
                <form action={finalizeEvent.bind(null, id)}>
                  <Button className="w-full" size="lg">
                    <Check className="mr-2 h-4 w-4" /> Finish & Create Invitation
                  </Button>
                </form>
                <Link href={`/create/selection?id=${id}`}>
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Selection
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Secure payment via Stripe
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
