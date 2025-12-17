'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Database } from '@/lib/supabase/types'

type AddonCategory = Database['public']['Enums']['addon_category']

interface AddonCategoryTabsProps {
  selectedCategory: string
  onSelect: (category: string) => void
  counts?: Record<string, number>
}

const categories: { id: AddonCategory; label: string }[] = [
  { id: 'decor', label: 'Decor' },
  { id: 'food', label: 'Food' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'activities', label: 'Activities' },
  { id: 'music', label: 'Music' },
  { id: 'photography', label: 'Photography' },
  { id: 'extras', label: 'Extras' },
]

export function AddonCategoryTabs({ selectedCategory, onSelect, counts }: AddonCategoryTabsProps) {
  return (
    <Tabs value={selectedCategory} onValueChange={onSelect} className="w-full">
      <TabsList className="w-full h-auto flex-wrap justify-start">
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id} className="capitalize">
            {category.label}
             {counts && counts[category.id] ? (
               <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                 {counts[category.id]}
               </span>
             ) : null}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
