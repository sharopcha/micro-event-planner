'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'

interface SelectedAddon {
  id: string
  name: string
  price: number
  quantity: number
}

interface AddonCartSummaryProps {
  items: SelectedAddon[]
  eventId: string
  onRemove: (addonId: string) => void
}

export function AddonCartSummary({ items, eventId, onRemove }: AddonCartSummaryProps) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <Card className="h-fit sticky top-20">
      <CardHeader className="pb-3 space-y-1">
         <CardTitle className="flex items-center text-lg">
           <ShoppingBag className="mr-2 h-5 w-5" /> Summary
         </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[300px] pr-4">
           {items.length === 0 && (
             <p className="text-sm text-muted-foreground text-center py-8">
               No addons selected yet.
             </p>
           )}
           <div className="space-y-3">
             {items.map(item => (
               <div key={item.id} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                     <p className="font-medium">{item.name}</p>
                     <p className="text-xs text-muted-foreground">x{item.quantity} @ €{item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                     <span>€{item.price * item.quantity}</span>
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-4 w-4 hover:bg-destructive/10 hover:text-destructive"
                       onClick={() => onRemove(item.id)}
                     >
                       <X className="h-3 w-3" />
                     </Button>
                  </div>
               </div>
             ))}
           </div>
        </ScrollArea>
        
        <Separator />
        
        <div className="flex justify-between items-center font-bold text-lg">
           <span>Total</span>
           <span>€{total}</span>
        </div>

        <div className="space-y-2">
          <Link href={`/create/review?id=${eventId}`}>
            <Button className="w-full" disabled={items.length === 0}>
              Review & Checkout
            </Button>
          </Link>
          <Link href={`/create/basics?id=${eventId}`}>
            <Button variant="ghost" className="w-full">
              Back to Basics
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
