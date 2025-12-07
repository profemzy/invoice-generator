import { Hono } from 'hono';
import { createInvoice } from '../services/invoice';
import { generatePDF } from '../services/pdf';
import { generateInvoiceHTML } from '../templates/invoice';
import type { InvoiceInput } from '../types/invoice';
import { PROVINCE_TAX_RATES } from '../types/invoice';

const api = new Hono();

// Get available provinces and tax rates
api.get('/provinces', (c) => {
  return c.json(PROVINCE_TAX_RATES);
});

// Generate invoice preview (HTML)
api.post('/invoice/preview', async (c) => {
  try {
    const input: InvoiceInput = await c.req.json();
    const invoice = createInvoice(input);
    const html = generateInvoiceHTML(invoice);
    return c.html(html);
  } catch (error) {
    return c.json({ error: 'Invalid invoice data' }, 400);
  }
});

// Generate invoice JSON
api.post('/invoice', async (c) => {
  try {
    const input: InvoiceInput = await c.req.json();
    const invoice = createInvoice(input);
    return c.json(invoice);
  } catch (error) {
    return c.json({ error: 'Invalid invoice data' }, 400);
  }
});

// Generate invoice PDF
api.post('/invoice/pdf', async (c) => {
  try {
    const input: InvoiceInput = await c.req.json();
    const invoice = createInvoice(input);
    const pdfBuffer = await generatePDF(invoice);

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return c.json({ error: 'Failed to generate PDF' }, 500);
  }
});

export default api;
