# Technology Stack

**Analysis Date:** 2026-01-28

## Languages

**Primary:**
- JavaScript (ES6+) - Application logic and components
- JSX - React component syntax throughout `src/`
- SCSS - Styling with preprocessor, compiled to CSS

**Markup:**
- HTML5 - Single-page application entry point at `index.html`

## Runtime

**Environment:**
- Node.js v23.8.0+ (development)
- Browser (modern Chrome, Firefox, Safari, Edge)

**Package Manager:**
- npm 10.9.2+
- Lockfile: `package-lock.json` (present, v3)

## Frameworks

**Core:**
- React 19.2.3 - UI component framework
- React DOM 19.2.3 - React rendering for web

**Build/Dev:**
- Vite 7.3.0 - Frontend build tool and dev server
  - Config: `vite.config.js`
  - Fast HMR (Hot Module Replacement)
  - Optimized production builds with tree-shaking
- @vitejs/plugin-react 5.1.2 - React Fast Refresh integration for Vite

**Styling:**
- Sass 1.97.1 - SCSS preprocessing
  - Source: `src/styles/styles.scss`
  - Compiled to: `src/styles/styles.css` and `src/styles/styles.css.map`

**Icon Library:**
- react-icons 5.5.0 - Icon components
  - Used: `FaEnvelope`, `FaGithub`, `FaLinkedin` from Font Awesome
  - Used: `SiSignal` from Simple Icons
  - Consumed in `src/sections/ContactSection.jsx`, `src/components/`

**Fonts:**
- @fontsource/inter 5.2.8 - Self-hosted Inter font (Google Font)
  - Weights: 300, 400, 500, 600, 700
  - Preloaded in build via `vite.config.js` for performance
  - Imported in `src/main.jsx`

**HTML Plugin:**
- vite-plugin-html 3.2.2 - Vite plugin for HTML processing
  - Minification enabled
  - Asset injection (font preloading)
  - Custom CSS inlining plugin in `vite.config.js`

## Key Dependencies

**Critical:**
- React 19.2.3 - Component-based UI rendering
- Vite 7.3.0 - Build orchestration and development server

**Styling:**
- Sass 1.97.1 - CSS preprocessing with variables and nesting

**UI Enhancement:**
- react-icons 5.5.0 - Scalable icon system using icon libraries
- @fontsource/inter 5.2.8 - Typography with self-hosted fonts

## Configuration

**Environment:**
- Development: `npm run dev` - Local Vite dev server with HMR
- Production: `npm run build` - Optimized bundle to `dist/`
- Preview: `npm run preview` - Static preview of built output

**Build Targets:**
- Output directory: `dist/`
- Sourcemaps: Enabled for production
- Minifier: esbuild (default Vite)
- CSS: Inlined into HTML for single-file output
- Chunks: React/ReactDOM split into `react-vendor` chunk

**Vite Config:**
- Located: `vite.config.js`
- Plugins: React Fast Refresh, HTML processing, custom CSS inlining
- Font preloading: Four Inter weights (300, 400, 600, 700) preloaded in `<head>`
- Asset fingerprinting: Hashed filenames except fonts (predictable names for preload)

## Platform Requirements

**Development:**
- Node.js 23.8.0 or compatible LTS version
- npm 10.9.2 or compatible
- Modern code editor with JSX support
- No database or backend server required

**Production:**
- Deployment target: Static file hosting (Vercel, Netlify, GitHub Pages, or any CDN)
- Built files: Single-page application with HTML, JavaScript bundles, and static assets
- Web3Forms API endpoint: `https://api.web3forms.com/submit` (for contact form)
- No backend requirements

## Entry Points

**HTML Entry:**
- `index.html` - Mounts React app to `<div id="root">`
- Script: `<script type="module" src="/src/main.jsx"></script>`

**JavaScript Entry:**
- `src/main.jsx` - ReactDOM render root, imports global styles

**Application Root:**
- `src/App.jsx` - Root component wrapping all sections with ThemeProvider

## Module System

**Type:** ES Modules (ESM)
- `package.json` declares `"type": "module"`
- All imports use `import` statement syntax
- Dynamic imports supported for code splitting

---

*Stack analysis: 2026-01-28*
