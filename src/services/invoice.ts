import {
  type Invoice,
  type InvoiceInput,
  type InvoiceItem,
  type TaxDetails,
  type Province,
  PROVINCE_TAX_RATES,
} from '../types/invoice';

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

export function calculateItemAmount(item: Omit<InvoiceItem, 'amount'>): number {
  return item.quantity * item.unitPrice;
}

export function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function calculateTaxes(subtotal: number, province: Province): TaxDetails {
  const rates = PROVINCE_TAX_RATES[province];

  let gst = 0;
  let pst = 0;
  let hst = 0;
  let qst = 0;

  if (rates.hst > 0) {
    // HST provinces (ON, NB, NL, NS, PE)
    hst = subtotal * (rates.hst / 100);
  } else {
    // GST + PST/QST provinces
    gst = subtotal * (rates.gst / 100);

    if (rates.qst > 0) {
      // Quebec: QST is calculated on subtotal only (changed in 2013)
      qst = subtotal * (rates.qst / 100);
    } else if (rates.pst > 0) {
      // BC, MB, SK: PST on subtotal only
      pst = subtotal * (rates.pst / 100);
    }
  }

  const totalTax = gst + pst + hst + qst;

  return {
    gst: Math.round(gst * 100) / 100,
    pst: Math.round(pst * 100) / 100,
    hst: Math.round(hst * 100) / 100,
    qst: Math.round(qst * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
  };
}

export function createInvoice(input: InvoiceInput): Invoice {
  const items: InvoiceItem[] = input.items.map(item => ({
    ...item,
    amount: calculateItemAmount(item),
  }));

  const subtotal = calculateSubtotal(items);
  const taxDetails = calculateTaxes(subtotal, input.client.address.province);
  const total = subtotal + taxDetails.totalTax;

  const issueDate = input.issueDate || formatDate(new Date());
  const dueDate = input.dueDate || formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  return {
    invoiceNumber: input.invoiceNumber || generateInvoiceNumber(),
    issueDate,
    dueDate,
    company: input.company,
    client: input.client,
    items,
    notes: input.notes,
    terms: input.terms || 'Payment due within 30 days of invoice date.',
    subtotal: Math.round(subtotal * 100) / 100,
    taxDetails,
    total: Math.round(total * 100) / 100,
    currency: 'CAD',
  };
}
