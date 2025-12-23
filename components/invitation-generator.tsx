'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useReactToPrint } from 'react-to-print'
import { BabyShowerInvitation } from './baby-shower-invitation'
import { Database } from '@/lib/supabase/types'

type Event = Database['public']['Tables']['events']['Row']

interface InvitationGeneratorProps {
  eventId: string
  event: Event
  initialContent: any
}

export function InvitationGenerator({ eventId, event, initialContent }: InvitationGeneratorProps) {
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  })

  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 order-2 lg:order-1">
        <div className="overflow-auto py-4">
          <div ref={componentRef} className="mx-auto w-fit">
            <BabyShowerInvitation event={event} />
          </div>
        </div>
      </div>

      <div className="space-y-6 order-1 lg:order-2">
        <Card>
          <CardHeader>
            <CardTitle>Share & Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href={`/share/${eventId}`} target="_blank">
              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" /> View Public Page
              </Button>
            </Link>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => handlePrint()}
            >
              <Download className="mr-2 h-4 w-4" /> Download / Print
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
