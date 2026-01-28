# Technology Stack - Blog Addition

**Project:** sanderburuma.nl
**Researched:** 2026-01-28
**Confidence:** HIGH

## Executive Summary

Adding Markdown blog capability to existing React 19 + Vite 7 portfolio requires only 5 core libraries. Stack chosen prioritizes **build-time processing** over runtime overhead, **native Vite features** over plugins where possible, and **proven stability** over bleeding-edge alternatives. All libraries integrate cleanly with existing setup without requiring architectural changes.

## Existing Stack (No Changes)

| Technology | Version | Notes |
|------------|---------|-------|
| React | 19.2.3 | Functional components, no routing currently |
| Vite | 7.3.0 | Build system with custom CSS inlining plugin |
| SCSS | 1.97.1 | Styling preprocessor |
| @vitejs/plugin-react | 5.1.2 | JSX/React transform |

## Required Additions

### Core Routing
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **react-router** | ^7.13.0 | SPA routing | **Use `react-router` not `react-router-dom`** - v7 consolidated packages. Provides `/blog` and `/blog/:slug` routes. Declarative routing mode for traditional SPA (not framework mode). |

**Installation:**
```bash
npm install react-router
```

**Why not framework mode?** React Router v7 offers framework mode (SSR, loaders, etc.), but this adds unnecessary complexity for a static blog. Use traditional declarative routing (`<BrowserRouter>`, `<Routes>`, `<Route>`).

**Integration:** Import from `react-router`, not `react-router-dom`. The latter is now just a re-export for compatibility.

---

### Markdown Parsing
| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| **react-markdown** | ^10.1.0 | Runtime markdown renderer | Industry standard (4566 dependents). Safe by default (no dangerouslySetInnerHTML). Works with unified/remark/rehype ecosystem. ESM-only. |
| **remark-gfm** | ^4.0.1 | GitHub Flavored Markdown | Adds tables, strikethrough, task lists, autolinks. Essential for modern markdown. |
| **gray-matter** | ^4.0.3 | Frontmatter parser | Battle-tested (used by Gatsby, Astro, VitePress). Parses YAML frontmatter into JS objects. |

**Installation:**
```bash
npm install react-markdown remark-gfm gray-matter
```

**Why not a Vite plugin for markdown?** Three options exist:
1. **Vite plugin** (e.g., `vite-plugin-markdown`) - Pre-processes at build time but ties you to specific output formats
2. **Raw imports with custom plugin** - Lightweight but requires manual parsing
3. **Runtime processing** (chosen) - Use Vite's native `import.meta.glob` to load raw markdown, then parse with `gray-matter` and render with `react-markdown`

**Decision:** Runtime processing via `import.meta.glob` + `gray-matter` + `react-markdown`. This approach:
- Uses native Vite features (no extra plugins)
- Keeps markdown source-of-truth in repo
- Allows dynamic filtering/sorting in React
- Separates concerns (Vite loads files, React processes content)

**Implementation pattern:**
```javascript
// Load all markdown files at build time
const posts = import.meta.glob('./content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

// In React component, parse with gray-matter
Object.entries(posts).map(([path, content]) => {
  const { data: frontmatter, content: markdown } = matter(content);
  // frontmatter: { title, date, description, tags, author, image }
  // markdown: string content to pass to <ReactMarkdown>
});
```

---

### Syntax Highlighting (Optional but Recommended)
| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| **react-syntax-highlighter** | ^15.6.1 | Code block highlighting | Runtime highlighting via custom component. Supports both Prism and Highlight.js. No bundle size bloat from rehype-prism (which includes ALL languages). |

**Installation:**
```bash
npm install react-syntax-highlighter
npm install --save-dev @types/react-syntax-highlighter  # If using TypeScript
```

**Why not rehype-prism?** Three options compared:
1. **rehype-prism** - Includes all languages via refractor, massive bundle size for browser
2. **rehype-highlight** - Uses lowlight (highlight.js), still large
3. **react-syntax-highlighter** (chosen) - Runtime component, tree-shakeable, only loads needed languages

**Decision:** `react-syntax-highlighter` with Prism. Pass as custom `code` component to `react-markdown`:

```javascript
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

<ReactMarkdown
  components={{
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div">
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  }}
  remarkPlugins={[remarkGfm]}
>
  {markdown}
</ReactMarkdown>
```

