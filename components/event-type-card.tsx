'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Baby, Cake, Mountain, Heart, Loader2 } from 'lucide-react'

interface EventTypeCardProps {
  type: 'baby_shower' | 'birthday_party' | 'picnic' | 'proposal'
  title: string
  description: string
  selected?: boolean
  onClick: () => void
  loading?: boolean
}

const icons = {
  baby_shower: Baby,
  birthday_party: Cake,
  picnic: Mountain,
  proposal: Heart,
}

export function EventTypeCard({ 
  type, 
  title, 
  description, 
  selected, 
  onClick,
  loading 
}: EventTypeCardProps) {
  const Icon = icons[type]

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:border-primary hover:shadow-md",
        selected && "border-primary ring-2 ring-primary ring-offset-2",
        loading && "opacity-50 cursor-not-allowed"
      )}
      onClick={!loading ? onClick : undefined}
    >
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-sm text-muted-foreground">
        {loading ? (
          <div className="flex justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : description}
      </CardContent>
    </Card>
  )
}
