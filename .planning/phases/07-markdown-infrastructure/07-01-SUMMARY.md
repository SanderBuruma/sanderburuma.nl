---
phase: 07-markdown-infrastructure
plan: 01
subsystem: content-pipeline
tags: [markdown, vite-plugin, frontmatter, build-time-processing, content-validation]
requires: []
provides:
  - Blog manifest virtual module with post metadata
  - Frontmatter parsing and validation
  - Sample blog post structure
affects:
  - Phase 8 (Blog Index) - will consume manifest for post listing
  - Phase 9 (Markdown Rendering) - will use manifest content field for rendering
tech-stack:
  added: []
  patterns:
    - Vite virtual modules for build-time data generation
    - Custom lightweight frontmatter parser (no dependencies)
    - Build-time validation with descriptive errors
key-files:
  created:
    - src/content/blog/hello-world.md
    - src/plugins/blogManifest.js
  modified:
    - vite.config.js
decisions:
  - Include full markdown content in manifest for Phase 9 rendering
  - Validate at buildStart hook to ensure errors regardless of imports
  - Use lightweight parser instead of gray-matter dependency
metrics:
  duration: 8 minutes
  completed: 2026-01-28
---

# Phase 7 Plan 01: Markdown Processing Infrastructure Summary

**One-liner:** Built custom Vite plugin for markdown discovery, frontmatter parsing/validation, and blog manifest generation as virtual module

## What Was Built

Created the core markdown processing infrastructure that discovers blog posts at build time, validates frontmatter metadata, and generates a consumable manifest for the blog system.

### Key Components

1. **Sample Blog Post** (`hello-world.md`)
   - Demonstrates all required frontmatter fields (title, date, description, tags, author)
   - Shows common markdown patterns (headings, lists, code blocks, links, images)
   - Provides realistic content about blog launch

2. **Blog Manifest Plugin** (`blogManifest.js`)
   - Discovers all `.md` files in `src/content/blog/` directory
   - Custom lightweight frontmatter parser (no dependencies)
     - Handles YAML-like syntax: strings, arrays, dates
     - Split on `---` delimiters
   - Strict validation of required fields
     - title, date (YYYY-MM-DD format), description, tags (array)
     - Build fails with descriptive error showing filename and missing field
   - Calculates reading time (~200 words per minute, rounded up)
   - Extracts slug from filename
   - Defaults author to "Sander Buruma" if not in frontmatter
   - Auto-detects featured image from frontmatter or first image in content
   - Generates virtual module `virtual:blog-manifest` exporting post metadata array
   - Sorts posts newest-first by date
   - Includes full markdown content body for Phase 9 rendering
   - Hot module reload support for dev mode

3. **Vite Integration**
   - Imported and configured plugin in vite.config.js
   - Added `buildStart` hook to validate markdown at build time
   - Ensures validation runs even if virtual module not imported yet

## Technical Decisions

### Decision 1: Include Full Content in Manifest
**Context:** Phase 9 (Markdown Rendering) needs markdown content to render blog posts

**Decision:** Add `content` field to each manifest entry containing full post-frontmatter markdown body

**Rationale:**
- Simplifies Phase 9 implementation (single data source)
- Content already parsed during manifest generation
- No additional file I/O needed at runtime

**Trade-off:** Slightly larger manifest size, but acceptable for blog scale

### Decision 2: Validate at buildStart Hook
**Context:** Initial implementation only validated when virtual module imported

**Problem:** Build could succeed with invalid markdown if nothing imported the manifest yet

**Solution:** Added `buildStart` hook that runs `generateBlogManifest()` unconditionally

**Result:** Validation guaranteed to run on every build, catching errors early

### Decision 3: Custom Parser Instead of gray-matter
**Context:** Could use popular `gray-matter` library for frontmatter parsing

**Decision:** Built lightweight custom parser (~50 lines)

**Rationale:**
- Zero dependencies added to project
- Simple YAML-like syntax sufficient for needs
- Full control over error messages
- Educational value in understanding parsing

