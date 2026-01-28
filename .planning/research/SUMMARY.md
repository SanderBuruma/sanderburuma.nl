# Project Research Summary

**Project:** sanderburuma.nl
**Domain:** Personal developer portfolio with markdown blog
**Researched:** 2026-01-28
**Confidence:** HIGH

## Executive Summary

Adding a markdown-based blog to an existing React 19 + Vite 7 portfolio is a well-documented pattern with clear best practices. The recommended approach uses **React Router v7 for client-side routing**, **runtime markdown processing** with `react-markdown` and `gray-matter`, and **build-time RSS generation**. This architecture preserves the existing single-page portfolio behavior while adding proper blog routes for SEO and sharability.

The technical implementation requires only 5 additional libraries (react-router, react-markdown, remark-gfm, gray-matter, feed) and minimal changes to existing code. The key architectural decision is using a **hybrid routing approach** where the portfolio remains a traditional SPA with anchor navigation while blog routes use React Router. This avoids rewriting existing functionality while enabling proper URLs for blog content.

Critical risks include static hosting 404 errors with BrowserRouter (mitigated with redirect configuration), massive bundle size from syntax highlighting libraries (mitigated with selective imports), and RSS feed date format errors (mitigated with proper RFC-822 formatting). All pitfalls have documented prevention strategies and should be addressed during specific implementation phases.

## Key Findings

### Recommended Stack

The stack prioritizes **build-time processing over runtime overhead**, **native Vite features over plugins**, and **proven stability over bleeding-edge alternatives**. All libraries integrate cleanly with the existing React 19 + Vite 7 setup without requiring architectural changes.

**Core technologies:**
- **react-router v7.13.0**: SPA routing with declarative mode (not framework mode) — provides `/blog` and `/blog/:slug` routes without SSR complexity
- **react-markdown v10.1.0 + remark-gfm v4.0.1**: Runtime markdown rendering with GitHub Flavored Markdown — industry standard, safe by default, extensible
- **gray-matter v4.0.3**: Frontmatter parser for metadata — battle-tested (Gatsby, Astro, VitePress use it)
- **react-syntax-highlighter v15.6.1**: Code highlighting component — tree-shakeable, only loads needed languages
- **feed v5.1.0**: RSS/Atom/JSON feed generator — modern TypeScript library for build-time feed generation

**Key architectural choice:** Use Vite's native `import.meta.glob` for markdown file discovery instead of additional plugins. This keeps the build pipeline simple and avoids plugin dependencies.

**Critical version note:** Use `react-router` package (not `react-router-dom`) — v7 consolidated packages and the DOM package is now just a compatibility re-export.

### Expected Features

Research identifies clear tiers of features based on developer blog expectations.

**Must have (table stakes):**
- Blog post list page with title, date, excerpt
- Individual post pages with proper routes
- Markdown rendering with code syntax highlighting
- Frontmatter metadata (title, date, tags, description)
- RSS feed (essential for blog discoverability)
- Open Graph tags for social sharing
- Responsive design extending existing portfolio theme

**Should have (competitive differentiators):**
- Tag filtering on blog index
- Featured images per post
- Dark mode integration with existing theme
- Reading time estimates
- Code copy buttons
- Table of contents for long posts
- Related posts suggestions

**Defer to post-MVP (v2+):**
- Client-side search functionality (low priority until content volume grows)
- Series/collections for multi-part content
- Author bio sections (single author, less critical)
- Share buttons (manual sharing via URL works fine initially)

**Anti-features (explicitly avoid):**
- Comments system (high maintenance, spam burden)
- Newsletter signup (GDPR complexity, email management)
- User accounts/login (unnecessary for static read-only blog)
- Full-text search backend (client-side JSON search sufficient)
- Content scheduling (manual control adequate)
- Markdown editor in UI (edit in code editor, commit to git)

### Architecture Approach

The architecture uses a **hybrid routing model** combining traditional single-page anchor navigation with React Router for blog content. This preserves existing portfolio behavior while enabling SEO-friendly URLs for blog posts.

