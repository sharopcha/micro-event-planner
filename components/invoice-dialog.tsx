'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FileText, Send, Loader2 } from 'lucide-react';
import { generateAndSendInvoice } from '@/lib/actions/invoice';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface InvoiceDialogProps {
  eventId: string;
  event: any;
  venue: {
    name: string;
    price: number;
    quantity: number;
  } | null;
  addons: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  venueTotal: number;
  addonsTotal: number;
  total: number;
  userEmail?: string;
}

export function InvoiceDialog({
  eventId,
  event,
  venue,
  addons,
  venueTotal,
  addonsTotal,
  total,
  userEmail = '',
}: InvoiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(userEmail);
  const [isSending, setIsSending] = useState(false);

  const eventTypeFormatted = event.event_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  const eventName = event.name || `${eventTypeFormatted} Event`;

  const handleSendInvoice = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSending(true);
    try {
      const result = await generateAndSendInvoice(eventId, email);
      
      if (result.success) {
        toast.success(result.message || 'Invoice sent successfully!');
        setOpen(false);
      } else {
        toast.error(result.error || 'Failed to send invoice');
      }
    } catch (error) {
      toast.error('An error occurred while sending the invoice');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" size="lg">
          <FileText className="mr-2 h-4 w-4" />
          Send Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice Preview
          </DialogTitle>
          <DialogDescription>
            Review your invoice details and send it to your email
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-lg mb-4 text-purple-900">Event Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Event Name:</span>
                <span className="font-medium">{eventName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Event Type:</span>
                <span className="font-medium">{eventTypeFormatted}</span>
              </div>
              {event.date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {format(new Date(event.date), 'PPP')}
                    {event.time && ` at ${event.time}`}
                  </span>
                </div>
              )}
              {event.city && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{event.city}</span>
                </div>
              )}
              {event.guest_count && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Guest Count:</span>
                  <span className="font-medium">{event.guest_count}</span>
                </div>
              )}
              {event.budget && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium">€{Number(event.budget).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Venue Section */}
          {venue && (
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold mb-3 text-purple-900">Venue</h3>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{venue.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">x{venue.quantity}</span>
                  <span className="font-semibold">€{(venue.price * venue.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Addons Section */}
          {addons.length > 0 && (
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold mb-3 text-purple-900">Services & Add-ons</h3>
              <div className="space-y-2">
                {addons.map((addon, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{addon.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">x{addon.quantity}</span>
                      <span className="font-semibold">€{(addon.price * addon.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
            {venue && (
              <div className="flex justify-between mb-2">
                <span>Venue Total:</span>
                <span className="font-semibold">€{venueTotal.toFixed(2)}</span>
              </div>
            )}
            {addons.length > 0 && (
              <div className="flex justify-between mb-2">
                <span>Services Total:</span>
                <span className="font-semibold">€{addonsTotal.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-3 bg-white/20" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total Amount:</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Send invoice to:</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSending}
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendInvoice}
            disabled={isSending || !email}
            className="w-full"
            size="lg"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Invoice
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
