# Phase 11: RSS & Feeds - Context

**Gathered:** 2026-01-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Generate an RSS 2.0 feed at build time containing all blog posts. Feed is discoverable via auto-discovery tag in site head. Users can subscribe via any feed reader.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion

User opted to skip detailed discussion — standard RSS implementation. Claude has flexibility on:

- Feed content depth (full content vs description/excerpt)
- Feed metadata (title, description, language, copyright)
- Item structure (what fields to include per post)
- Build integration approach (Vite plugin pattern like blogManifest/seoPrerender)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — standard RSS 2.0 approach is fine.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 11-rss-feeds*
*Context gathered: 2026-01-29*