---

### RSS Feed Generation
| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| **feed** | ^5.1.0 | RSS/Atom/JSON feed generator | Modern (TypeScript, 198 dependents). Generates RSS 2.0, Atom 1.0, JSON Feed. Actively maintained. |

**Installation:**
```bash
npm install feed
```

**Why not vite-plugin-rss?** Two approaches compared:
1. **vite-plugin-rss** - Vite plugin approach, but requires 'define' or 'meta' mode configuration
2. **feed** + custom build script (chosen) - More control, standard Node.js library, no Vite coupling

**Decision:** Use `feed` library with a custom Node.js build script. RSS generation happens at build time:

**Implementation:**
Create `scripts/generate-rss.js`:
```javascript
import fs from 'fs';
import { Feed } from 'feed';
import matter from 'gray-matter';

const posts = fs.readdirSync('./src/content/blog')
  .map(file => {
    const content = fs.readFileSync(`./src/content/blog/${file}`, 'utf8');
    const { data, content: markdown } = matter(content);
    return { ...data, slug: file.replace('.md', '') };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const feed = new Feed({
  title: "Sander Buruma's Blog",
  description: "Software development insights and projects",
  id: "https://sanderburuma.nl/",
  link: "https://sanderburuma.nl/",
  language: "en",
  image: "https://sanderburuma.nl/og-image.png",
  favicon: "https://sanderburuma.nl/favicon.ico",
  copyright: "All rights reserved 2026, Sander Buruma",
  feedLinks: {
    json: "https://sanderburuma.nl/feed.json",
    atom: "https://sanderburuma.nl/atom.xml"
  },
  author: {
    name: "Sander Buruma",
    link: "https://sanderburuma.nl"
  }
});

posts.forEach(post => {
  feed.addItem({
    title: post.title,
    id: `https://sanderburuma.nl/blog/${post.slug}`,
    link: `https://sanderburuma.nl/blog/${post.slug}`,
    description: post.description,
    content: post.description, // or render markdown to HTML
    date: new Date(post.date),
    image: post.image ? `https://sanderburuma.nl${post.image}` : undefined
  });
});

fs.mkdirSync('./dist', { recursive: true });
fs.writeFileSync('./dist/rss.xml', feed.rss2());
fs.writeFileSync('./dist/atom.xml', feed.atom1());
fs.writeFileSync('./dist/feed.json', feed.json1());
```

**Update `package.json`:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/generate-rss.js",
    "preview": "vite preview"
  }
}
```

**Why this approach?**
- Runs after `vite build` completes
- Generates RSS to `dist/` alongside build output
- No Vite plugin complexity
- Standard Node.js code
- Can be tested independently

---

### Image Handling (Already Solved)

**No additional libraries needed.** Vite already handles static assets:

1. **Blog post images in `/public`:**
   - Store in `/public/blog/images/`
   - Reference in frontmatter: `image: /blog/images/post-cover.jpg`
   - Vite copies to dist root, available at `/blog/images/post-cover.jpg`

2. **Imported images in components:**
   - Store in `/src/assets/blog/`
   - Import in React: `import img from '@/assets/blog/image.jpg'`
   - Vite optimizes and hashes filename

**Recommendation:** Use `/public` for markdown-referenced images. Simpler paths in frontmatter, no import statements needed.

---

## What NOT to Add

| Library | Why Not |
|---------|---------|
| **react-router-dom** | Deprecated in v7. Use `react-router` instead. |
| **vite-plugin-markdown** | Over-engineered. Native `import.meta.glob` + `gray-matter` is simpler. |
| **rehype-prism / rehype-highlight** | Bloats bundle with all languages. `react-syntax-highlighter` is tree-shakeable. |
| **vite-plugin-rss** | Adds Vite coupling. Standard Node.js script with `feed` is more portable. |
| **MDX** | Overkill. Not using React components inside markdown. |
| **VitePress / vite-ssg** | Full static site generators. This is a portfolio site adding a blog section, not a docs site. |
| **Unified/remark/rehype directly** | `react-markdown` abstracts this. No need to build custom pipeline. |

---

## Installation Summary

```bash
# Core routing
npm install react-router

# Markdown parsing
npm install react-markdown remark-gfm gray-matter

# Syntax highlighting (optional)
npm install react-syntax-highlighter

# RSS generation
npm install feed
```

