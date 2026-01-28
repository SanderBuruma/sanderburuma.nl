# Phase 8: Blog Index Page - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can browse and filter blog posts on /blog. Post cards display title, date, excerpt, tags, and featured image. Tag filtering narrows results. This phase does NOT include individual post rendering (Phase 9), SEO (Phase 10), or theme integration (Phase 12).

</domain>

<decisions>
## Implementation Decisions

### Post card layout
- Featured image cards — show featured image when available
- Posts without featured image: text-only fallback (no placeholder graphic)
- Each card shows: featured image, title, date, excerpt, tag chips
- Single-column layout — full-width cards stacked vertically

### Tag filtering
- Horizontal row of tag chips at top of page, above post list
- Multi-tag AND filtering — selecting multiple tags shows posts matching ALL
- Clicking a tag on a post card toggles that tag in the active filter
- Client-side filtering only — URL stays /blog, no query params
- Clear-filter mechanism needed when tags are active

### Ordering & states
- Default sort: newest first (reverse chronological)
- No filter results: simple "No posts found for these tags" message with clear-filter button
- Zero posts state: "Coming soon" placeholder message
- Draft posts: hidden completely (published posts only)

### Page structure
- Page header: "Blog" title + brief subtitle/tagline
- Paginated: 10 posts per page
- Pagination style: numbered pages (1, 2, 3...) with prev/next buttons

### Claude's Discretion
- Exact card styling, spacing, typography
- Tag chip visual design
- Pagination component details
- Page transition behavior (existing pattern from Phase 6)
- Responsive breakpoints and mobile card layout

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches that fit the existing site style.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 08-blog-index-page*
*Context gathered: 2026-01-28*
