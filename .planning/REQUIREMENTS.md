# Requirements: sanderburuma.nl Blog

**Defined:** 2026-01-28
**Core Value:** Professional online presence showcasing technical skills

## v1.1 Requirements

Requirements for blog milestone. Each maps to roadmap phases.

### Routing

- [x] **ROUT-01**: User can navigate to /blog without breaking existing portfolio
- [x] **ROUT-02**: User can navigate to /blog/:slug for individual posts
- [x] **ROUT-03**: User can return to portfolio from blog via navigation
- [x] **ROUT-04**: Browser back/forward works correctly between blog and portfolio

### Blog Content

- [x] **BLOG-01**: User can view list of all blog posts on /blog page
- [x] **BLOG-02**: User can read individual blog post with full markdown content
- [x] **BLOG-03**: User can see publish date on each post
- [x] **BLOG-04**: User can see author information on each post
- [x] **BLOG-05**: User can see featured image at top of post
- [x] **BLOG-06**: User can see reading time estimate for each post
- [x] **BLOG-07**: Blog layout is responsive on mobile devices

### Markdown

- [x] **MARK-01**: Markdown content renders correctly (headings, lists, links, images)
- [x] **MARK-02**: Code blocks display with syntax highlighting
- [x] **MARK-03**: User can copy code blocks with one click
- [ ] **MARK-04**: Frontmatter metadata (title, date, tags, etc.) parsed correctly

### Tags

- [x] **TAGS-01**: User can see tags displayed on each post
- [x] **TAGS-02**: User can filter posts by clicking a tag
- [x] **TAGS-03**: User can see all posts with a specific tag (client-side filtering)

### SEO & Sharing

- [x] **SEO-01**: Each post has proper title and meta description
- [x] **SEO-02**: Each post has Open Graph tags for social sharing
- [x] **SEO-03**: Featured image appears in social media previews

### RSS

- [ ] **RSS-01**: RSS feed generated at /rss.xml with all posts
- [ ] **RSS-02**: RSS feed includes title, date, description for each post
- [ ] **RSS-03**: RSS feed validates against RSS 2.0 specification

### Theme

- [ ] **THEM-01**: Blog pages respect dark/light theme setting
- [ ] **THEM-02**: Theme toggle works on blog pages same as portfolio

## Future Requirements

Deferred to post-v1.1. Not in current roadmap.

### Discovery

- **DISC-01**: User can search posts by keyword
- **DISC-02**: User can see related posts at bottom of each post
- **DISC-03**: User can view posts as part of a series

### Navigation

- **NAV-01**: User can navigate between posts with keyboard arrows
- **NAV-02**: User can see table of contents for long posts
- **NAV-03**: User can share posts via social buttons

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Comments system | High maintenance, spam moderation, not worth complexity for personal blog |
| Newsletter signup | Email management overhead, GDPR compliance burden |
| User accounts | Not needed for read-only blog |
| CMS/admin UI | Markdown in git is simpler, edit in code editor |
| Multi-author workflow | Single author, no approval workflow needed |
| Content scheduling | Static site, publish manually when ready |
| Analytics dashboard | Simple analytics if any, not built into blog |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ROUT-01 | Phase 6 | Complete |
| ROUT-02 | Phase 6 | Complete |
| ROUT-03 | Phase 6 | Complete |
| ROUT-04 | Phase 6 | Complete |
| BLOG-01 | Phase 8 | Complete |
| BLOG-02 | Phase 9 | Complete |
| BLOG-03 | Phase 8 | Complete |
| BLOG-04 | Phase 9 | Complete |
| BLOG-05 | Phase 9 | Complete |
| BLOG-06 | Phase 9 | Complete |
| BLOG-07 | Phase 8 | Complete |
| MARK-01 | Phase 9 | Complete |
| MARK-02 | Phase 9 | Complete |
| MARK-03 | Phase 9 | Complete |
| MARK-04 | Phase 7 | Complete |
| TAGS-01 | Phase 8 | Complete |
| TAGS-02 | Phase 8 | Complete |
| TAGS-03 | Phase 8 | Complete |
| SEO-01 | Phase 10 | Complete |
| SEO-02 | Phase 10 | Complete |
| SEO-03 | Phase 10 | Complete |
| RSS-01 | Phase 11 | Pending |
| RSS-02 | Phase 11 | Pending |
| RSS-03 | Phase 11 | Pending |
| THEM-01 | Phase 12 | Pending |
| THEM-02 | Phase 12 | Pending |

**Coverage:**
- v1.1 requirements: 26 total
- Mapped to phases: 26 ✓
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-28*
*Last updated: 2026-01-28 (traceability updated after roadmap creation)*
