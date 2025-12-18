'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Database } from '@/lib/supabase/types'

type Addon = Database['public']['Tables']['addons']['Row']

interface VenueSelectionCardProps {
  venue: Addon
  isSelected: boolean
  onSelect: () => void
  loading?: boolean
}

export function VenueSelectionCard({ venue, isSelected, onSelect, loading }: VenueSelectionCardProps) {
  return (
    <Card 
      className={cn(
        "relative cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 overflow-hidden",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
      onClick={onSelect}
    >
      <div className="aspect-video bg-muted relative">
         {venue.image_url ? (
           <img src={venue.image_url} alt={venue.name} className="object-cover w-full h-full" />
         ) : (
           <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
             <MapPin className="h-12 w-12 opacity-20" />
           </div>
         )}
         <Badge className="absolute top-2 right-2" variant={venue.budget_tag === 'premium' ? 'default' : 'secondary'}>
           {venue.budget_tag}
         </Badge>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-xl">{venue.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{venue.description}</p>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-lg font-bold">€{venue.price}</div>
        <Button 
          variant={isSelected ? "default" : "outline"} 
          size="sm"
          disabled={loading}
        >
          {isSelected ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Selected
            </>
          ) : (
            'Choose'
          )}
        </Button>
      </CardFooter>
      {isSelected && (
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
           <Check className="h-4 w-4" />
        </div>
      )}
    </Card>
  )
}
