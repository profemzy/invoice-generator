// Canadian Province Tax Types
export type Province =
  | 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT';

export interface TaxRate {
  gst: number;
  pst: number;
  hst: number;
  qst: number;
  name: string;
}

export const PROVINCE_TAX_RATES: Record<Province, TaxRate> = {
  AB: { gst: 5, pst: 0, hst: 0, qst: 0, name: 'Alberta' },
  BC: { gst: 5, pst: 7, hst: 0, qst: 0, name: 'British Columbia' },
  MB: { gst: 5, pst: 7, hst: 0, qst: 0, name: 'Manitoba' },
  NB: { gst: 0, pst: 0, hst: 15, qst: 0, name: 'New Brunswick' },
  NL: { gst: 0, pst: 0, hst: 15, qst: 0, name: 'Newfoundland and Labrador' },
  NS: { gst: 0, pst: 0, hst: 15, qst: 0, name: 'Nova Scotia' },
  NT: { gst: 5, pst: 0, hst: 0, qst: 0, name: 'Northwest Territories' },
  NU: { gst: 5, pst: 0, hst: 0, qst: 0, name: 'Nunavut' },
  ON: { gst: 0, pst: 0, hst: 13, qst: 0, name: 'Ontario' },
  PE: { gst: 0, pst: 0, hst: 15, qst: 0, name: 'Prince Edward Island' },
  QC: { gst: 5, pst: 0, hst: 0, qst: 9.975, name: 'Quebec' },
  SK: { gst: 5, pst: 6, hst: 0, qst: 0, name: 'Saskatchewan' },
  YT: { gst: 5, pst: 0, hst: 0, qst: 0, name: 'Yukon' },
};

export interface Address {
  street: string;
  city: string;
  province: Province;
  postalCode: string;
  country: string;
}

export interface Company {
  name: string;
  address: Address;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  gstNumber?: string;
  qstNumber?: string;
}

export interface Client {
  name: string;
  address: Address;
  email?: string;
  phone?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  company: Company;
  client: Client;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  subtotal: number;
  taxDetails: TaxDetails;
  total: number;
  currency: 'CAD';
}

export interface TaxDetails {
  gst: number;
  pst: number;
  hst: number;
  qst: number;
  totalTax: number;
}

export interface InvoiceInput {
  company: Company;
  client: Client;
  items: Omit<InvoiceItem, 'amount'>[];
  invoiceNumber?: string;
  issueDate?: string;
  dueDate?: string;
  notes?: string;
  terms?: string;
}
