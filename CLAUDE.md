# Canadian Invoice Generator

A professional invoice generator built with Bun + Hono for Canadian businesses.

## Quick Start

```bash
bun install       # Install dependencies
bun run dev       # Development with hot reload
bun run start     # Production
```

Server runs at http://localhost:3000

## Project Structure

```
src/
  index.ts              # Main Hono server entry point
  types/invoice.ts      # TypeScript types & Canadian tax rates
  services/
    invoice.ts          # Invoice creation & tax calculation logic
    pdf.ts              # PDF generation with Puppeteer
  templates/invoice.ts  # HTML invoice template
  routes/api.ts         # REST API endpoints
public/
  index.html            # Web UI
```

## Key Files

- `src/types/invoice.ts` - All Canadian province tax rates (GST/HST/PST/QST)
- `src/services/invoice.ts` - Tax calculation logic based on client province
- `src/templates/invoice.ts` - Professional HTML invoice template
- `src/services/pdf.ts` - Puppeteer-based PDF generation

## API Endpoints

- `GET /api/provinces` - Get all provinces with tax rates
- `POST /api/invoice` - Generate invoice JSON
- `POST /api/invoice/preview` - Get invoice HTML preview
- `POST /api/invoice/pdf` - Download invoice as PDF

## Deployment

- **Image**: `registry.ops.infotitans.ca/homelab/invoice-generator:latest`
- **Internal URL**: https://invoice.ops.infotitans.ca
- **Public URL**: https://invoice.infotitans.com (via Cloudflare Tunnel)
- **K8s Namespace**: invoice-generator

## Building & Pushing

```bash
docker build -t registry.ops.infotitans.ca/homelab/invoice-generator:latest .
docker push registry.ops.infotitans.ca/homelab/invoice-generator:latest
```

## Development Notes

- Uses Bun runtime (v1.3+)
- Hono web framework (not Express)
- Puppeteer with system Chromium for PDF generation
- Tax calculation based on client's province (not company's)
