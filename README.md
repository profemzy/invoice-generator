# Canadian Invoice Generator

A professional invoice generator built with Bun + Hono for Canadian businesses. Automatically calculates GST/HST/PST/QST taxes for all Canadian provinces.

## Features

- Automatic tax calculation for all Canadian provinces (GST/HST/PST/QST)
- Professional, beautiful invoice templates
- PDF generation via Puppeteer
- Modern web UI for invoice creation
- REST API for programmatic invoice generation
- Docker support for containerized deployment

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.3+

### Installation

```bash
bun install
```

### Development

```bash
bun run dev     # Development with hot reload
```

### Production

```bash
bun run start   # Production server
```

The app will be available at http://localhost:3000

## Project Structure

```
invoice-generator/
├── src/
│   ├── index.ts              # Main Hono server
│   ├── types/
│   │   └── invoice.ts        # TypeScript types & tax rates
│   ├── services/
│   │   ├── invoice.ts        # Invoice creation & tax calculation
│   │   └── pdf.ts            # PDF generation with Puppeteer
│   ├── templates/
│   │   └── invoice.ts        # HTML invoice template
│   └── routes/
│       └── api.ts            # REST API endpoints
├── public/
│   └── index.html            # Web UI
├── Dockerfile                # Container build
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/provinces` | Get all provinces with tax rates |
| POST | `/api/invoice` | Generate invoice JSON |
| POST | `/api/invoice/preview` | Get invoice HTML preview |
| POST | `/api/invoice/pdf` | Download invoice as PDF |

### Example: Generate Invoice

```bash
curl -X POST http://localhost:3000/api/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "company": {
      "name": "Your Company",
      "address": {
        "street": "123 Main St",
        "city": "Toronto",
        "province": "ON",
        "postalCode": "M5V1A1",
        "country": "Canada"
      },
      "gstNumber": "123456789RT0001"
    },
    "client": {
      "name": "Client Inc",
      "address": {
        "street": "456 Oak Ave",
        "city": "Vancouver",
        "province": "BC",
        "postalCode": "V6B2M2",
        "country": "Canada"
      }
    },
    "items": [
      {"description": "Web Development", "quantity": 10, "unitPrice": 100}
    ]
  }'
```

## Canadian Tax Rates

| Province | Tax Type | Rate |
|----------|----------|------|
| Alberta | GST | 5% |
| British Columbia | GST + PST | 5% + 7% |
| Manitoba | GST + PST | 5% + 7% |
| New Brunswick | HST | 15% |
| Newfoundland | HST | 15% |
| Nova Scotia | HST | 15% |
| Ontario | HST | 13% |
| PEI | HST | 15% |
| Quebec | GST + QST | 5% + 9.975% |
| Saskatchewan | GST + PST | 5% + 6% |
| NWT/Nunavut/Yukon | GST | 5% |

## Docker

### Build

```bash
docker build -t invoice-generator:latest .
```

### Run

```bash
docker run -p 3000:3000 invoice-generator:latest
```

## Deployment

This app is deployed to Kubernetes via FluxCD.

## Tech Stack

- **Runtime**: Bun 1.3
- **Framework**: Hono
- **PDF Generation**: Puppeteer
- **Container**: Docker (Alpine-based)
- **Orchestration**: Kubernetes + FluxCD
- **Registry**: Harbor

## License

MIT
