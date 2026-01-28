# Architecture Patterns: Blog Integration

**Domain:** Adding blog to existing React/Vite SPA
**Researched:** 2026-01-28
**Confidence:** HIGH

## Executive Summary

Integrating a blog into an existing single-page React application requires introducing routing without breaking existing anchor-based navigation. The recommended architecture uses React Router for client-side routing while preserving the existing single-page behavior for the portfolio sections. Markdown content is processed at build time for static blogs or runtime for dynamic blogs, with RSS feed generation occurring during the Vite build phase.

**Key architectural decision:** Use a hybrid routing approach where the root path (`/`) remains a traditional SPA with anchor navigation, while blog routes (`/blog`, `/blog/:slug`) use React Router's routing system.

## Recommended Architecture

### High-Level Structure

```
App (with ThemeProvider)
├── RouterProvider (React Router v6)
    ├── Root Layout (shared Navbar + Footer)
        ├── Route: "/" → Portfolio Page (existing AppContent)
        │   └── All existing sections (Hero, About, Projects, etc.)
        │
        ├── Route: "/blog" → Blog Index Page
        │   └── List of blog posts with previews
        │
        └── Route: "/blog/:slug" → Blog Post Page
            └── Individual post with rendered Markdown
```

### Component Boundaries

| Component | Responsibility | Communicates With | New/Modified |
|-----------|---------------|-------------------|--------------|
| `App.jsx` | Root component, wraps RouterProvider in ThemeProvider | RouterProvider, ThemeProvider | **MODIFIED** - Add routing |
| `RootLayout.jsx` | Shared layout with Navbar + Footer + Outlet | Navbar, Footer, child routes | **NEW** |
| `PortfolioPage.jsx` | Existing single-page portfolio content | All existing sections | **NEW** - Extracted from App |
| `BlogIndexPage.jsx` | Lists all blog posts with metadata | BlogPostCard components | **NEW** |
| `BlogPostPage.jsx` | Renders individual blog post | Markdown renderer, blog content loader | **NEW** |
| `BlogPostCard.jsx` | Preview card for blog post listing | BlogIndexPage | **NEW** |
| `Navbar.jsx` | Navigation bar with theme toggle | Blog links, theme context | **MODIFIED** - Add blog link |
| `Footer.jsx` | Site footer | No changes needed | **UNCHANGED** |
| `ThemeProvider` | Theme context management | All components | **UNCHANGED** |

## Data Flow

### Blog Content Loading Flow

**Build-Time (Static Approach - Recommended):**

1. Vite plugin or build script scans `content/blog/` directory for `.md` files
2. `gray-matter` parses frontmatter (title, date, slug, excerpt) from each file
3. Metadata extracted into JSON manifest: `blogManifest.json`
4. Markdown content optionally pre-rendered to HTML
5. Manifest imported at runtime for blog index rendering
6. Individual posts loaded via dynamic imports or from pre-rendered HTML

**Runtime (Dynamic Approach - Alternative):**

1. `import.meta.glob('./content/blog/*.md', { eager: false })` discovers all markdown files
2. Blog index page requests metadata from all discovered files
3. User navigates to `/blog/:slug`
4. Matching markdown file loaded via dynamic import
5. `gray-matter` parses frontmatter and content
6. `react-markdown` renders content to React components

### RSS Feed Generation Flow

1. **Build Phase:** Vite build hook triggers RSS generation script
2. Script reads blog manifest or scans markdown files directly
3. `feed` package creates RSS feed object
4. Blog posts added as feed items with title, description, date, link
5. RSS XML written to `dist/rss.xml`
6. RSS link added to HTML `<head>` via Vite plugin

### Routing Flow

**Portfolio Navigation (Existing Behavior):**

1. User clicks anchor link (e.g., `#about`)
2. Existing smooth scroll handler in `App.jsx` prevents default
3. Scroll animation to target section
4. URL updates to `/#about`

**Blog Navigation (New Behavior):**

1. User clicks blog link or navigates to `/blog`
2. React Router intercepts navigation
3. RouterProvider renders BlogIndexPage via Route match
4. Markdown content loaded (static or dynamic)
5. `react-markdown` renders content with syntax highlighting

## Integration Points with Existing Architecture

### 1. ThemeProvider Integration

**Unchanged:** ThemeProvider wraps RouterProvider at App root level.

```jsx
// src/App.jsx
const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
```

**Result:** Blog pages automatically inherit dark/light theme via existing CSS custom properties and `data-theme` attribute.

### 2. Navbar Integration

**Modified:** Add blog navigation link to existing nav items.

**Challenge:** Navbar currently uses anchor links (`#about`, `#projects`) which don't trigger route changes. Blog link uses React Router's `<Link to="/blog">`.

