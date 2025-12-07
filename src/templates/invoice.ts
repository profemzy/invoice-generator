import type { Invoice } from '../types/invoice';
import { formatCurrency } from '../services/invoice';

export function generateInvoiceHTML(invoice: Invoice): string {
  const itemsHTML = invoice.items
    .map(
      (item) => `
      <tr>
        <td class="item-desc">${escapeHtml(item.description)}</td>
        <td class="item-qty">${item.quantity}</td>
        <td class="item-price">${formatCurrency(item.unitPrice)}</td>
        <td class="item-amount">${formatCurrency(item.amount)}</td>
      </tr>
    `
    )
    .join('');

  const taxBreakdownHTML = generateTaxBreakdown(invoice);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${escapeHtml(invoice.invoiceNumber)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
    }

    .company-info {
      flex: 1;
    }

    .company-name {
      font-size: 28px;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 8px;
    }

    .company-details {
      font-size: 13px;
      color: #64748b;
      line-height: 1.8;
    }

    .invoice-title {
      text-align: right;
    }

    .invoice-title h1 {
      font-size: 36px;
      font-weight: 300;
      color: #2563eb;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .invoice-number {
      font-size: 14px;
      color: #64748b;
      margin-top: 8px;
    }

    .invoice-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }

    .bill-to, .invoice-details {
      flex: 1;
    }

    .bill-to {
      padding-right: 40px;
    }

    .invoice-details {
      text-align: right;
    }

    .section-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin-bottom: 8px;
    }

    .client-name {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .client-details {
      font-size: 13px;
      color: #64748b;
      line-height: 1.8;
    }

    .detail-row {
      display: flex;
      justify-content: flex-end;
      gap: 20px;
      margin-bottom: 4px;
    }

    .detail-label {
      font-size: 13px;
      color: #94a3b8;
    }

    .detail-value {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
      min-width: 120px;
      text-align: right;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }

    .items-table thead {
      background: #f8fafc;
    }

    .items-table th {
      padding: 14px 16px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      border-bottom: 2px solid #e2e8f0;
    }

    .items-table th:last-child,
    .items-table td:last-child {
      text-align: right;
    }

    .items-table th:nth-child(2),
    .items-table th:nth-child(3),
    .items-table td:nth-child(2),
    .items-table td:nth-child(3) {
      text-align: center;
    }

    .items-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
    }

    .item-desc {
      color: #1e293b;
      font-weight: 500;
    }

    .item-qty, .item-price {
      color: #64748b;
    }

    .item-amount {
      font-weight: 600;
      color: #1e293b;
    }

    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }

    .totals-table {
      width: 300px;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }

    .totals-row.subtotal {
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 12px;
      margin-bottom: 8px;
    }

    .totals-row .label {
      color: #64748b;
    }

    .totals-row .value {
      font-weight: 500;
      color: #1e293b;
    }

    .totals-row.total {
      border-top: 2px solid #2563eb;
      margin-top: 12px;
      padding-top: 12px;
    }

    .totals-row.total .label {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }

    .totals-row.total .value {
      font-size: 20px;
      font-weight: 700;
      color: #2563eb;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .notes, .terms {
      margin-bottom: 20px;
    }

    .notes-title, .terms-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      margin-bottom: 6px;
    }

    .notes-content, .terms-content {
      font-size: 13px;
      color: #64748b;
      line-height: 1.6;
    }

    .tax-numbers {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #94a3b8;
    }

    .currency-note {
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      margin-top: 30px;
    }

    @media print {
      body {
        padding: 20px;
      }

      .invoice-header {
        border-bottom-color: #2563eb !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-header">
    <div class="company-info">
      <div class="company-name">${escapeHtml(invoice.company.name)}</div>
      <div class="company-details">
        ${escapeHtml(invoice.company.address.street)}<br>
        ${escapeHtml(invoice.company.address.city)}, ${escapeHtml(invoice.company.address.province)} ${escapeHtml(invoice.company.address.postalCode)}<br>
        ${escapeHtml(invoice.company.address.country)}
        ${invoice.company.phone ? `<br>Tel: ${escapeHtml(invoice.company.phone)}` : ''}
        ${invoice.company.email ? `<br>Email: ${escapeHtml(invoice.company.email)}` : ''}
        ${invoice.company.website ? `<br>Web: ${escapeHtml(invoice.company.website)}` : ''}
      </div>
    </div>
    <div class="invoice-title">
      <h1>Invoice</h1>
      <div class="invoice-number">${escapeHtml(invoice.invoiceNumber)}</div>
    </div>
  </div>

  <div class="invoice-meta">
    <div class="bill-to">
      <div class="section-title">Bill To</div>
      <div class="client-name">${escapeHtml(invoice.client.name)}</div>
      <div class="client-details">
        ${escapeHtml(invoice.client.address.street)}<br>
        ${escapeHtml(invoice.client.address.city)}, ${escapeHtml(invoice.client.address.province)} ${escapeHtml(invoice.client.address.postalCode)}<br>
        ${escapeHtml(invoice.client.address.country)}
        ${invoice.client.email ? `<br>${escapeHtml(invoice.client.email)}` : ''}
        ${invoice.client.phone ? `<br>${escapeHtml(invoice.client.phone)}` : ''}
      </div>
    </div>
    <div class="invoice-details">
      <div class="detail-row">
        <span class="detail-label">Issue Date:</span>
        <span class="detail-value">${escapeHtml(invoice.issueDate)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Due Date:</span>
        <span class="detail-value">${escapeHtml(invoice.dueDate)}</span>
      </div>
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        <th>Unit Price</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>

  <div class="totals-section">
    <div class="totals-table">
      <div class="totals-row subtotal">
        <span class="label">Subtotal</span>
        <span class="value">${formatCurrency(invoice.subtotal)}</span>
      </div>
      ${taxBreakdownHTML}
      <div class="totals-row total">
        <span class="label">Total (CAD)</span>
        <span class="value">${formatCurrency(invoice.total)}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    ${invoice.notes ? `
    <div class="notes">
      <div class="notes-title">Notes</div>
      <div class="notes-content">${escapeHtml(invoice.notes)}</div>
    </div>
    ` : ''}

    ${invoice.terms ? `
    <div class="terms">
      <div class="terms-title">Terms & Conditions</div>
      <div class="terms-content">${escapeHtml(invoice.terms)}</div>
    </div>
    ` : ''}

    <div class="tax-numbers">
      ${invoice.company.gstNumber ? `GST/HST Registration: ${escapeHtml(invoice.company.gstNumber)}` : ''}
      ${invoice.company.qstNumber ? `<br>QST Registration: ${escapeHtml(invoice.company.qstNumber)}` : ''}
    </div>
  </div>

  <div class="currency-note">
    All amounts are in Canadian Dollars (CAD)
  </div>
</body>
</html>
  `;
}

function generateTaxBreakdown(invoice: Invoice): string {
  const { taxDetails } = invoice;
  let html = '';

  if (taxDetails.hst > 0) {
    html += `
      <div class="totals-row">
        <span class="label">HST (13%)</span>
        <span class="value">${formatCurrency(taxDetails.hst)}</span>
      </div>
    `;
  }

  if (taxDetails.gst > 0) {
    html += `
      <div class="totals-row">
        <span class="label">GST (5%)</span>
        <span class="value">${formatCurrency(taxDetails.gst)}</span>
      </div>
    `;
  }

  if (taxDetails.pst > 0) {
    html += `
      <div class="totals-row">
        <span class="label">PST</span>
        <span class="value">${formatCurrency(taxDetails.pst)}</span>
      </div>
    `;
  }

  if (taxDetails.qst > 0) {
    html += `
      <div class="totals-row">
        <span class="label">QST (9.975%)</span>
        <span class="value">${formatCurrency(taxDetails.qst)}</span>
      </div>
    `;
  }

  return html;
}

function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}
