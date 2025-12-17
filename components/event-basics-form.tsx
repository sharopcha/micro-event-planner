'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAutosave } from '@/lib/hooks/use-autosave'
import { updateEvent } from '@/lib/actions/events'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Database } from '@/lib/supabase/types'

const formSchema = z.object({
  name: z.string().optional(),
  date: z.date().optional(),
  time: z.string().optional(),
  is_tbd: z.boolean().default(false),
  guest_count: z.coerce.number().min(1, 'At least 1 guest required').optional(), // Optional for draft, validated at checkout
  budget: z.coerce.number().min(0).optional(),
  city: z.string().optional(),
})

type EventBasicsFormValues = z.infer<typeof formSchema>
type Event = Database['public']['Tables']['events']['Row']

interface EventBasicsFormProps {
  event: Event
}

export function EventBasicsForm({ event }: EventBasicsFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const defaultValues: Partial<EventBasicsFormValues> = {
    name: event.name || '',
    date: event.date ? new Date(event.date) : undefined,
    time: event.time || '', // Time might need better handling if it's strictly TIME type
    is_tbd: !event.date, // Logic: if no date set, assume TBD or just unset
    guest_count: event.guest_count || 0,
    budget: event.budget || 0,
    city: event.city || '',
  }

  const form = useForm<EventBasicsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  })

  const { watch } = form
  const formValues = watch()

  // Auto-save logic
  useAutosave(
    formValues,
    async (values) => {
      setIsSaving(true)
      try {
        // Convert dates to string for Supabase and handle empty strings as null
        const updateData = {
          ...values,
          name: values.name?.trim() || null,
          date: values.date ? format(values.date, 'yyyy-MM-dd') : null,
          time: values.time || null,
          guest_count: values.guest_count || null,
          budget: values.budget || null,
          city: values.city?.trim() || null,
        }
        // Remove helper fields
        delete (updateData as any).is_tbd

        await updateEvent(event.id, updateData)
      } finally {
        setIsSaving(false)
      }
    },
    1000 // 1s debounce
  )

  const onSubmit = async () => {
    // Manual save and continue
    // Check required fields for "Next" button? 
    // Spec says "Allow incomplete drafts", but "Only enable checkout when minimum".
    // For navigation to Addons, we might not block, but good to validate.
    
    // Just navigate to addons
    router.push(`/create/addons?id=${event.id}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Event Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Event Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Sarah's 30th Birthday" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Picker */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={form.watch('is_tbd')}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time & TBD */}
          <div className="space-y-4">
             <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} disabled={form.watch('is_tbd')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_tbd"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                         field.onChange(checked)
                         if (checked) {
                           form.setValue('date', undefined)
                           form.setValue('time', '')
                         }
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Date/Time is TBD
                    </FormLabel>
                    <FormDescription>
                      You can decide this later.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Guest Count */}
          <FormField
            control={form.control}
            name="guest_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guest Count</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormDescription>
                  Used for food/drink calculations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Budget */}
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (€)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step="10" {...field} />
                </FormControl>
                <FormDescription>
                  Helps us recommend affordable options.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Paris" {...field} />
                </FormControl>
                 <FormDescription>
                  Find local vibes (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between pt-6">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/create')}
            >
              Back
            </Button>
            <p className="text-sm text-muted-foreground self-center">
              {isSaving ? 'Saving...' : 'Draft saved'}
            </p>
          </div>
           <Button type="submit" size="lg">
             Next: Addons
           </Button>
        </div>
      </form>
    </Form>
  )
}