**Solution:** Detect active route with `useLocation()` to highlight current section/page. Use `<Link>` for blog routes, existing `<a>` tags for anchor links.

```jsx
// src/components/Navbar.jsx (conceptual modification)
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  const isBlogActive = location.pathname.startsWith('/blog')

  return (
    <nav className="navbar">
      {/* Existing anchor links */}
      <a href="#about">About</a>
      {/* New blog link */}
      <Link to="/blog" className={isBlogActive ? 'active' : ''}>Blog</Link>
    </nav>
  )
}
```

### 3. Footer Integration

**Unchanged:** Footer remains static component, renders identically on all pages via RootLayout.

### 4. Styling Integration

**Approach:** Blog components use existing SCSS architecture.

- Add blog-specific styles to `src/styles/styles.scss` or separate `src/styles/blog.scss` imported from main stylesheet
- Reuse existing CSS classes for cards, buttons, typography
- Leverage existing theme variables for consistency
- Follow existing naming conventions (`.blog-card`, `.blog-header`)

### 5. Build Pipeline Integration

**Current Build:**
- Vite compiles React components
- SCSS processed to CSS
- CSS inlined via custom plugin
- Fonts preloaded via vite-plugin-html

**New Build Steps:**
1. **Before Vite build:** Generate blog manifest from markdown files
2. **During Vite build:** Process markdown imports (if using vite-plugin-markdown)
3. **After Vite build:** Generate RSS feed from manifest

**Implementation:** Add custom Vite plugin or pre-build script in `package.json`.

```json
// package.json
{
  "scripts": {
    "prebuild": "node scripts/generateBlogManifest.js",
    "build": "vite build && node scripts/generateRSS.js",
  }
}
```

## Patterns to Follow

### Pattern 1: Hybrid Routing (Portfolio + Blog)

**What:** Combine traditional single-page anchor navigation with React Router for blog.

**When:** Existing SPA has no routing but needs new multi-page sections.

**Why:** Preserves existing behavior, avoids rewriting entire app, enables SEO-friendly URLs for blog.

**Implementation:**

```jsx
// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import PortfolioPage from './pages/PortfolioPage'
import BlogIndexPage from './pages/BlogIndexPage'
import BlogPostPage from './pages/BlogPostPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true, // Matches "/" exactly
        element: <PortfolioPage />
      },
      {
        path: 'blog',
        children: [
          {
            index: true, // Matches "/blog"
            element: <BlogIndexPage />
          },
          {
            path: ':slug', // Matches "/blog/my-post"
            element: <BlogPostPage />
          }
        ]
      }
    ]
  }
])

const App = () => (
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
)
```

### Pattern 2: Static Blog Manifest

**What:** Pre-generate JSON index of all blog posts at build time.

**When:** Blog content is markdown files in repository, updated via commits.

**Why:** Faster runtime performance, simpler data loading, no filesystem access needed at runtime.

**Implementation:**

```javascript
// scripts/generateBlogManifest.js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const blogDir = './content/blog'
const posts = fs.readdirSync(blogDir)
  .filter(file => file.endsWith('.md'))
  .map(file => {
    const content = fs.readFileSync(path.join(blogDir, file), 'utf-8')
    const { data, excerpt } = matter(content, { excerpt: true })
    return {
      slug: file.replace('.md', ''),
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || excerpt,
      tags: data.tags || []
    }
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))

fs.writeFileSync('./src/data/blogManifest.json', JSON.stringify(posts, null, 2))
```

**Usage:**

```jsx
// src/pages/BlogIndexPage.jsx
import blogManifest from '../data/blogManifest.json'

const BlogIndexPage = () => {
  return (
    <div className="blog-index">
      {blogManifest.map(post => (
        <BlogPostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
```

### Pattern 3: Dynamic Markdown Loading with React

**What:** Load and render markdown content at runtime using react-markdown.

**When:** Blog post accessed by user.

**Why:** Flexible, enables custom React components in markdown, supports syntax highlighting.

**Implementation:**

```jsx
// src/pages/BlogPostPage.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import matter from 'gray-matter'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const BlogPostPage = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    // Dynamic import of markdown file
    import(`../content/blog/${slug}.md?raw`)
      .then(module => {
        const { data, content } = matter(module.default)
        setPost({ ...data, content })
      })
      .catch(err => console.error('Post not found', err))
  }, [slug])

  if (!post) return <div>Loading...</div>

  return (
    <article className="blog-post">
      <h1>{post.title}</h1>
      <time>{new Date(post.date).toLocaleDateString()}</time>
      <Markdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {post.content}
      </Markdown>
    </article>
  )
}
```

### Pattern 4: RSS Feed Generation at Build Time

**What:** Generate RSS XML file during Vite build process.

**When:** Static site deployment where RSS should reflect published content.

**Why:** RSS readers expect static XML file, no runtime generation needed.

