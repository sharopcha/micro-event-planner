import { renderToStream } from '@react-pdf/renderer'
import { InvitationPdf } from '@/components/pdf-template'
import { getEvent } from '@/lib/actions/events'
import { getInvitation } from '@/lib/actions/invitations'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  
  // Verify ownership or public access?
  // For simplicity, let's assume public PDF download if token matches?
  // Or just protected route. 
  // If download is from the app, it's user auth. 
  // If download is from share page, we need public access.
  // We'll rely on server logic context. API routes handle cookies automatically in Next.js?
  // Yes, but standard `GET` requests from browser carry cookies.
  
  const event = await getEvent(id)
  
  // If no event found (e.g. not logged in), check if we can validate via token?
  // For MVP, enable download for logged in user OR if valid share token is present in query header?
  // Let's just assume logged in for now, or fetch as admin if it's public? 
  // Let's use `getEvent` which checks auth by default (via `supabase.auth.getUser`).
  
  if (!event) {
     return new NextResponse('Unauthorized or Not Found', { status: 404 })
  }
  
  const invitation = await getInvitation(id)
  const content = invitation?.content || {}

  const stream = await renderToStream(<InvitationPdf event={event} content={content} />)

  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invitation-${id}.pdf"`,
    },
  })
}
