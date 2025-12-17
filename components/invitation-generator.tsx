'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { generateInvitationContent } from '@/lib/actions/invitations'
import { Loader2, Sparkles, Share2, Download } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface InvitationGeneratorProps {
  eventId: string
  initialContent: any
}

export function InvitationGenerator({ eventId, initialContent }: InvitationGeneratorProps) {
  const [content, setContent] = useState(initialContent || { headline: '', body: '', key_details: '' })
  const [tone, setTone] = useState('friendly')
  const [length, setLength] = useState('short')
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const result = await generateInvitationContent(eventId, { tone, length })
      setContent(result)
      toast.success('Invitation generated!')
    } catch (error) {
       toast.error('Failed to generate invitation')
       console.error(error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Configuration</CardTitle>
            <CardDescription>Customize how your invitation sounds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
               <Label>Tone</Label>
               <Select value={tone} onValueChange={setTone}>
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="friendly">Friendly & Casual</SelectItem>
                   <SelectItem value="elegant">Elegant & Formal</SelectItem>
                   <SelectItem value="excited">Excited & Fun</SelectItem>
                   <SelectItem value="humorous">Humorous</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             
             <div className="space-y-2">
               <Label>Length</Label>
                <Select value={length} onValueChange={setLength}>
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="short">Short & Sweet</SelectItem>
                   <SelectItem value="detailed">Detailed</SelectItem>
                 </SelectContent>
               </Select>
             </div>

             <Button 
               className="w-full" 
               onClick={handleGenerate} 
               disabled={generating}
             >
               {generating ? (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                 </>
               ) : (
                 <>
                   <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                 </>
               )}
             </Button>
          </CardContent>
        </Card>

        {content.headline && (
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
              <Button variant="secondary" className="w-full" disabled>
                 <Download className="mr-2 h-4 w-4" /> Download PDF (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
         <Card className="h-full bg-slate-50 border-2 border-slate-200">
           <CardHeader>
             <CardTitle className="text-center">Preview</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             {generating ? (
                <div className="flex h-64 items-center justify-center text-muted-foreground animate-pulse">
                  Creating magic...
                </div>
             ) : (
               <div className="space-y-4 font-serif text-slate-800 p-6 bg-white shadow-sm rounded-lg">
                 <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Headline</Label>
                    <Input 
                      value={content.headline} 
                      onChange={(e) => setContent({...content, headline: e.target.value})}
                      className="text-xl font-bold border-none shadow-none focus-visible:ring-0 px-0"
                    />
                 </div>
                 
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Body</Label>
                    <Textarea 
                      value={content.body} 
                      onChange={(e) => setContent({...content, body: e.target.value})}
                      className="min-h-[150px] border-none shadow-none focus-visible:ring-0 px-0 text-lg leading-relaxed resize-none"
                    />
                 </div>

                 <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Key Details</Label>
                    <Input 
                      value={content.key_details} 
                      onChange={(e) => setContent({...content, key_details: e.target.value})}
                      className="font-medium border-none shadow-none focus-visible:ring-0 px-0"
                    />
                 </div>
               </div>
             )}
           </CardContent>
         </Card>
      </div>
    </div>
  )
}
