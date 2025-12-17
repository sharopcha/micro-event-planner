'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { Database } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'

type Addon = Database['public']['Tables']['addons']['Row']

interface AddonCardProps {
  addon: Addon
  quantity: number
  onAdd: () => void
  onRemove: () => void
}

const tagColors: Record<string, string> = {
  cheap: 'bg-green-100 text-green-800 hover:bg-green-100',
  standard: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  premium: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
}

export function AddonCard({ addon, quantity, onAdd, onRemove }: AddonCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden flex flex-col transition-all",
      quantity > 0 && "ring-2 ring-primary border-primary"
    )}>
      <div className="relative aspect-video w-full bg-muted">
        {addon.image_url ? (
           <Image 
             src={addon.image_url} 
             alt={addon.name} 
             fill
             className="object-cover"
           />
        ) : (
           <div className="flex h-full items-center justify-center text-muted-foreground bg-secondary">
             No Image
           </div>
        )}
        <div className="absolute top-2 right-2">
           <Badge variant="secondary" className={cn("capitalize shadow-sm", tagColors[addon.budget_tag])}>
             {addon.budget_tag}
           </Badge>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
           <CardTitle className="text-lg line-clamp-1" title={addon.name}>{addon.name}</CardTitle>
           <span className="font-bold text-lg">€{addon.price}</span>
        </div>
        <CardDescription className="line-clamp-2 text-xs">
          {addon.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 mt-auto">
        {quantity === 0 ? (
          <Button variant="outline" className="w-full" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full bg-accent/50 rounded-md p-1">
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRemove}>
               <Minus className="h-4 w-4" />
             </Button>
             <span className="font-bold text-sm">{quantity}</span>
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAdd}>
               <Plus className="h-4 w-4" />
             </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
