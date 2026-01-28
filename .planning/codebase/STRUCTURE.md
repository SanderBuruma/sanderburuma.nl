# Codebase Structure

**Analysis Date:** 2026-01-28

## Directory Layout

```
sanderburuma.nl/
├── src/                    # Source code - React application
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation bar with theme toggle
│   │   └── Footer.jsx      # Footer component
│   ├── sections/           # Page sections (composable)
│   │   ├── HeroSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── ExperienceSection.jsx
│   │   ├── ProjectsSection.jsx
│   │   ├── MinesweeperSection.jsx
│   │   └── Snake4DSection.jsx
│   ├── utils/              # Utility functions and hooks
│   │   └── hooks.jsx       # Custom hooks (useTheme, useCountUp, ThemeProvider)
│   ├── styles/             # Global stylesheets
│   │   ├── styles.scss     # Main SCSS file (compiled to CSS)
│   │   └── styles.css      # Compiled CSS output
│   ├── App.jsx             # Root component with global effects
│   └── main.jsx            # Vite entry point - mounts React
├── public/                 # Static assets (copied to dist)
│   ├── favicon.ico
│   ├── og-image.jpg
│   ├── robots.txt
│   └── sitemap.xml
├── dist/                   # Production build output (generated)
├── node_modules/           # Dependencies (generated)
├── .planning/              # GSD planning documents
├── .github/                # GitHub configuration
├── .server-config/         # Server configuration files
├── index.html              # HTML entry point
├── vite.config.js          # Vite build configuration
├── package.json            # Project metadata and scripts
├── package-lock.json       # Dependency lock file
└── README.md               # Project documentation
```

## Directory Purposes

