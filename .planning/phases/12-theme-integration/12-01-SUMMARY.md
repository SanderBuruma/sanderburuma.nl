---
phase: 12-theme-integration
plan: 01
subsystem: ui-theming
tags: [css, themes, dark-mode, code-blocks, navbar, lightbox, highlight.js]
completed: 2026-01-29
duration: 5min

dependencies:
  requires:
    - "09-01: MarkdownRenderer with rehype-highlight for code syntax highlighting"
  provides:
    - "Theme-aware code blocks with atom-one-light/dark CSS-only switching"
    - "Dark-mode-aware navbar and lightbox overlays"
  affects:
    - "All future blog post pages will inherit dual-theme code block highlighting"

tech-stack:
  added: []
  patterns:
    - "CSS variable-based theme switching for component-level styles"
    - "Dual highlight.js themes via CSS token overrides (no JS imports)"

decisions:
  - id: THEM-CSS-VARS
    what: "Use CSS variables for code block colors instead of importing highlight.js themes"
    why: "Enables instant theme switching without loading multiple stylesheets, smoother transitions"
    impact: "Code blocks now transition smoothly between themes; reduced CSS bundle size"

key-files:
  created: []
  modified:
    - path: "src/styles/styles.scss"
      changes:
        - "Added --code-* CSS variables to :root and [data-theme=dark]"
        - "Updated .code-block-wrapper, .code-line-numbers, .code-copy-btn to use variables"
        - "Added .hljs base and token rules for atom-one-light (default)"
        - "Added [data-theme=dark] .hljs token overrides for atom-one-dark"
        - "Updated .blog-navbar for translucent backdrop matching main navbar"
        - "Added dark theme overrides for .navbar, .blog-navbar, .image-lightbox"
    - path: "src/components/MarkdownRenderer.jsx"
      changes:
        - "Removed import 'highlight.js/styles/atom-one-dark.css' (now handled in SCSS)"
---

# Phase 12 Plan 01: Theme Integration Summary

**One-liner:** CSS-only dual theme switching for code blocks (atom-one-light/dark) and dark-mode-aware navbar/lightbox overlays

## What Was Built

Made all blog components fully theme-aware by:

1. **Theme-aware code blocks with dual highlight.js themes (CSS-only)**
   - Removed static `atom-one-dark.css` import from MarkdownRenderer
   - Added CSS variables for code block colors (background, text, line numbers, borders, button colors)
   - Updated code block wrapper, line numbers, copy button, and language label to use CSS variables
   - Implemented atom-one-light token colors as default (light theme)
   - Implemented atom-one-dark token colors in `[data-theme="dark"]` section
   - Added smooth transitions for all color properties

2. **Theme-aware navbar and lightbox overlays**
   - Updated blog navbar to use translucent backdrop (`rgba(255, 255, 255, 0.95)`) with `backdrop-filter: blur(10px)` matching main navbar
   - Added dark theme override for main navbar (`rgba(15, 23, 42, 0.95)`)
   - Added dark theme override for blog navbar with same backdrop effect
   - Updated lightbox overlay to use theme-aware backgrounds (lighter opacity in light mode, darker in dark mode)
   - Added smooth transitions for background color changes

## Decisions Made

**THEM-CSS-VARS: CSS variable-based theme switching**

Instead of importing highlight.js CSS theme files, implemented theme switching entirely through CSS variables and token-specific rules scoped to `[data-theme="dark"]`. This provides instant theme switching with smooth transitions and reduces CSS bundle size (removed one stylesheet import).

## Key Metrics

- **Files modified:** 2
- **Tasks completed:** 2/2
- **Commits:** 2 atomic commits
- **Build time:** ~33s (no change from baseline)
- **Bundle impact:** Reduced (removed highlight.js CSS import)

## Deviations from Plan

None - plan executed exactly as written.

## Technical Notes

### Code Block Theme Implementation

The dual-theme approach uses:
- CSS custom properties for structural colors (background, borders, UI elements)
- Direct hljs token class styling for syntax colors
- `[data-theme="dark"]` overrides for all token colors

This avoids JavaScript theme switching logic and provides instantaneous visual updates when the theme toggles.

### Navbar Backdrop Effect

Both main and blog navbars now use identical styling:
- Light theme: `rgba(255, 255, 255, 0.95)`
- Dark theme: `rgba(15, 23, 42, 0.95)`
- Both: `backdrop-filter: blur(10px)` for frosted glass effect

### Lightbox Overlay

Lightbox background opacity increases slightly in dark mode (0.85 → 0.92) to provide better contrast against the darker page background.

## Verification Results

Build completed successfully:
- ✓ `npm run build` completes without errors
- ✓ Code blocks use CSS variables for all colors
- ✓ Theme-aware hljs token rules present for both themes
- ✓ Navbar and lightbox have dark theme overrides
- ✓ All theme-dependent properties include transitions

## Next Phase Readiness

**Blockers:** None

**Concerns:** None

**Recommendations:**
- Phase 12 is complete with this plan (theme integration fully implemented)
- All blog and portfolio components now respond to theme toggle
- Consider visual testing with `npm run dev` to confirm theme transitions

## Implementation Details

### Files Changed

**src/styles/styles.scss:**
- Added 7 CSS variables per theme (14 total) for code block styling
- Added ~40 lines of hljs token color rules (light theme default)
- Added ~40 lines of hljs token color overrides (dark theme)
- Updated 4 code block component classes to use CSS variables
- Added 3 dark theme overrides for navbar/lightbox

**src/components/MarkdownRenderer.jsx:**
- Removed 1 static CSS import (highlight.js theme)

### Commits

1. `33e832d` - feat(12-01): implement theme-aware code blocks with dual highlight.js themes
2. `45c1484` - feat(12-01): add theme-aware navbar and lightbox overlays