**Limitations:** Doesn't handle complex YAML features (nested objects, multiline strings with special syntax), but not needed for blog frontmatter

## Deviations from Plan

**None** - Plan executed exactly as written. No bugs found, no missing critical functionality, no blocking issues.

## Verification Results

✅ `npm run build` completes without errors with valid sample post
✅ `src/content/blog/hello-world.md` has all required frontmatter fields
✅ Blog manifest plugin loaded in vite.config.js
✅ Missing frontmatter causes descriptive build failure:
   - Created test file without `title` field
   - Build failed with: "Missing required frontmatter fields in test-validation.md: title"
   - Deleted test file
   - Clean build succeeded

## What's Working

- ✅ Markdown file discovery in `src/content/blog/`
- ✅ Frontmatter parsing (strings, arrays, dates)
- ✅ Validation of required fields with clear error messages
- ✅ Date format validation (YYYY-MM-DD)
- ✅ Tags array validation
- ✅ Reading time calculation
- ✅ Featured image detection (frontmatter or first content image)
- ✅ Slug extraction from filename
- ✅ Author defaulting
- ✅ Virtual module generation
- ✅ Post sorting (newest-first)
- ✅ Full content inclusion for rendering
- ✅ Build-time validation via buildStart hook
- ✅ Hot module reload support

## Sample Data Structure

The virtual module exports an array of post objects:

```javascript
[
  {
    slug: "hello-world",
    title: "Welcome to My Blog",
    date: "2026-01-28",
    description: "Launching my personal blog...",
    tags: ["meta", "web-development", "blogging"],
    author: "Sander Buruma",
    readingTime: 2,
    image: "../../../public/images/blog/hello-world.jpg",
    content: "# Welcome to My Blog\n\nI'm excited to launch..."
  }
]
```

## Next Phase Readiness

**Phase 8 (Blog Index):** ✅ Ready
- Manifest structure finalized
- Import path: `import manifest from 'virtual:blog-manifest'`
- Metadata fields complete (slug, title, date, description, tags, author, readingTime, image)
- Posts sorted newest-first

**Phase 9 (Markdown Rendering):** ✅ Ready
- Full markdown content available in `content` field
- Slug available for route matching
- Metadata available for page head/hero

**Blockers:** None

**Recommendations:**
- Phase 8 should use manifest for blog index page and pagination
- Phase 9 should use manifest content field + markdown-to-JSX library

## Files Modified

### Created
- `/mnt/c/Projects/sanderburuma.nl/src/content/blog/hello-world.md` - Sample blog post with all frontmatter fields and markdown patterns
- `/mnt/c/Projects/sanderburuma.nl/src/plugins/blogManifest.js` - Vite plugin for markdown processing and manifest generation

### Modified
- `/mnt/c/Projects/sanderburuma.nl/vite.config.js` - Added blogManifest plugin import and configuration

## Task Breakdown

| Task | Name | Commit | Duration | Files |
|------|------|--------|----------|-------|
| 1 | Create sample blog post and Vite blog manifest plugin | 02febc7 | ~5 min | hello-world.md, blogManifest.js |
| 2 | Integrate plugin into Vite config and verify build | f6fb3e5 | ~3 min | vite.config.js |

**Total execution:** 8 minutes

## Lessons Learned

1. **Virtual modules pattern:** Clean separation between build-time processing and runtime consumption
2. **Validation timing:** Need buildStart hook for guarantees, not just lazy load
3. **Error messages matter:** Including filename + missing field name makes debugging trivial
4. **Keep it simple:** Custom parser in ~50 lines vs adding dependency
5. **Think ahead:** Including full content in manifest simplifies future phases

## Knowledge for Future Phases

- Virtual module import: `import manifest from 'virtual:blog-manifest'`
- Manifest is regenerated on HMR when .md files change
- Build will fail fast if frontmatter invalid
- Content field contains markdown string ready for parsing
- Posts already sorted by date (newest first)

---

*Completed: 2026-01-28 19:21 UTC*
*Duration: 8 minutes*
*Tasks: 2/2*
*Commits: 02febc7, f6fb3e5*