**Major components:**
1. **App.jsx** (modified) — Wraps RouterProvider in ThemeProvider, maintains theme context across routes
2. **RootLayout.jsx** (new) — Shared layout with Navbar, Footer, and Outlet for child routes
3. **PortfolioPage.jsx** (new) — Extracts existing single-page portfolio content, preserves anchor navigation
4. **BlogIndexPage.jsx** (new) — Lists all blog posts with metadata from pre-generated manifest
5. **BlogPostPage.jsx** (new) — Dynamically loads and renders individual markdown posts with react-markdown
6. **Navbar.jsx** (modified) — Adds blog link using React Router `<Link>`, keeps anchor links for portfolio sections

**Data flow pattern:**
- **Build time:** `generateBlogManifest.js` script scans markdown files, extracts frontmatter, generates JSON manifest
- **Runtime:** Blog index imports manifest for fast listing; individual posts load markdown via dynamic imports
- **Post build:** `generateRSS.js` script creates RSS/Atom/JSON feeds from manifest

**Key integration points:**
- ThemeProvider wraps RouterProvider (not vice versa) to maintain theme state across navigation
- Navbar uses `useLocation()` to detect active section/page, mixing `<Link>` for blog and `<a>` for anchors
- Blog styles extend existing SCSS architecture with new `blog.scss` module
- Build pipeline adds pre-build step for manifest generation and post-build step for RSS

### Critical Pitfalls

Research identified 12 total pitfalls across 3 severity tiers. The top 5 critical/moderate issues:

1. **Static hosting 404 errors with BrowserRouter** — Direct links to blog posts return 404 on deployment because static hosts don't understand client-side routes. Prevention: Add `_redirects` file for Netlify/Vercel (`/* /index.html 200`) or copy `index.html` to `404.html` for GitHub Pages. Test before launch with actual deployment.

2. **import.meta.glob production build failures** — Markdown files load in dev but production build fails with "Invalid glob import syntax" errors. Prevention: Use **literal glob patterns only** (`import.meta.glob('../posts/*.md', { as: 'raw' })`), never variables or string concatenation. Test with `npm run build && npm run preview` before deploying.

3. **Massive bundle size from syntax highlighting** — Default imports pull in 300-400KB of language definitions, penalizing entire site. Prevention: Import only needed languages (`react-syntax-highlighter/dist/esm/prism-light` + register specific languages) and lazy load blog components with `React.lazy()`.

4. **RSS feed date format errors** — Feed readers reject feeds using ISO 8601 dates instead of RFC-822. Prevention: Use `new Date().toUTCString()` (not `.toISOString()`), or better yet use the `feed` package which handles formatting automatically. Validate with https://validator.w3.org/feed/ before launch.

5. **SEO meta tags not updating per post** — Social media previews show generic site info instead of post-specific titles/images. Prevention: Install `react-helmet-async` (not old react-helmet) and update meta tags per post. Note: Social scrapers may not execute JavaScript; perfect previews may require prerendering.

**Phase-specific warnings:**
- Phase 1 (Router Setup): Configure redirect rules immediately, test deployment early
- Phase 2 (Markdown Loading): Validate frontmatter schema, enforce literal glob patterns
- Phase 3 (Rendering): Select syntax highlighting imports carefully, memoize components
- Phase 4 (RSS Generation): Use RFC-822 dates, validate output, ensure standard `/rss.xml` location

## Implications for Roadmap

Based on research, I recommend **6 phases** structured around dependency chains and risk mitigation. Each phase delivers working functionality while building toward complete blog feature.

### Phase 1: Routing Foundation
**Rationale:** Establish routing infrastructure first without breaking existing portfolio. Introduces React Router in isolated way, validates deployment configuration early, catches routing issues before adding blog complexity.

**Delivers:** Working router with portfolio page preserved, blog placeholder routes accessible, deployment configuration tested

**Addresses:** Foundation for all blog routes (from ARCHITECTURE.md), avoids breaking existing anchor navigation