**src/**
- Purpose: All React source code for the application
- Contains: Components, sections, styles, utilities, entry points
- Key files: `main.jsx` (entry), `App.jsx` (root), `styles/styles.scss` (global styles)

**src/components/**
- Purpose: Reusable UI components (header, footer, navigation)
- Contains: Functional React components
- Key files: `Navbar.jsx` (navigation + theme), `Footer.jsx` (footer)

**src/sections/**
- Purpose: Self-contained page sections that compose the portfolio
- Contains: Functional React components, one per major page section
- Key files: `HeroSection.jsx`, `ProjectsSection.jsx`, `MinesweeperSection.jsx`, `Snake4DSection.jsx`
- Pattern: Each section is independent, no cross-section dependencies

**src/utils/**
- Purpose: Shared utilities, hooks, and helper functions
- Contains: Custom React hooks, context providers, helper functions
- Key files: `hooks.jsx` (theme management, animation hooks)

**src/styles/**
- Purpose: Global stylesheet and styling configuration
- Contains: SCSS source and compiled CSS
- Key files: `styles.scss` (source), `styles.css` (compiled output)
- Note: SCSS compiles to CSS, map file for debugging

**public/**
- Purpose: Static assets served at root level
- Contains: Favicon, metadata images, SEO files
- Key files: `robots.txt` (SEO), `sitemap.xml` (SEO), `og-image.jpg` (social media)

**dist/**
- Purpose: Production build output directory
- Generated: Yes (created by `npm run build`)
- Committed: No (in .gitignore)

**.planning/**
- Purpose: GSD orchestrator planning documents
- Generated: Yes (by GSD tools)
- Committed: Yes

## Key File Locations

**Entry Points:**
- `index.html`: HTML root - defines DOM structure, meta tags, loads React app
- `src/main.jsx`: JavaScript entry point - mounts React to DOM
- `src/App.jsx`: React root component - wraps app in theme provider, sets up global effects

**Configuration:**
- `vite.config.js`: Build tool configuration (plugins, optimization, asset handling)
- `package.json`: Project metadata, dependencies, build scripts
- `tsconfig.json`: Not present (uses JSX, not TypeScript)

**Core Logic:**
- `src/App.jsx`: Global DOM effects (smooth scroll, animations, parallax), section composition
- `src/utils/hooks.jsx`: Theme state management (Context + useReducer), custom hooks
- `src/components/Navbar.jsx`: Navigation and theme toggle UI
- `src/sections/**: Individual page sections (HeroSection, AboutSection, ProjectsSection, etc.)

**Game Logic:**
- `src/sections/MinesweeperSection.jsx`: 4D Minesweeper game implementation
- `src/sections/Snake4DSection.jsx`: 4D Snake game implementation
- Both store game state in component state and difficulty in browser cookies

**Styling:**
- `src/styles/styles.scss`: All global styles, CSS variables, theme definitions, responsive design
- `src/styles/styles.css`: Compiled output (auto-generated from SCSS)

## Naming Conventions

**Files:**
- Components: PascalCase with `.jsx` extension (e.g., `HeroSection.jsx`, `Navbar.jsx`)
- Hooks: PascalCase exports from utility files (e.g., `useTheme`, `useCountUp`)
- Styles: kebab-case classes matching component names (e.g., `.navbar`, `.hero-section`)
- Config: camelCase (e.g., `vite.config.js`)

**Directories:**
- Feature directories: lowercase plural (e.g., `components/`, `sections/`, `styles/`, `utils/`)
- Build output: standard conventions (`dist/`, `node_modules/`)

**CSS Classes:**
- BEM-inspired: block__element--modifier (e.g., `.nav-menu`, `.nav-item`, `.filter-btn.active`)
- Section classes: `.hero`, `.about`, `.projects` (matching section IDs)
- Utility classes: `.container`, `.btn`, `.btn-primary`, `.btn-secondary`, `.section-title`
- Animation classes: `.floating-card`, `.skill-category`, `.project-card`

**Component Props & State:**
- Props: camelCase (e.g., `onClick`, `className`, `aria-label`)
- State variables: camelCase (e.g., `isDark`, `mobileMenuOpen`, `isVisible`)
- Event handlers: camelCase prefixed with `handle` (e.g., `handleScroll`, `handleClick`)

## Where to Add New Code

**New Section/Page Feature:**
- Create file: `src/sections/NewFeatureSection.jsx`
- Import in: `src/App.jsx` (compose into AppContent)
- Add route link: `src/components/Navbar.jsx` (add to nav menu array)
- Add styles: Import or add classes to `src/styles/styles.scss`
- Pattern: Copy structure from existing section (HeroSection, ProjectsSection, etc.)

**New Reusable Component:**
- Create file: `src/components/ComponentName.jsx`
- Import in: Target section or App.jsx
- Pattern: Functional component with props, no local complexity

**New Custom Hook:**
- Add to: `src/utils/hooks.jsx` or create `src/utils/customHook.jsx`
- Pattern: Follow existing hooks (useTheme, useCountUp) - use React hooks, export from utils
- Import in: Components needing the hook

**New Styles/Theme:**
- Add to: `src/styles/styles.scss`
- Pattern: Use existing CSS variables and SCSS mixins
- Add CSS variables for: colors, spacing, shadows, gradients
- Define both light and dark variants in `[data-theme="dark"]` block

**Game Feature:**
- Modify: `src/sections/MinesweeperSection.jsx` or `Snake4DSection.jsx`
- Pattern: Game state in component useState, persistence in cookies (getCookie/setCookie helpers)
- Complexity: Game logic self-contained in component, no extraction needed unless excessive

**Utility/Helper:**
- Create: `src/utils/helperName.js` or add to `src/utils/hooks.jsx`
- Pattern: Pure functions or custom hooks
- Import in: Consuming components as needed

## Special Directories

**.github/**
- Purpose: GitHub configuration (workflows, templates, etc.)
- Generated: No
- Committed: Yes

**.server-config/**
- Purpose: Server-side configuration (deployment, hosting setup)
- Generated: No
- Committed: Yes
- Note: Contains deployment-related configuration

**.planning/codebase/**
- Purpose: GSD codebase analysis documents (ARCHITECTURE.md, STRUCTURE.md, etc.)
- Generated: Yes (by GSD mapping commands)
- Committed: Yes

**dist/**
- Purpose: Production-ready build output
- Generated: Yes (by `npm run build`)
- Committed: No (in .gitignore)

**node_modules/**
- Purpose: Installed npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No (in .gitignore)

---

*Structure analysis: 2026-01-28*
