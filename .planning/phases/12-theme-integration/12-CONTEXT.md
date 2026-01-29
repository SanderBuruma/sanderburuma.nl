# Phase 12: Theme Integration - Context

**Gathered:** 2026-01-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Blog pages fully integrate with the existing dark/light theme system. Theme toggle, transitions, and all blog-specific styles adapt to both themes. No new capabilities — this is about making existing blog components theme-aware.

</domain>

<decisions>
## Implementation Decisions

### Blog typography & colors
- Body text matches portfolio text colors and contrast (no special blog treatment)
- Blog links get a distinct accent color, different from portfolio links
- Headings use the same style as portfolio section headings
- Blockquotes and horizontal rules have theme-aware styling (borders/backgrounds shift with theme)

### Code block theming
- Code blocks switch between atom-one-dark (dark theme) and atom-one-light (light theme)
- Inline code background and text color adapt to current theme
- Copy button icon and hover colors adapt to current theme
- Code block theme transition is animated (smooth fade between dark/light)

### Component styling
- Post cards: full theme shift — background, border, and shadow all change between dark/light
- Tag chips: themed — background and text colors adapt to dark/light
- Blog navigation bar: matches main navbar exactly (same background, text, hover states)
- Image lightbox: themed overlay — backdrop and controls adapt to current theme

### Transition behavior
- Theme toggle transition matches portfolio (same timing and style)
- Blog immediately renders in current theme when navigating from portfolio (no flash)
- Single shared theme preference across portfolio and blog
- Code block highlight theme transitions are animated (fade between themes)

### Claude's Discretion
- Exact blog accent color choice (must work in both themes)
- SCSS variable naming and architecture decisions
- Specifics of code block transition animation timing

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

*Phase: 12-theme-integration*
*Context gathered: 2026-01-29*