**Avoids:** Static hosting 404 errors (Pitfall #1) — address redirect configuration immediately

**Research flag:** Standard patterns, skip research-phase

### Phase 2: Markdown Infrastructure
**Rationale:** Set up markdown processing pipeline before building UI. Validates file loading patterns work in production build, establishes content structure, enables parallel UI development.

**Delivers:** Markdown files loadable, frontmatter parsed, blog manifest generated at build time

**Uses:** gray-matter for frontmatter, Vite's import.meta.glob for file discovery (from STACK.md)

**Implements:** Static blog manifest pattern (from ARCHITECTURE.md)

**Avoids:** import.meta.glob production failures (Pitfall #2), frontmatter parsing inconsistencies (Pitfall #5)

**Research flag:** Standard patterns, skip research-phase

### Phase 3: Blog Index Page
**Rationale:** Display blog posts before implementing individual rendering. Validates manifest usage, establishes card layout patterns, delivers visible progress quickly.

**Delivers:** Blog list page showing all posts with metadata, tag filtering, responsive design

**Addresses:** Blog post list (table stakes from FEATURES.md), tag filtering (should-have from FEATURES.md)

**Uses:** BlogPostCard component pattern (from ARCHITECTURE.md)

**Avoids:** Missing blog post sorting (Pitfall #9)

**Research flag:** Standard patterns, skip research-phase

### Phase 4: Markdown Rendering
**Rationale:** Core blog functionality, highest technical complexity. Requires careful performance optimization and syntax highlighting configuration.

**Delivers:** Individual blog posts with rendered markdown, code syntax highlighting, image support, loading states

**Addresses:** Individual post pages, code highlighting (table stakes from FEATURES.md)

**Implements:** Dynamic markdown loading with React (from ARCHITECTURE.md)

**Avoids:** Bundle size explosion (Pitfall #3), performance issues (Pitfall #7), broken relative links (Pitfall #8), missing loading states (Pitfall #10)

**Research flag:** Standard patterns, but requires careful bundle analysis — light research recommended for optimization validation

### Phase 5: SEO & Metadata
**Rationale:** Make blog discoverable after core functionality works. Validates social sharing, enables proper indexing, addresses competitive requirements.

**Delivers:** Per-post meta tags, Open Graph tags, react-helmet-async integration, social media preview testing

**Addresses:** Metadata/SEO, Open Graph tags (table stakes from FEATURES.md)

**Avoids:** SEO meta tags not updating (Pitfall #6)

**Research flag:** Standard patterns, skip research-phase

### Phase 6: RSS & Feeds
**Rationale:** Final discoverability feature, validates full content pipeline end-to-end. Separate phase because it's post-build process, independent of runtime.

**Delivers:** RSS/Atom/JSON feeds generated at build time, feed auto-discovery tags, sitemap generation

**Addresses:** RSS feed (table stakes from FEATURES.md)

**Uses:** feed package, build-time generation script (from STACK.md)

**Implements:** RSS generation at build time pattern (from ARCHITECTURE.md)

**Avoids:** RSS date format errors (Pitfall #4), feed not in standard location (Pitfall #11), missing sitemap (Pitfall #12)

**Research flag:** Standard patterns, skip research-phase

### Phase Ordering Rationale

- **Foundation first (Phase 1)**: Routing must work before any blog features. Early deployment testing catches hosting configuration issues.
- **Content pipeline next (Phase 2)**: Markdown loading must work before building UI that depends on it. Validates production build early.
- **Index before detail (Phase 3 → 4)**: Blog list simpler than post rendering, delivers visible progress sooner, validates manifest usage.
- **Function before discovery (Phases 1-4 → 5-6)**: Blog must work before worrying about SEO/RSS. SEO and RSS are independent final layers.
- **SEO before RSS (Phase 5 → 6)**: Both are discovery mechanisms, but SEO affects core page rendering while RSS is pure build-time output.

**Dependency chain:**
```
Phase 1 (Routing)
  ↓
Phase 2 (Markdown loading) ← Required by Phases 3 & 4
  ↓
Phase 3 (Blog index) ← Uses manifest from Phase 2
  ↓
Phase 4 (Post rendering) ← Uses markdown from Phase 2
  ↓
Phase 5 (SEO) ← Extends Phase 4 pages
  ↓
Phase 6 (RSS) ← Uses manifest from Phase 2
```

**Risk mitigation strategy:**
- Critical Pitfall #1 (404s) addressed in Phase 1 via early deployment testing
- Critical Pitfall #2 (glob failures) addressed in Phase 2 via production build testing
- Critical Pitfall #3 (bundle size) addressed in Phase 4 via selective imports and lazy loading
- Critical Pitfall #4 (RSS dates) addressed in Phase 6 via feed package and validation
- Moderate Pitfall #6 (SEO) addressed in Phase 5 as dedicated focus

### Research Flags

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Routing):** React Router v7 is well-documented, integration pattern proven
- **Phase 2 (Markdown):** gray-matter and import.meta.glob are standard tools with extensive usage examples
- **Phase 3 (Index):** Blog list patterns are common, no unique domain knowledge needed
- **Phase 5 (SEO):** react-helmet-async and Open Graph are well-established patterns
- **Phase 6 (RSS):** feed package abstracts complexity, RSS spec is standardized

**Phase needing light research:**
- **Phase 4 (Post rendering):** While react-markdown is standard, optimization for large posts and syntax highlighting bundle management may benefit from targeted research on:
  - Bundle analysis tools (rollup-plugin-visualizer)
  - Lazy loading strategies for syntax highlighter
  - Performance profiling for large markdown documents
  - Not deep research, just validation of optimization approaches

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All libraries verified via official documentation and npm registry, versions confirmed current as of 2026-01 |
| Features | HIGH | Table stakes features validated against multiple developer blog examples and portfolio best practices |
| Architecture | HIGH | Hybrid routing pattern proven in multiple sources, React Router v7 migration path clear, build pipeline approach validated |
| Pitfalls | HIGH | Critical pitfalls verified with official platform documentation (Netlify, GitHub Pages, Vite), RSS spec confirmed with W3C |

**Overall confidence:** HIGH

All research findings are backed by primary sources (official documentation, specifications, platform guides). No speculative or single-source claims in critical areas. Version numbers verified as of 2026-01-28.

### Gaps to Address

Despite high confidence, a few areas need validation during implementation:

- **Social media preview behavior:** react-helmet-async should work for client-side meta tag updates, but some social scrapers may not execute JavaScript. If perfect social previews are critical, may need to evaluate prerendering solutions (vite-plugin-ssr) during Phase 5. LOW priority gap — client-side meta tags work for most use cases.

- **Bundle size optimization limits:** Research identifies selective import strategies for syntax highlighting, but actual bundle impact depends on number of languages needed and post complexity. Should run bundle analysis during Phase 4 to validate optimization effectiveness. MEDIUM priority gap — has fallback strategies (lazy loading, code splitting).

- **GitHub Pages deployment limitations:** GitHub Pages workaround (404.html copy) has limitations compared to proper server rewrites. If deploying to GitHub Pages, may need to evaluate HashRouter as alternative during Phase 1. LOW priority gap — most modern hosts (Netlify, Vercel) have proper SPA support.

**Mitigation approach:**
- Social preview gap: Test with Facebook/Twitter debuggers during Phase 5, document known limitations
- Bundle size gap: Run rollup-plugin-visualizer during Phase 4, adjust strategy if needed
- GitHub Pages gap: Test deployment in Phase 1, switch to HashRouter if necessary (breaking change avoided by testing early)

## Sources

### Primary (HIGH confidence)
- **React Router v7 Official Documentation** (reactrouter.com) — routing patterns, declarative mode, migration guide
- **Vite Features Documentation** (vite.dev/guide/features) — import.meta.glob syntax, static asset handling, build configuration
- **react-markdown GitHub** (github.com/remarkjs/react-markdown) — component API, custom renderers, security model
- **gray-matter GitHub** (github.com/jonschlinkert/gray-matter) — frontmatter parsing, YAML support
- **feed Package GitHub** (github.com/jpmonette/feed) — RSS/Atom/JSON generation, TypeScript types
- **RSS 2.0 Specification** (validator.w3.org/feed/docs/rss2.html) — RFC-822 date requirements, feed structure
- **W3C Feed Validator** (validator.w3.org/feed) — validation testing tool
- **Netlify SPA Redirects** (docs.netlify.com) — _redirects configuration for client-side routing
- **Vite GitHub Issues** (#3222, #15564) — import.meta.glob production behavior, raw import syntax

### Secondary (MEDIUM confidence)
- **LogRocket React Router v7 Guide** (blog.logrocket.com) — practical migration examples, common patterns
- **Strapi React Markdown Guide** (strapi.io/blog) — security best practices, styling approaches
- **DEV Community** (dev.to) — markdown loading patterns, Vite + React integration examples
- **Medium articles** on React Router v7 vs v6, React SEO optimization — cross-verified with official sources

### Tertiary (validation recommended)
- **GitHub Discussions** on Vite production builds, React Router 404 handling — community solutions, cross-verified with docs
- **Blog posts** on RSS generation, syntax highlighting optimization — used for pattern validation only

---
*Research completed: 2026-01-28*
*Ready for roadmap: yes*
