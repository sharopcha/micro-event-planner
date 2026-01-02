'use client'

import { useState } from 'react'
import { AddonCategoryTabs } from '@/components/addon-category-tabs'
import { AddonCard } from '@/components/addon-card'
import { VenueSelectionCard } from '@/components/venue-selection-card'
import { Database } from '@/lib/supabase/types'
import { addAddonToEvent, removeAddonFromEvent } from '@/lib/actions/addons'
import { toast } from 'sonner'
import { Check, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Addon = Database['public']['Tables']['addons']['Row']
type SelectedAddon = { addon_id: string; quantity: number; addons: { id: string, name: string, price: number } }

interface SelectionPageContentProps {
  eventId: string
  addons: Addon[]
  selectedAddons: SelectedAddon[]
}

export default function SelectionPageContent({ eventId, addons, selectedAddons }: SelectionPageContentProps) {
  const [stage, setStage] = useState<'venue' | 'services'>(
    selectedAddons.some(sa => {
      const addon = addons.find(a => a.id === sa.addon_id)
      return addon?.category === 'venue'
    }) ? 'services' : 'venue'
  )
  const [category, setCategory] = useState('decor')
  const [optimisticCart, setOptimisticCart] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {}
    selectedAddons.forEach(sa => map[sa.addon_id] = sa.quantity)
    return map
  })
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const venues = addons.filter(a => a.category === 'venue')
  const filteredServices = addons.filter(a => a.category === category && a.category !== 'venue')

  const selectedVenueId = Object.keys(optimisticCart).find(id => {
    const addon = addons.find(a => a.id === id)
    return addon?.category === 'venue' && optimisticCart[id] > 0
  })

  const handleSelectVenue = async (venue: Addon) => {
    setLoadingId(venue.id)
    
    // Remove current venue if any
    if (selectedVenueId && selectedVenueId !== venue.id) {
       try {
         await removeAddonFromEvent(eventId, selectedVenueId)
       } catch {
         // Silently fail or track
       }
    }

    const isRemoving = selectedVenueId === venue.id
    const newCart = { ...optimisticCart }
    
    // Clear other venues
    venues.forEach(v => delete newCart[v.id])
    
    if (!isRemoving) {
      newCart[venue.id] = 1
    }
    
    setOptimisticCart(newCart)

    try {
      if (isRemoving) {
        await removeAddonFromEvent(eventId, venue.id)
      } else {
        await addAddonToEvent(eventId, venue.id, venue.price)
      }
    } catch {
      toast.error('Failed to update venue')
      setOptimisticCart(optimisticCart) // Rollback
    } finally {
      setLoadingId(null)
    }
  }

  const handleAdd = async (addon: Addon) => {
    setLoadingId(addon.id)
    const currentQty = optimisticCart[addon.id] || 0
    setOptimisticCart(prev => ({ ...prev, [addon.id]: currentQty + 1 }))
    
    try {
      await addAddonToEvent(eventId, addon.id, addon.price)
    } catch {
      setOptimisticCart(prev => ({ ...prev, [addon.id]: currentQty })) // Rollback
      toast.error('Failed to add item')
    } finally {
      setLoadingId(null)
    }
  }

  const handleRemove = async (addon: Addon) => {
    setLoadingId(addon.id)
    const currentQty = optimisticCart[addon.id] || 0
    if (currentQty <= 0) return
    
    setOptimisticCart(prev => ({ ...prev, [addon.id]: currentQty - 1 }))
    
    try {
      await removeAddonFromEvent(eventId, addon.id)
    } catch {
      setOptimisticCart(prev => ({ ...prev, [addon.id]: currentQty }))
      toast.error('Failed to remove item')
    } finally {
      setLoadingId(null)
    }
  }

  const summaryItems = Object.entries(optimisticCart).map(([id, quantity]) => {
    const addon = addons.find(a => a.id === id)
    if (!addon || quantity === 0) return null
    return {
      id,
      name: addon.name,
      price: addon.price,
      quantity
    }
  }).filter((i): i is NonNullable<typeof i> => i !== null)

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="space-y-6">
        
        {stage === 'venue' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href={`/create/basics?id=${eventId}`}>
                  <Button variant="ghost" size="sm">
                    ← Back
                  </Button>
                </Link>
                <h2 className="text-2xl font-semibold">Choose Your Vibe</h2>
              </div>
              {selectedVenueId && (
                <Button onClick={() => setStage('services')} className="group">
                  Next: Services <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {venues.map(venue => (
                <VenueSelectionCard 
                  key={venue.id}
                  venue={venue}
                  isSelected={selectedVenueId === venue.id}
                  onSelect={() => handleSelectVenue(venue)}
                  loading={loadingId === venue.id}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => setStage('venue')}>
                  ← Change Venue
                </Button>
                <h2 className="text-2xl font-semibold">Personalize Your Event</h2>
              </div>
              
              <Link href={`/create/review?id=${eventId}`}>
                <Button className="group" size="lg">
                    Review & Finish <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <AddonCategoryTabs 
              selectedCategory={category} 
              onSelect={setCategory} 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
               {filteredServices.map(addon => (
                 <AddonCard 
                   key={addon.id} 
                   addon={addon} 
                   quantity={optimisticCart[addon.id] || 0}
                   onAdd={() => handleAdd(addon)}
                   onRemove={() => handleRemove(addon)}
                 />
               ))}
               {filteredServices.length === 0 && (
                 <div className="col-span-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                   No services found in this category.
                 </div>
               )}
            </div>

            <div className="flex justify-center pt-8 border-t">
               <Link href={`/create/review?id=${eventId}`}>
                 <Button size="lg" className="px-12 h-14 text-lg group">
                   Final Review <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                 </Button>
               </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