**TypeScript users add:**
```bash
npm install --save-dev @types/react-syntax-highlighter
```

---

## Integration with Existing Vite Config

**No changes required** to `vite.config.js`. All markdown loading uses native Vite features:

```javascript
// Existing config continues to work
export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin(/* ... */),
    // Custom inline-css plugin
  ],
  build: { /* existing rollup config */ },
  css: { /* existing SCSS config */ }
});
```

**Key point:** `import.meta.glob` is a built-in Vite feature. No plugin needed.

---

## Version Verification

| Library | Version | Last Updated | Source |
|---------|---------|--------------|--------|
| react-router | 7.13.0 | Jan 2026 | [Changelog](https://reactrouter.com/changelog) |
| react-markdown | 10.1.0 | Mar 2025 | [npm](https://www.npmjs.com/package/react-markdown) |
| remark-gfm | 4.0.1 | ~1 year ago | [GitHub Releases](https://github.com/remarkjs/remark-gfm/releases) |
| gray-matter | 4.0.3 | Battle-tested | [npm](https://www.npmjs.com/package/gray-matter) |
| react-syntax-highlighter | 15.6.1 | Maintained | [npm](https://www.npmjs.com/package/react-syntax-highlighter) |
| feed | 5.1.0 | 7 months ago | [npm](https://www.npmjs.com/package/feed) |

**Confidence Level:** HIGH - All libraries verified via WebSearch of official sources and npm registry data from 2026.

---

## Sources

### Routing
- [React Router Official Documentation](https://reactrouter.com/)
- [React Router v7 | Remix](https://remix.run/blog/react-router-v7)
- [How to use React Router v7 in React apps - LogRocket Blog](https://blog.logrocket.com/react-router-v7-guide/)
- [React Router 7 vs. 6: What's New and Should You Upgrade? | Medium](https://medium.com/@ignatovich.dm/react-router-7-vs-6-whats-new-and-should-you-upgrade-93bba58576a8)
- [React Router vs. React Router DOM: Understanding the Differences in 2025 | Syncfusion](https://www.syncfusion.com/blogs/post/react-router-vs-react-router-dom)

### Markdown Processing
- [React Markdown Complete Guide 2025: Security & Styling Tips - Strapi](https://strapi.io/blog/react-markdown-complete-guide-security-styling)
- [GitHub - remarkjs/react-markdown](https://github.com/remarkjs/react-markdown)
- [react-markdown Official Docs](https://remarkjs.github.io/react-markdown/)
- [How To Get Markdown Text from a Vite Glob Import](https://aaronhubbard.dev/blogposts/text-from-module)
- [Features | Vite](https://vite.dev/guide/features)
- [gray-matter - npm](https://www.npmjs.com/package/gray-matter)
- [GitHub - remarkjs/remark-gfm](https://github.com/remarkjs/remark-gfm)

### Vite Plugin Alternatives (Researched but Not Recommended)
- [GitHub - hmsk/vite-plugin-markdown](https://github.com/hmsk/vite-plugin-markdown)
- [How to load and render Markdown files into your Vite React app - DEV](https://dev.to/onticdani/how-to-load-and-render-markdown-files-into-your-vite-react-app-using-typescript-26jm)

### Syntax Highlighting
- [Enhancing Your React-Markdown Experience with Syntax Highlighting - Hannad Rehman](https://hannadrehman.com/blog/enhancing-your-react-markdown-experience-with-syntax-highlighting)
- [GitHub - react-syntax-highlighter/react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- [react-syntax-highlighter - npm](https://www.npmjs.com/package/react-syntax-highlighter)
- [rehype-prism vs rehype-highlight Discussion](https://github.com/rehypejs/rehype/discussions/43)
- [Syntax highlighting | MDX](https://mdxjs.com/guides/syntax-highlighting/)

### RSS Generation
- [GitHub - jpmonette/feed](https://github.com/jpmonette/feed)
- [feed - npm](https://www.npmjs.com/package/feed)
- [GitHub - enochchau/vite-plugin-rss](https://github.com/enochchau/vite-plugin-rss)
- [Generating an RSS feed with VitePress | Paul Laros](https://laros.io/generating-an-rss-feed-with-vitepress)
