---
phase: 10-seo-metadata
plan: 01
subsystem: seo
status: complete
tags: [seo, react, open-graph, twitter-card, meta-tags, json-ld]

dependency_graph:
  requires:
    - 09-02 (BlogPost, BlogIndex, Portfolio pages exist)
  provides:
    - Dynamic meta tag management via SEOHead component
    - Per-page title, description, OG tags
    - Social media preview support
    - Fallback OG image for posts without featured images
  affects:
    - 10-02 (will use same fallback og-default.svg filename)

tech_stack:
  added:
    - SEOHead component (React useEffect for head manipulation)
  patterns:
    - Client-side document head updates via useEffect
    - Meta tag helper functions (setMetaTag, setMetaProperty, setLinkTag, setJsonLd)
    - Cleanup function to restore original meta tags on unmount

file_tracking:
  created:
    - src/components/SEOHead.jsx (dynamic meta tag component)
    - public/images/og-default.svg (fallback OG image, 1200x630)
  modified:
    - src/pages/BlogPost.jsx (integrated SEOHead with post metadata)
    - src/pages/BlogIndex.jsx (integrated SEOHead with blog index metadata)
    - src/pages/Portfolio.jsx (integrated SEOHead with homepage metadata)

decisions: []

metrics:
  duration: 5 min
  completed: 2026-01-29
---

# Phase 10 Plan 01: Dynamic SEO Metadata Summary

**One-liner:** Client-side meta tag management with SEOHead component, updating document head for all pages with proper OG tags, Twitter cards, and JSON-LD structured data.

## What Was Built

Created a reusable `SEOHead` component that dynamically updates the document head with page-specific metadata. The component uses React's `useEffect` to manage meta tags, Open Graph properties, Twitter Card tags, canonical URLs, and JSON-LD structured data for articles.

**Key features:**
- Accepts props: `title`, `description`, `url`, `image` (optional), `type` (website/article), `article` metadata
- Prepends domain to relative image paths automatically
- Falls back to `/images/og-default.svg` when no image provided
- Updates `document.title`, meta tags, OG tags, Twitter Card tags, canonical link
- Adds JSON-LD Article schema for blog posts with author, date, image
- Cleanup function restores original meta tags on unmount (prevents stale data during navigation)

**Integration:**
- **BlogPost page:** SEOHead with post title, description, URL, featured image, article metadata (author, date, tags)
- **BlogIndex page:** SEOHead with "Tech Blog" title, static description
- **Portfolio page:** SEOHead with "Software Developer" title, homepage description, existing og-image.jpg

**Fallback image:**
Created `og-default.svg` (1200x630) with dark theme, centered "Sander Buruma" text, "Tech Blog" subtitle, and decorative line. Used for blog posts without featured images.

## Implementation Details

### SEOHead Component Architecture

**Helper functions:**
- `getMetaContent(attr, value)` - Read existing meta tag content
- `getLinkHref(rel)` - Read existing link tag href
- `setMetaTag(name, content)` - Set/create meta tag by name attribute
- `setMetaProperty(property, content)` - Set/create meta tag by property attribute
- `setLinkTag(rel, href)` - Set/create link tag by rel attribute
- `setJsonLd(data)` - Set/create JSON-LD script tag

**useEffect flow:**
1. Store original meta tags for cleanup
2. Update document.title with format "{title} | Sander Buruma"
3. Set basic meta tags (description, robots)
4. Prepare image URL (prepend domain or use fallback)
5. Set Open Graph tags (title, description, url, image, type, site_name)
6. Set Twitter Card tags (card type, title, description, image)
7. Set canonical link tag
8. If article type: add og:article:author, published_time, tags + JSON-LD Article schema
9. Cleanup: restore original tags on unmount

**Design decisions:**
- Component returns `null` (no visual rendering, only side effects)
- Dependency array includes all props to re-run on prop changes
- Cleanup ensures no stale metadata when navigating between pages

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create SEOHead component and fallback OG image | b980c9c | src/components/SEOHead.jsx, public/images/og-default.svg |
| 2 | Integrate SEOHead into BlogPost page | 5143127 | src/pages/BlogPost.jsx |
| 3 | Integrate SEOHead into BlogIndex and Portfolio pages | c28b1de | src/pages/BlogIndex.jsx, src/pages/Portfolio.jsx |

## Integration Notes

### How SEOHead and Static Prerendering Work Together (Plan 02)

**Two concerns, two solutions:**
1. **Plan 01 (this plan) - SEOHead:** Handles client-side navigation. When users navigate via React Router, SEOHead updates the document head dynamically so the browser tab title and any client-side inspections show correct metadata.

2. **Plan 02 - seoPrerender:** Handles crawlers. Social media crawlers (Facebook, Twitter, LinkedIn) and search engines fetch the static HTML and do NOT execute JavaScript. Plan 02 generates static HTML files with baked-in OG tags at build time.

**Why both are needed:**
- Crawlers see static HTML from Plan 02 (correct OG tags for social previews)
- Users navigating the SPA see updated titles from Plan 01 (correct browser tab titles)

**No conflict:** SEOHead updates meta tags in the already-loaded document. By the time SEOHead runs, the crawler has already received and parsed the static HTML. SEOHead only affects the live DOM after JavaScript execution.

**Shared filename:** Both plans use `og-default.svg` (not `og-blog-default.svg`) as the fallback OG image filename.

## Code Quality

**Strengths:**
- Clear component documentation with JSDoc param descriptions
- Helper functions isolate DOM manipulation logic
- Cleanup function prevents memory leaks and stale data
- Automatic domain prepending for relative image paths
- Graceful fallback when no image provided

**Potential improvements:**
- Could memoize helper functions (currently re-created on each render)
- Could use refs to track which tags were created vs updated (for more precise cleanup)
- SEOHead currently runs on every prop change; could optimize with useMemo/useCallback

## Testing Notes

**Manual verification needed:**
1. Navigate to `/blog/hello-world` → browser tab shows "Welcome to My Blog | Sander Buruma"
2. View page source → shows original index.html meta tags (static HTML)
3. Inspect element in dev tools → shows updated meta tags from SEOHead (dynamic)
4. Navigate to `/blog` → browser tab shows "Tech Blog | Sander Buruma"
5. Navigate to `/` → browser tab shows "Software Developer | Sander Buruma"
6. Check meta tags in dev tools on each page:
   - Homepage: og:type = "website", og:image = "/og-image.jpg"
   - Blog index: og:type = "website", og:image = "/images/og-default.svg"
   - Blog post: og:type = "article", og:article:published_time present, og:article:tag tags present

**Expected behavior:**
- Meta tags update correctly when navigating between pages (no stale data)
- Browser tab title updates on navigation
- Featured image appears in og:image for posts with images
- Fallback image used for posts without featured images

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

**Blockers:** None

**Concerns:** None

**Dependencies met:**
- SEOHead component exists with all required props
- Fallback OG image exists at public/images/og-default.svg
- All three page components (BlogPost, BlogIndex, Portfolio) integrated
- Correct fallback filename `og-default.svg` used (shared with Plan 02)

**Ready for Plan 02:** Yes - Plan 02 will add static prerendering for crawlers, using the same fallback image filename.

---

*Phase:* 10-seo-metadata
*Plan:* 01
*Duration:* 5 min
*Completed:* 2026-01-29
