import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import api from './routes/api';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// API routes
app.route('/api', api);

// Static files
app.use('/*', serveStatic({ root: './public' }));

// Default route
app.get('/', serveStatic({ path: './public/index.html' }));

const port = process.env.PORT || 3000;

console.log(`
🍁 Canadian Invoice Generator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Server running at: http://localhost:${port}

Features:
• Automatic GST/HST/PST/QST calculation
• PDF generation
• Beautiful, professional invoices
• All Canadian provinces supported
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

export default {
  port,
  fetch: app.fetch,
};