**Implementation:**

```javascript
// scripts/generateRSS.js
import { Feed } from 'feed'
import fs from 'fs'
import blogManifest from '../src/data/blogManifest.json' assert { type: 'json' }

const feed = new Feed({
  title: "Sander Buruma's Blog",
  description: "Thoughts on software development and 4D games",
  id: "https://sanderburuma.nl/",
  link: "https://sanderburuma.nl/",
  language: "en",
  favicon: "https://sanderburuma.nl/favicon.ico",
  copyright: "All rights reserved 2026, Sander Buruma",
  author: {
    name: "Sander Buruma",
    email: "sander@sanderburuma.nl",
    link: "https://sanderburuma.nl"
  }
})

blogManifest.forEach(post => {
  feed.addItem({
    title: post.title,
    id: `https://sanderburuma.nl/blog/${post.slug}`,
    link: `https://sanderburuma.nl/blog/${post.slug}`,
    description: post.excerpt,
    date: new Date(post.date)
  })
})

fs.writeFileSync('./dist/rss.xml', feed.rss2())
console.log('RSS feed generated at dist/rss.xml')
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Full SPA Rewrite to Use Routing

**What:** Converting entire portfolio to React Router routes (`/about`, `/projects`, etc.).

**Why bad:** Unnecessary work, breaks existing URLs, disrupts existing smooth scroll animations, no SEO benefit for single-page content.

**Instead:** Use hybrid approach - keep portfolio as single page, add routing only for blog.

### Anti-Pattern 2: Runtime Markdown Parsing Without Caching

**What:** Parsing markdown and generating HTML on every component render.

**Why bad:** Expensive operation, causes performance issues, unnecessary re-parsing of static content.

**Instead:** Use React memoization (`useMemo`) or pre-render markdown at build time.

### Anti-Pattern 3: Mixing HashRouter and BrowserRouter

**What:** Using HashRouter for blog routes while portfolio uses anchor links.

**Why bad:** Confusing URL structure (`/#/blog` vs `/#about`), harder to distinguish blog from portfolio sections, poor SEO for blog.

**Instead:** Use BrowserRouter for clean URLs (`/blog/post` and `/#about` coexist naturally).

### Anti-Pattern 4: Loading All Blog Content on Index Page

**What:** Fetching full markdown content of all posts to render index page.

**Why bad:** Slow initial load, unnecessary data transfer, poor performance as blog grows.

**Instead:** Use manifest with excerpts, load full content only when post opened.

### Anti-Pattern 5: Inline RSS in HTML

**What:** Generating RSS content dynamically in React component.

**Why bad:** RSS readers expect static XML file at predictable URL (`/rss.xml`), dynamic generation doesn't work for RSS readers.

**Instead:** Generate RSS at build time as static file.

## Suggested Build Order

### Phase 1: Routing Foundation (No Blog Content Yet)

**Goal:** Introduce React Router without breaking existing functionality.

**Tasks:**
1. Install React Router: `npm install react-router-dom`
2. Create `RootLayout.jsx` with Navbar + Footer + Outlet
3. Create `PortfolioPage.jsx` by extracting existing `AppContent` from `App.jsx`
4. Update `App.jsx` to use `createBrowserRouter` with routes
5. Modify `Navbar.jsx` to use `<Link>` for blog (placeholder), keep anchors for portfolio
6. Test: Portfolio still works with anchor navigation

**Dependencies:** None - standalone changes

**Validation:** Navigate to `/` shows portfolio, anchor links work, theme persists

### Phase 2: Blog Structure (Placeholder Pages)

**Goal:** Create blog page components with placeholder content.

**Tasks:**
1. Create `pages/BlogIndexPage.jsx` with "Coming soon" message
2. Create `pages/BlogPostPage.jsx` with placeholder post
3. Add blog routes to router configuration
4. Add blog navigation link to Navbar
5. Test: Navigate to `/blog` and `/blog/test-post`

**Dependencies:** Phase 1 (routing foundation)

**Validation:** Blog URLs accessible, Navbar highlights correct section, theme works on blog pages

### Phase 3: Markdown Infrastructure

**Goal:** Enable markdown file processing at build time.

**Tasks:**
1. Install dependencies: `npm install gray-matter react-markdown react-syntax-highlighter`
2. Create `content/blog/` directory for markdown files
3. Create sample markdown post with frontmatter
4. Create `scripts/generateBlogManifest.js` script
5. Add `prebuild` script to `package.json`
6. Test: Build generates `blogManifest.json`

**Dependencies:** Phase 2 (blog pages exist to consume manifest)

**Validation:** Manifest generated with correct metadata, includes all markdown files

### Phase 4: Blog Index Implementation

**Goal:** Display list of blog posts with metadata.

