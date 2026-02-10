import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('SMTP configuration is incomplete. Email sending will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

interface InvoiceData {
  eventName: string;
  eventType: string;
  date?: string;
  time?: string;
  location?: string;
  guestCount?: number;
  budget?: number;
  venue?: {
    name: string;
    price: number;
    quantity: number;
  };
  addons: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  venueTotal: number;
  addonsTotal: number;
  total: number;
}

const generateInvoiceHTML = (data: InvoiceData): string => {
  const eventTypeFormatted = data.eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - ${data.eventName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .section h2 { margin-top: 0; color: #667eea; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #6b7280; }
        .detail-value { color: #111827; }
        .addon-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
        .addon-item:last-child { border-bottom: none; }
        .addon-name { flex: 1; }
        .addon-qty { color: #6b7280; margin: 0 15px; }
        .addon-price { font-weight: 600; color: #111827; }
        .total-section { background: #667eea; color: white; padding: 20px; margin-top: 20px; border-radius: 8px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .total-row.grand { font-size: 24px; font-weight: bold; border-top: 2px solid rgba(255,255,255,0.3); margin-top: 10px; padding-top: 15px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 Invoice</h1>
        <p>Micro Event Planner</p>
      </div>
      
      <div class="content">
        <div class="section">
          <h2>Event Details</h2>
          <div class="detail-row">
            <span class="detail-label">Event Name:</span>
            <span class="detail-value">${data.eventName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Event Type:</span>
            <span class="detail-value">${eventTypeFormatted}</span>
          </div>
          ${data.date ? `
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">${data.date}${data.time ? ` at ${data.time}` : ''}</span>
          </div>
          ` : ''}
          ${data.location ? `
          <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">${data.location}</span>
          </div>
          ` : ''}
          ${data.guestCount ? `
          <div class="detail-row">
            <span class="detail-label">Guest Count:</span>
            <span class="detail-value">${data.guestCount}</span>
          </div>
          ` : ''}
          ${data.budget ? `
          <div class="detail-row">
            <span class="detail-label">Budget:</span>
            <span class="detail-value">€${data.budget.toFixed(2)}</span>
          </div>
          ` : ''}
        </div>

        ${data.venue ? `
        <div class="section">
          <h2>Venue</h2>
          <div class="addon-item">
            <span class="addon-name">${data.venue.name}</span>
            <span class="addon-qty">x${data.venue.quantity}</span>
            <span class="addon-price">€${(data.venue.price * data.venue.quantity).toFixed(2)}</span>
          </div>
        </div>
        ` : ''}

        ${data.addons.length > 0 ? `
        <div class="section">
          <h2>Services & Add-ons</h2>
          ${data.addons.map(addon => `
          <div class="addon-item">
            <span class="addon-name">${addon.name}</span>
            <span class="addon-qty">x${addon.quantity}</span>
            <span class="addon-price">€${(addon.price * addon.quantity).toFixed(2)}</span>
          </div>
          `).join('')}
        </div>
        ` : ''}

        <div class="total-section">
          ${data.venue ? `
          <div class="total-row">
            <span>Venue Total:</span>
            <span>€${data.venueTotal.toFixed(2)}</span>
          </div>
          ` : ''}
          ${data.addons.length > 0 ? `
          <div class="total-row">
            <span>Services Total:</span>
            <span>€${data.addonsTotal.toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="total-row grand">
            <span>Total Amount:</span>
            <span>€${data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for choosing Micro Event Planner!</p>
        <p>This is an automated invoice. Please keep it for your records.</p>
      </div>
    </body>
    </html>
  `;
};

export async function sendInvoiceEmail(recipientEmail: string, invoiceData: InvoiceData) {
  const transporter = createTransporter();

  if (!transporter) {
    return { 
      success: false, 
      error: 'Email service is not configured. Please set up SMTP credentials.' 
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Micro Event Planner'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `Invoice for ${invoiceData.eventName}`,
      html: generateInvoiceHTML(invoiceData),
    });

    console.log('Invoice email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send invoice email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

export async function sendEventReceipt(email: string, eventName: string, amount: number, eventId: string) {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn('SMTP configuration is incomplete. Skipping email.');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Micro Event Planner'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: `Receipt for ${eventName}`,
      html: `
        <h1>Event Confirmed!</h1>
        <p>Thank you for booking your event: <strong>${eventName}</strong></p>
        <p>Total Amount: <strong>€${amount}</strong></p>
        <p>You can view your event details and invitations here: <a href="${process.env.NEXT_PUBLIC_URL}/events/${eventId}/invitation">View Event</a></p>
      `,
    });
  } catch (e) {
    console.error('Failed to send receipt email:', e);
  }
}
