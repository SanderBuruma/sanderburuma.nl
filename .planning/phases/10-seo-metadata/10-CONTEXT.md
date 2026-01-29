# Phase 10: SEO & Metadata - Context

**Gathered:** 2026-01-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Blog posts are discoverable and shareable with proper metadata. Covers page titles, meta descriptions, Open Graph tags, Twitter cards, canonical URLs, structured data (JSON-LD), and robots meta. Applies to blog posts, blog index, and homepage. RSS feed is a separate phase.

</domain>

<decisions>
## Implementation Decisions

### Page title format
- Format: "Post Title | Sander Buruma" (pipe separator)
- Site name: "Sander Buruma"
- Blog index title: "Tech Blog | Sander Buruma"
- Homepage title: "Sander Buruma | Software Developer"

### Meta description source
- Blog posts: auto-extract first ~155 chars of post content
- Blog index: static description (Claude writes appropriate text)
- Homepage: static description (Claude writes appropriate text)

### Social card appearance
- Twitter card type: summary_large_image
- Fallback image: create a simple branded placeholder for posts without featured images
- OG URLs: hardcode https://sanderburuma.nl as base URL
- Full OG tags on blog index page too (not just individual posts)

### Additional SEO elements
- Canonical URL tags on all pages
- JSON-LD Article structured data on blog posts (author, date, image)
- Robots meta tags: index, follow on all pages
- Homepage and blog index also get full OG tags

### Claude's Discretion
- Exact meta description text for blog index and homepage
- Placeholder image design/approach
- JSON-LD schema structure details
- Whether to add og:type distinctions (website vs article)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-seo-metadata*
*Context gathered: 2026-01-29*