**Tasks:**
1. Create `BlogPostCard.jsx` component for post previews
2. Update `BlogIndexPage.jsx` to import and map over manifest
3. Add blog-specific styles to SCSS
4. Add date formatting utility
5. Test: Blog index shows all posts from manifest

**Dependencies:** Phase 3 (manifest exists)

**Validation:** All posts listed, correct metadata displayed, cards styled consistently

### Phase 5: Blog Post Rendering

**Goal:** Render individual blog posts from markdown.

**Tasks:**
1. Update `BlogPostPage.jsx` to load markdown via dynamic import
2. Parse frontmatter with gray-matter
3. Render content with react-markdown
4. Add syntax highlighting for code blocks
5. Add image support (public folder path resolution)
6. Test: Navigate to post shows rendered content

**Dependencies:** Phase 3 (markdown files exist)

**Validation:** Markdown renders correctly, code highlighting works, images display, frontmatter shown

### Phase 6: RSS Feed Generation

**Goal:** Generate RSS feed at build time.

**Tasks:**
1. Install feed package: `npm install feed`
2. Create `scripts/generateRSS.js` script
3. Update `build` script in `package.json` to run RSS generation
4. Add RSS link to HTML `<head>` via vite-plugin-html
5. Test: Build produces `dist/rss.xml`

**Dependencies:** Phase 3 (manifest exists)

**Validation:** RSS XML valid, contains all posts, correct metadata

### Phase 7: Polish & Optimization

**Goal:** Improve UX and performance.

**Tasks:**
1. Add loading states for blog post page
2. Add 404 page for missing posts
3. Add "Back to blog" navigation
4. Add post tags/categories display (if in frontmatter)
5. Optimize markdown rendering with `useMemo`
6. Add meta tags for blog posts (SEO)
7. Test: Edge cases handled gracefully

**Dependencies:** Phase 5 (blog posts render)

**Validation:** No loading flickers, 404s handled, navigation intuitive, SEO tags present

## Deployment Considerations

### Server Configuration for BrowserRouter

**Issue:** BrowserRouter requires server to serve `index.html` for all routes (not just `/`).

**Why:** Direct navigation to `/blog/my-post` or page refresh hits server, which needs to serve React app (not 404).

**Solutions by Platform:**

**GitHub Pages:**
- Add `404.html` identical to `index.html` (GitHub Pages redirects 404 to 404.html)
- OR: Use HashRouter instead (URLs become `/#/blog/my-post`)

**Netlify/Vercel:**
- Add `_redirects` or `vercel.json` with SPA rewrite rule
- `/*  /index.html  200` (Netlify)
- `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` (Vercel)

**Apache:**
```apache
# .htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Component Dependencies Graph

```
App.jsx
  └─ ThemeProvider (unchanged)
      └─ RouterProvider (NEW)
          └─ RootLayout.jsx (NEW)
              ├─ Navbar.jsx (MODIFIED - add blog link)
              ├─ Outlet (routes render here)
              │   ├─ PortfolioPage.jsx (NEW - extracted from App)
              │   │   └─ All existing sections (unchanged)
              │   ├─ BlogIndexPage.jsx (NEW)
              │   │   └─ BlogPostCard.jsx (NEW) × N
              │   └─ BlogPostPage.jsx (NEW)
              │       └─ react-markdown (NEW dependency)
              └─ Footer.jsx (unchanged)
```

**Build-time scripts:**
- `generateBlogManifest.js` (NEW) → produces `blogManifest.json`
- `generateRSS.js` (NEW) → produces `rss.xml`

## Confidence Assessment

| Aspect | Level | Reasoning |
|--------|-------|-----------|
| React Router integration | HIGH | Official docs reviewed, straightforward migration path |
| Markdown processing | HIGH | Multiple proven libraries (gray-matter, react-markdown) with extensive usage |
| RSS generation | HIGH | Feed package is standard tool, pattern well-established |
| Build pipeline changes | HIGH | Vite's build hooks and pre/post scripts are standard features |
| Theme integration | HIGH | CSS custom properties and Context API work independently of routing |
| Existing code preservation | HIGH | Hybrid routing allows portfolio to remain unchanged |

## Sources

- [React Router v6+ Documentation](https://reactrouter.com/en/main/start/overview) - Routing patterns and integration
- [react-markdown GitHub](https://github.com/remarkjs/react-markdown) - Markdown rendering in React
- [gray-matter GitHub](https://github.com/jonschlinkert/gray-matter) - Frontmatter parsing
- [feed package GitHub](https://github.com/jpmonette/feed) - RSS/Atom feed generation
- [Vite Features Documentation](https://vite.dev/guide/features.html) - Static assets and import.meta.glob
- [vite-plugin-markdown GitHub](https://github.com/hmsk/vite-plugin-markdown) - Markdown import modes

---

*Architecture research completed: 2026-01-28*
