# Phase 6: Routing Foundation - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Add React Router to enable blog routes (/blog, /blog/:slug) while preserving existing portfolio functionality. Portfolio anchor links (#about, #projects, etc.) must continue working. Blog pages will have a simplified navbar.

</domain>

<decisions>
## Implementation Decisions

### Navigation Integration
- Blog link appears FIRST in navbar: "Blog | About | Projects | Experience | Contact"
- Link text: "Blog" (not "Writing" or "Articles")
- Blog pages use SIMPLIFIED navbar: Logo + Blog + Portfolio link (not full portfolio sections)
- Logo links to portfolio root, "Blog" links to /blog, "Portfolio" link returns to main site

### URL Structure
- Blog index at `/blog`
- Individual posts at `/blog/:slug`
- Slugs are MANUAL in frontmatter (not auto-derived from title)
- RSS feed at `/rss.xml` (top-level, standard location)

### Transition Behavior
- Page-load feel (not instant SPA swap) — brief loading indicator
- Always scroll to top when returning to portfolio (don't restore position)
- Preserve existing anchor links: /#about, /#projects, etc. must still work
- Brief spinner/fade during route transitions

### 404 Handling
- Custom blog-specific 404 page for invalid /blog/* URLs
- Friendly/casual tone: "Oops, that post doesn't exist. Here's the blog instead."
- Links back to blog index

### Deployment
- Site hosted on VPS (45.76.20.122) via GitHub Actions
- Nginx config will need update to serve index.html for all routes (SPA fallback)
- Deployment workflow in `.github/workflows/` — may need post-deploy nginx reload

### Claude's Discretion
- Exact loading indicator implementation (spinner style, fade duration)
- Router configuration details
- How to structure the simplified blog navbar component

</decisions>

<specifics>
## Specific Ideas

- Blog should feel like a separate section, not deeply integrated with portfolio scroll
- Simplified navbar on blog gives it its own identity while maintaining site cohesion
- User explicitly wants "page-load feel" — transitions shouldn't be instant

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-routing-foundation*
*Context gathered: 2026-01-28*
