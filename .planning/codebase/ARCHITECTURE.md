# Architecture

**Analysis Date:** 2026-01-28

## Pattern Overview

**Overall:** Component-Based Single Page Application (SPA) with Section-Based Page Layout

**Key Characteristics:**
- React 19 with functional components and hooks
- Vite-based build system with hot module replacement
- Context API for global state management (theme)
- No external backend - fully client-side rendering
- Progressive enhancement with intersection observers for animations
- Modular section-based architecture for portfolio page composition

## Layers

**Presentation Layer (UI Components):**
- Purpose: Render visual interface and handle user interactions
- Location: `src/components/` and `src/sections/`
- Contains: React functional components, event handlers, JSX markup
- Depends on: React, hooks, utilities, styles
- Used by: App component and final rendered output

**State Management Layer:**
- Purpose: Manage application-wide state (theme) and local component state
- Location: `src/utils/hooks.jsx` (ThemeProvider, useTheme), local component state
- Contains: Context API provider, theme reducer, custom hooks
- Depends on: React hooks (useReducer, useContext, useState)
- Used by: App wrapper and consuming components (Navbar, all sections)

**Utilities & Hooks Layer:**
- Purpose: Provide reusable logic and helper functions
- Location: `src/utils/hooks.jsx`
- Contains: ThemeProvider, useTheme, useCountUp (animation hook), theme persistence logic
- Depends on: React, localStorage API
- Used by: Components needing theme access or animation effects

**Styling Layer:**
- Purpose: Define visual presentation, theming, and responsive design
- Location: `src/styles/styles.scss`
- Contains: SCSS variables, CSS custom properties, mixins, responsive styles, dark/light theme definitions
- Depends on: SCSS preprocessor, CSS custom properties
- Used by: All components via class-based styling

**Configuration & Build Layer:**
- Purpose: Define build process, optimization, and asset handling
- Location: `vite.config.js`, `package.json`
- Contains: Vite plugins (React, HTML, inline-css), build optimizations, chunk splitting
- Depends on: Vite, esbuild, Sass
- Used by: Build system during development and production builds

## Data Flow

**Application Initialization:**

1. HTML entry point (`index.html`) loads with React root div
2. `src/main.jsx` mounts React app to #root element
3. Imports global styles from `src/styles/styles.scss`
4. Renders `App` component wrapped in `ThemeProvider`

**Theme Management Flow:**

1. `ThemeProvider` in `App.jsx` initializes theme state from localStorage
2. Theme state stored in React Context (`ThemeContext`)
3. Components access theme via `useTheme()` hook
4. Theme changes trigger `data-theme` attribute update on document root
5. CSS custom properties adapt based on `[data-theme="dark"]` selector
6. Theme preference persisted to localStorage

**Page Scroll & Animation Flow:**

1. `AppContent` useEffect attaches scroll listeners
2. Intersection Observer detects elements entering viewport
3. Observed elements trigger fade-in and translateY animations
4. Parallax effect applied to floating cards based on scroll position
5. Smooth scroll navigation captures anchor link clicks
6. All animations use CSS transitions for performance

**Game State Flow (Minesweeper & Snake):**

1. Game sections (`MinesweeperSection`, `Snake4DSection`) manage local state
2. Game board/snake state stored in component state via useState
3. Game loop controlled via useRef and setInterval/requestAnimationFrame
4. Difficulty progression persisted to browser cookies
5. User input (clicks, keyboard) triggers state updates
6. Re-renders update visual representation

**State Management:**

- **Global:** Theme (dark/light mode) via Context API
- **Local:** All other state (game boards, scores, form inputs, UI toggles) managed in individual component state
- **Persistence:** Theme and game difficulty saved to localStorage and cookies respectively
- **No middleware:** No Redux, Zustand, or similar - plain React hooks pattern

## Key Abstractions

**ThemeProvider/ThemeContext:**
- Purpose: Centralized theme state management for dark/light mode
- Examples: `src/utils/hooks.jsx` (provider), `src/components/Navbar.jsx` (consumer)
- Pattern: React Context + useReducer for predictable state updates, custom hook for type-safe access

**useCountUp Custom Hook:**
- Purpose: Animate counter display with viewport visibility trigger
- Examples: Used in `src/sections/AboutSection.jsx` for stat animations
- Pattern: Combines useRef, useEffect, Intersection Observer, and requestAnimationFrame

**Section Components:**
- Purpose: Logical page segments (Hero, About, Projects, etc.) composed into full page
- Examples: `src/sections/HeroSection.jsx`, `src/sections/ProjectsSection.jsx`
- Pattern: Self-contained, no inter-section dependencies, styling via CSS classes

**Game Components:**
- Purpose: Standalone game implementations (4D Minesweeper, 4D Snake)
- Examples: `src/sections/MinesweeperSection.jsx`, `src/sections/Snake4DSection.jsx`
- Pattern: Complex game logic in single component, state management via useState, cookie persistence for settings

## Entry Points

**HTML Entry Point:**
- Location: `index.html`
- Triggers: Browser loads page
- Responsibilities: Defines DOM structure, meta tags for SEO, accessibility skip link, loads module script

**JavaScript Entry Point:**
- Location: `src/main.jsx`
- Triggers: HTML script tag loads module
- Responsibilities: Mounts React app, applies global styles, initializes React root

**App Root Component:**
- Location: `src/App.jsx`
- Triggers: React renders from main.jsx
- Responsibilities: Wraps content in ThemeProvider, sets up global DOM effects (smooth scroll, animations, parallax), composes all sections, attaches lifecycle listeners

**Development Entry Point:**
- Location: `vite.config.js`
- Triggers: `npm run dev` command
- Responsibilities: Configures dev server, enables HMR, defines build plugins

## Error Handling

**Strategy:** Silent degradation with feature detection

**Patterns:**
- Theme hook throws error if useTheme called outside ThemeProvider (fail-fast development)
- Game components check localStorage/cookie availability before access
- Intersection Observer wrapped in feature checks (fallback to no animation)
- Cookie helper functions gracefully handle missing cookies
- No global error boundary - individual sections fail gracefully

## Cross-Cutting Concerns

**Logging:** No logging framework used. Console logging possible for development but not observed in codebase.

**Validation:** Form inputs validated at component level (search terms, filter selections). No centralized validation library.

**Authentication:** Not applicable - fully public portfolio with no authentication.

**Accessibility:**
- ARIA labels on buttons and interactive elements (Navbar.jsx, ProjectsSection.jsx)
- Skip-to-content link in HTML
- Semantic HTML structure (nav, section tags)
- Screen-reader only class (.sr-only) defined in styles

**Performance Optimization:**
- CSS inlined in build (custom vite-plugin-css-inline)
- React vendor code split to separate chunk
- Font preload tags injected via Vite plugin
- CSS animations prefer transforms and opacity for GPU acceleration
- Intersection Observer for lazy animation triggers
- requestAnimationFrame for smooth scroll animations

---

*Architecture analysis: 2026-01-28*
