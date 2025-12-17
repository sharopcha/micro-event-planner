'use client'

import { useState } from 'react'
import { AddonCategoryTabs } from '@/components/addon-category-tabs'
import { AddonCard } from '@/components/addon-card'
import { AddonCartSummary } from '@/components/addon-cart-summary'
import { Database } from '@/lib/supabase/types'
import { addAddonToEvent, removeAddonFromEvent } from '@/lib/actions/addons'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Addon = Database['public']['Tables']['addons']['Row']
type SelectedAddon = { addon_id: string; quantity: number; addons: { id: string, name: string, price: number } }

interface AddonsPageContentProps {
  eventId: string
  initialCategory: string
  addons: Addon[]
  selectedAddons: SelectedAddon[]
}

export default function AddonsPageContent({ eventId, initialCategory, addons, selectedAddons }: AddonsPageContentProps) {
  const [category, setCategory] = useState(initialCategory)
  const [optimisticCart, setOptimisticCart] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {}
    selectedAddons.forEach(sa => map[sa.addon_id] = sa.quantity)
    return map
  })
  const [loadingId, setLoadingId] = useState<string | null>(null)

  // Client-side filtering as initial fetch gets all compatible? 
  // No, the server component fetched ALL valid addons for this event type? 
  // Or fetched category specific? 
  // Let's assume we pass ALL addons for simplicity in MVP (small catalog), 
  // or we need to refetch on category change. Refetch is better for scalability.
  // But for this client component, I need to fetch data.
  // Actually, I should make `create/addons/page.tsx` a Server Component that fetches based on searchParams, 
  // and this content a client component? Or keep state here.
  
  // Let's implement filtering in the client for the MVP since catalog is small (<50 items).
  const filteredAddons = addons.filter(a => a.category === category)

  const handleAdd = async (addon: Addon) => {
    setLoadingId(addon.id)
    const currentQty = optimisticCart[addon.id] || 0
    setOptimisticCart(prev => ({ ...prev, [addon.id]: currentQty + 1 }))
    
    try {
      await addAddonToEvent(eventId, addon.id, addon.price)
    } catch {
      setOptimisticCart(prev => ({ ...prev, [addon.id]: currentQty })) // Rollback
      toast.error('Failed')
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
      toast.error('Failed')
    } finally {
      setLoadingId(null)
    }
  }

  // Derive cart items for summary
  const summaryItems = selectedAddons.map(sa => ({
    id: sa.addon_id,
    name: sa.addons.name,
    price: sa.addons.price,
    quantity: optimisticCart[sa.addon_id] ?? sa.quantity
  })).filter(item => item.quantity > 0)
  // Note: this merge is imperfect if new items added client side aren't in selectedAddons yet (revalidatePath fixes this)

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-8 space-y-6">
        <AddonCategoryTabs 
          selectedCategory={category} 
          onSelect={setCategory} 
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]">
           {filteredAddons.map(addon => (
             <AddonCard 
               key={addon.id} 
               addon={addon} 
               quantity={optimisticCart[addon.id] || 0}
               onAdd={() => handleAdd(addon)}
               onRemove={() => handleRemove(addon)}
             />
           ))}
           {filteredAddons.length === 0 && (
             <div className="col-span-full flex items-center justify-center text-muted-foreground">
               No items found in this category.
             </div>
           )}
        </div>
      </div>
      
      <div className="md:col-span-4">
         <AddonCartSummary 
           items={summaryItems} 
           eventId={eventId}
           onRemove={(id) => {
              const addon = addons.find(a => a.id === id)
              if(addon) handleRemove(addon)
           }} 
         />
      </div>
    </div>
  )
}
