# sanderburuma.nl

## What This Is

A personal portfolio website for Sander Buruma, showcasing projects, experience, and interactive games (4D Minesweeper, 4D Snake). Built with React 19 and Vite, it's a single-page application with section-based architecture and dark/light theme support.

## Core Value

Professional online presence that showcases technical skills through both portfolio content and interactive demonstrations.

## Requirements

### Validated

- Portfolio sections (Hero, About, Experience, Projects, Contact)
- Interactive games (4D Minesweeper, 4D Snake) with difficulty progression
- Dark/light theme with persistence
- Contact form via Web3Forms
- Responsive design
- Animation effects (intersection observer, parallax)

### Active

- [ ] Blog section with Markdown content
- [ ] RSS feed generation
- [ ] React Router for /blog routes
- [ ] Blog post metadata (title, date, tags, author, featured image)
- [ ] Image support for blog posts

### Out of Scope

- Backend server — keeping it static/client-side
- CMS integration — Markdown files in repo
- Comments system — complexity not worth it for personal blog
- Newsletter signup — not needed for v1

## Context

**Tech stack:**
- React 19 with functional components
- Vite 7 build system
- SCSS for styling
- No backend (fully static)
- Currently no routing (single page)

**Deployment:** Static hosting (likely GitHub Pages or similar)

**Existing architecture:**
- Section-based components in `src/sections/`
- Shared components in `src/components/`
- Theme via Context API
- Build produces single HTML file with inlined CSS

## Constraints

- **Static hosting**: No server-side rendering, RSS must be build-time generated
- **No backend**: All content must be statically bundled or fetched client-side
- **Simplicity**: Minimal dependencies, avoid over-engineering

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React 19 + Vite | Modern stack, fast builds | ✓ Good |
| Section-based architecture | Clean separation of concerns | ✓ Good |
| Context API for theme | Simple, no Redux needed | ✓ Good |
| Add React Router for blog | Need proper routes for /blog/:slug | — Pending |
| Markdown in repo | Version control, no CMS complexity | — Pending |

---
*Last updated: 2026-01-28 after milestone v1.1 initialization*
