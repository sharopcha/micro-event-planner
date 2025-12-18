import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEventReceipt(email: string, eventName: string, amount: number, eventId: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Skipping email.');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Micro Event Planner <onboarding@resend.dev>',
      to: [email],
      subject: `Receipt for ${eventName}`,
      html: `
        <h1>Event Confirmed!</h1>
        <p>Thank you for booking your event: <strong>${eventName}</strong></p>
        <p>Total Amount: <strong>€${amount}</strong></p>
        <p>You can view your event details and invtations here: <a href="${process.env.NEXT_PUBLIC_URL}/events/${eventId}/invitation">View Event</a></p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
    }
  } catch (e) {
    console.error('Failed to send email:', e);
  }
}
