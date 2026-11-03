# Shivapuri Group Website

Responsive React and TypeScript website for Shivapuri Group, based on the supplied company logo and architectural visualization images.

## Stack

- React, TypeScript and Vite
- React Router for direct routes and browser navigation
- Lucide React icons
- Hand-authored responsive CSS, including reduced-motion support

## Local development

On Windows, double-click `START WEBSITE.bat`. It installs dependencies if needed, starts Vite, and opens the local website in your browser. Keep the command window open while using the site; press Ctrl+C there to stop it.

Do not open `index.html` directly from File Explorer. This React/TypeScript app must be served by Vite so the browser can load its compiled modules and assets.

```bash
npm install
npm run dev
```

Vite prints the local address, normally `http://localhost:5173/`.

The development server uses Vite's SPA fallback for direct route access. Production hosting must also rewrite unknown paths to `/index.html`; the included `vercel.json` configures this for Vercel.

## Commands

```bash
npm run build    # TypeScript check, production bundle, robots.txt and optional sitemap
npm run preview  # Preview the built site
npm run lint     # TypeScript checks
npm run test     # Unit tests for the estimator calculation engine
```

## Assets

- The unmodified supplied logo is at `public/images/brand/shivapuri-logo.jpeg`.
- The 48 supplied WhatsApp JPEGs are preserved in `public/images/projects/` as `residential-visual-01.jpeg` through `residential-visual-48.jpeg`.
- The image folder contains architectural visualizations, including residences, multi-residential/commercial buildings and public-space/landscape views. It did not include confirmed project names, addresses, status, drawings, furniture/interior photographs, product photographs or material specifications. The site labels these visuals as renderings and does not claim they are completed works.
- Where the supplied folder had no matching interior, construction-process or material photos, category-matched reference images are served from Unsplash. These are identified in the UI as reference imagery, not Shivapuri projects or products. Image URLs and source pages are maintained in `src/data/visuals.ts`; see the [Unsplash License](https://unsplash.com/license).

## Cost estimator

Calculation logic is in `src/features/cost-estimator/calculationEngine.ts`; the estimator is embedded on the homepage and engineering consultancy pages. The formula text file in the folder is empty, so the implementation uses the formulas and illustrative examples supplied in the conversation:

- Rough plinth-area range: entered area per floor × floor count × NPR 3,500–4,600 per sq ft. This rate is shown as illustrative and is not applied differently by location, finish or structural type.
- Editable BOQ rows calculate quantity × entered unit rate and sum the measured direct subtotal.
- Optional dimensions calculate excavation, footing, column, beam and slab concrete volumes; backfill and soil disposal from entered measured inputs.
- Optional material quantities calculate nominal 1:1.5:3 concrete quantities (dry-volume factor 1.54 and 0.0347 m³/bag), theoretical reinforcement weight (diameter²/162), approximate bricks (500/m³), and paint litres (area × coats ÷ coverage).
- Square feet, square metres and the supplied conversion factors are implemented where used. Reports can be printed or downloaded as CSV.

The nominal concrete mix and material factors are explicitly marked approximate; the calculator does not infer a full take-off from floor area or replace structural design, product specifications, a measured BOQ, or current Kathmandu rates. A project-specific estimate needs verified dimensions, schedules and current supplier/labor quotations.

## Inquiries and backend

The contact form validates fields and prepares an inquiry in WhatsApp for the visitor to review and send. It does not claim to submit to a server. No backend, database credentials, email service, rate limiting, admin panel, property inventory or authenticated content-management system were supplied or configured. To persist inquiries or manage listings, connect a server-side endpoint (for example, a Supabase Edge Function with server-side validation and rate limiting) and update the form adapter. Do not put service-role secrets in browser code.

Property listings and catalog prices/specifications are not fabricated. Catalog and service pages route visitors to direct inquiries until verified data is supplied.

## SEO and deployment configuration

Page titles, descriptions, canonical URLs and LocalBusiness JSON-LD are set by the app. The organization address and phones reflect the supplied prompt, with Dharmasthali, Kathmandu, Bagmati Province, Nepal identified in structured data. The sitemap lists page URLs; local business location belongs in structured data because sitemap entries do not contain address fields. No company domain or social URLs were supplied.

Before deployment:

1. Copy `.env.example` to `.env` and set `VITE_SITE_URL` to the confirmed public HTTPS domain. A real domain is required to generate valid absolute sitemap URLs; do not submit a localhost or placeholder sitemap to search engines.
2. Run `npm run build`; this generates `dist/robots.txt` and `dist/sitemap.xml` when the domain is configured.
3. Deploy `dist/` with SPA rewrites enabled (Vercel config is included; configure the equivalent on Netlify/Cloudflare Pages).
4. Verify the deployed routes, map embed, phone links and WhatsApp handoff. Add real backend integrations and verified company listings when available.

No analytics, external tracking or social links are enabled. The site imports Google Fonts; system font fallbacks remain available.
