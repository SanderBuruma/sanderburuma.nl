# Phase 7: Markdown Infrastructure - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Build-time markdown processing infrastructure: discover markdown files, parse frontmatter metadata, generate a blog manifest JSON. This phase creates the data layer that Phase 8 (Blog Index) and Phase 9 (Markdown Rendering) consume.

</domain>

<decisions>
## Implementation Decisions

### File Organization
- Posts live in `src/content/blog/`
- Filename is just the slug: `my-first-post.md`
- No draft support — all files in folder are published
- Blog images stored in `public/images/blog/` (absolute paths)

### Frontmatter Schema
- **Required fields:** title, date, description, tags
- Tags are free-form strings (no validation list)
- Author defaults to site owner, can be overridden in frontmatter
- Featured image: convention-based — auto-detect first image in post if not specified in frontmatter

### Manifest Output
- Custom Vite plugin generates manifest at build time
- Posts sorted newest-first by date
- Excerpt uses frontmatter description field (not auto-generated from content)
- Reading time auto-calculated (~200 wpm)

### Content Workflow
- Author posts directly in repo (VS Code or editor of choice)
- Strict validation — build fails if required frontmatter fields missing
- Include sample post demonstrating all frontmatter fields

### Claude's Discretion
- Whether manifest includes full content or metadata-only (performance trade-off)
- Vite plugin implementation details
- Exact reading time calculation approach

</decisions>

<specifics>
## Specific Ideas

- Sample post should demonstrate all frontmatter fields and common markdown patterns
- Build errors should clearly indicate which file and which field is problematic

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-markdown-infrastructure*
*Context gathered: 2026-01-28*
