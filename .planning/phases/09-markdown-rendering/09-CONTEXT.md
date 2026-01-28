# Phase 9: Markdown Rendering - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can read full blog posts with rich markdown content rendered. Includes syntax-highlighted code blocks with copy, author/reading time metadata, featured image, and inline image handling. SEO metadata, RSS, and theme integration are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Post layout & reading experience
- Narrow content width (650px) for focused reading
- Headings accented with subtle left border or underline on h2/h3
- Headings are linkable — show # anchor icon on hover
- Links styled with accent color, no underline

### Code block presentation
- Syntax highlighting theme matches site theme (dark/light)
- Line numbers always shown on all code blocks
- Language label displayed in top-right corner (small text)
- Copy button icon appears on hover over the code block

### Post header & metadata
- Featured image displayed within content width (650px), below byline
- Byline: "Author Name · Date · X min read" (no avatar)
- Order: Title → tags + byline → featured image → content
- Tags displayed near the byline, linking back to filtered blog index

### Image & media handling
- Inline images at natural size (up to max width), centered
- Clicking an image opens a lightbox overlay with full-size view
- Alt text rendered as visible caption below the image
- Broken images show a styled placeholder box with alt text visible

### Claude's Discretion
- Exact typography choices (font sizes, weights, line height)
- Spacing between sections
- Lightbox implementation approach
- Syntax highlighting library choice
- Reading time calculation method
- Anchor link icon style

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

*Phase: 09-markdown-rendering*
*Context gathered: 2026-01-28*
