# External Integrations

**Analysis Date:** 2026-01-28

## APIs & External Services

**Form Submission:**
- Web3Forms - Email form processing
  - SDK/Client: Fetch API (browser-native, no package)
  - Auth: Access key `cf0434f9-44f0-46ba-ac53-978c15bbb240` (hardcoded in client)
  - Endpoint: `https://api.web3forms.com/submit`
  - Usage: Contact form in `src/sections/ContactSection.jsx` (lines 30-43)
  - Method: POST with JSON body
  - Headers: `Content-Type: application/json`, `Accept: application/json`
  - Payload: `{ access_key, name, email, message, subject }`

## Data Storage

**Databases:**
- Not applicable - Static site with no backend

**File Storage:**
- Static assets in `public/` directory (favicon, og-image, robots.txt, sitemap.xml)
- Font files preloaded from `public/assets/` path
- No cloud storage integration

**Caching:**
- Browser caching via HTTP headers (configured on hosting)
- Service Worker: Not implemented
- Build-time optimization: CSS inlined, assets fingerprinted

## Authentication & Identity

**Auth Provider:**
- None - Public portfolio website
- No user authentication or authorization
- Contact form submission is open (no CAPTCHA or rate limiting visible)

## Monitoring & Observability

**Error Tracking:**
- None configured - Basic console.error in catch blocks
- Contact form errors logged to browser console only (`src/sections/ContactSection.jsx`, line 54)

**Logs:**
- Browser console only via `console.error()`
- No remote logging service

**Analytics:**
- None detected - No Google Analytics, Mixpanel, or similar

## CI/CD & Deployment

**Hosting:**
- Not specified in codebase (configured externally)
- Likely: Vercel, Netlify, GitHub Pages, or similar static host
- Deployment script: `deploy.sh` (simple bash script, location: `/mnt/c/Projects/sanderburuma.nl/deploy.sh`)

**CI Pipeline:**
- GitHub Actions workflows present in `.github/` directory
- No CI config files visible in root (check `.github/workflows/` for details)

## Environment Configuration

**Required env vars:**
- None detected - All configuration is hardcoded or browser-based

**Web3Forms Access Key:**
- Key: `cf0434f9-44f0-46ba-ac53-978c15bbb240`
- Location: Hardcoded in `src/sections/ContactSection.jsx` (line 37)
- **Security concern**: Public API key exposed in client-side code (see CONCERNS.md)

**Secrets location:**
- No `.env` file present
- All configuration hardcoded in source files

## External Resources

**Third-Party Links:**
- GitHub: `https://github.com/sanderburuma`
- LinkedIn: `https://www.linkedin.com/in/sander-buruma-729a84235`
- Signal: `https://signal.me/#eu/V29V5cqjQfOqIDIFY6k909ZQtZ86-ygr1q1OH_lJBN1q031LAGVIz5nDn0-7k4y7`
- Email: `info@sanderburuma.nl`

**Icon Library CDN:**
- react-icons loads icon fonts from: Bundled in JS chunk (not external CDN)

**Font CDN:**
- Inter font: Self-hosted in `public/assets/` (no external CDN)
- Font source: @fontsource/inter npm package (not from Google Fonts CDN)

## Webhooks & Callbacks

**Incoming:**
- Contact form submission endpoint to Web3Forms (outgoing only)

**Outgoing:**
- Web3Forms sends form data to user's email (configured in Web3Forms dashboard, not in code)

## CORS & Cross-Origin Requests

**Fetch Calls:**
- Web3Forms: `https://api.web3forms.com/submit` - CORS must be enabled server-side
- No authentication headers (public key authentication)

## Third-Party Libraries CDN

**Not used:**
- All dependencies installed via npm, bundled into JavaScript chunks
- No external CDN links in HTML (fonts are self-hosted)

---

*Integration audit: 2026-01-28*
