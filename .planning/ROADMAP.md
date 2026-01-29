# Roadmap: sanderburuma.nl Blog

## Overview

This roadmap delivers a complete blog feature for the personal portfolio site, adding proper routing, markdown content processing, and discoverability features while preserving existing portfolio functionality. Starting from the routing foundation and building through content infrastructure, user-facing pages, and finally optimization layers (SEO, RSS, theme integration), each phase delivers verifiable user-facing capabilities.

## Milestones

- v1.0 Portfolio Launch - Phases 1-5 (shipped pre-GSD)
- v1.1 Blog Section - Phases 6-12 (in progress)

## Phases

**Phase Numbering:**
- Integer phases (6, 7, 8, etc.): Planned milestone work
- Decimal phases (7.1, 7.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

### v1.0 Portfolio Launch (Phases 1-5) - SHIPPED

<details>
<summary>Completed phases (pre-GSD tracking)</summary>

**Phases 1-5:** Portfolio sections, interactive games, theme system, contact form, responsive design.

Pre-GSD implementation, no detailed phase breakdown available.

</details>

### v1.1 Blog Section (In Progress)

**Milestone Goal:** Add blog section with markdown content, RSS feed, and proper routing without breaking existing portfolio.

#### Phase 6: Routing Foundation -- COMPLETE
**Goal**: Portfolio and blog coexist with proper routes and navigation
**Depends on**: Nothing (first phase of milestone)
**Requirements**: ROUT-01, ROUT-02, ROUT-03, ROUT-04
**Success Criteria** (what must be TRUE):
  1. User can navigate to /blog without breaking portfolio sections
  2. User can navigate to /blog/:slug URLs for individual posts
  3. User can use browser back/forward buttons between blog and portfolio
  4. User can click navigation links to return to portfolio from blog
  5. Direct links to blog URLs work on deployed site (no 404 errors)
**Plans:** 3 plans
**Completed:** 2026-01-28

Plans:
- [x] 06-01-PLAN.md -- Install React Router and create router structure
- [x] 06-02-PLAN.md -- Update navigation (Navbar + BlogNavbar)
- [x] 06-03-PLAN.md -- Blog page shells, transitions, and verification

#### Phase 7: Markdown Infrastructure -- COMPLETE
**Goal**: Markdown files load correctly with metadata extracted
**Depends on**: Phase 6
**Requirements**: MARK-04
**Success Criteria** (what must be TRUE):
  1. Markdown files can be discovered and loaded at build time
  2. Frontmatter metadata (title, date, tags, author, description, featured image) is parsed correctly
  3. Blog manifest JSON is generated with all post metadata
  4. Production build successfully includes markdown content (no import.meta.glob failures)
**Plans:** 1 plan
**Completed:** 2026-01-28

Plans:
- [x] 07-01-PLAN.md -- Vite blog manifest plugin with frontmatter parsing and validation

#### Phase 8: Blog Index Page -- COMPLETE
**Goal**: Users can browse and filter blog posts
**Depends on**: Phase 7
**Requirements**: BLOG-01, BLOG-03, BLOG-07, TAGS-01, TAGS-02, TAGS-03
**Success Criteria** (what must be TRUE):
  1. User can view list of all blog posts on /blog with title, date, and excerpt
  2. User can see tags displayed on each post card
  3. User can click a tag to filter posts by that tag
  4. User can view filtered posts at /blog?tag=X
  5. Blog index is responsive on mobile devices
**Plans:** 1 plan
**Completed:** 2026-01-28

Plans:
- [x] 08-01-PLAN.md -- Blog index page with post cards, tag filtering, and pagination

#### Phase 9: Markdown Rendering -- COMPLETE
**Goal**: Users can read full blog posts with rich markdown content
**Depends on**: Phase 7
**Requirements**: BLOG-02, BLOG-04, BLOG-05, BLOG-06, MARK-01, MARK-02, MARK-03
**Success Criteria** (what must be TRUE):
  1. User can read individual blog post with full markdown content rendered
  2. Markdown headings, lists, links, and images render correctly
  3. Code blocks display with syntax highlighting
  4. User can copy code blocks with one click
  5. User can see author information on each post
  6. User can see featured image at top of post
  7. User can see reading time estimate for each post
**Plans:** 2 plans
**Completed:** 2026-01-29

Plans:
- [x] 09-01-PLAN.md -- MarkdownRenderer component with syntax highlighting, copy, lightbox
- [x] 09-02-PLAN.md -- BlogPost page wiring with header/metadata and styles

#### Phase 10: SEO & Metadata
**Goal**: Blog posts are discoverable and shareable with proper metadata
**Depends on**: Phase 9
**Requirements**: SEO-01, SEO-02, SEO-03
**Success Criteria** (what must be TRUE):
  1. Each blog post has unique title and meta description in page head
  2. Each blog post has Open Graph tags (title, description, image, URL)
  3. Featured image appears correctly in social media previews (Twitter, Facebook, LinkedIn)
  4. Social media preview debuggers show correct metadata
**Plans:** 1 plan

Plans:
- [ ] 10-01-PLAN.md -- SEOHead component with dynamic meta tags, OG, Twitter cards, JSON-LD

#### Phase 11: RSS & Feeds
**Goal**: Blog content is syndicated via RSS feed
**Depends on**: Phase 7
**Requirements**: RSS-01, RSS-02, RSS-03
**Success Criteria** (what must be TRUE):
  1. RSS feed is generated at /rss.xml during build
  2. RSS feed includes title, date, description, and link for each post
  3. RSS feed validates against RSS 2.0 specification (W3C validator)
  4. RSS feed auto-discovery tag exists in site head
**Plans**: TBD

Plans:
- [ ] 11-01: [TBD during plan-phase]

#### Phase 12: Theme Integration
**Goal**: Blog pages fully integrate with existing theme system
**Depends on**: Phase 8, Phase 9
**Requirements**: THEM-01, THEM-02
**Success Criteria** (what must be TRUE):
  1. Blog pages respect current dark/light theme setting
  2. Theme toggle works on blog pages same as portfolio
  3. Blog styles extend existing SCSS architecture consistently
  4. Theme transitions are smooth between portfolio and blog sections
**Plans**: TBD

Plans:
- [ ] 12-01: [TBD during plan-phase]

## Progress

**Execution Order:**
Phases execute in numeric order: 6 -> 7 -> 8 -> 9 -> 10 -> 11 -> 12

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 6. Routing Foundation | v1.1 | 3/3 | Complete | 2026-01-28 |
| 7. Markdown Infrastructure | v1.1 | 1/1 | Complete | 2026-01-28 |
| 8. Blog Index Page | v1.1 | 1/1 | Complete | 2026-01-28 |
| 9. Markdown Rendering | v1.1 | 2/2 | Complete | 2026-01-29 |
| 10. SEO & Metadata | v1.1 | 0/1 | Planned | - |
| 11. RSS & Feeds | v1.1 | 0/? | Not started | - |
| 12. Theme Integration | v1.1 | 0/? | Not started | - |

---
*Created: 2026-01-28*
*Last updated: 2026-01-29*
