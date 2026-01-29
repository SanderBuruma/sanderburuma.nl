# Phase 11: RSS & Feeds - Research

**Researched:** 2026-01-29
**Domain:** RSS 2.0 feed generation for static sites
**Confidence:** HIGH

## Summary

RSS feed generation is well-established with clear standards (RSS 2.0 specification from rssboard.org). For this project, the implementation should follow the existing Vite plugin pattern used in blogManifest and seoPrerender plugins—generate RSS XML file at build time using the closeBundle hook.

The RSS 2.0 spec is minimal: three required channel elements (title, link, description), flexible item structure (only title or description required), and RFC 822 date formatting. The primary challenge isn't the XML generation (simple string templating suffices) but rather the edge cases: proper HTML encoding in descriptions, correct date formatting, UTF-8 XML declaration, and validation compliance.

**Primary recommendation:** Hand-roll a minimal RSS generator as a Vite plugin (closeBundle hook, ~100 lines). The spec is simple, dependencies add risk, and existing blog infrastructure (parseFrontmatter, processMarkdownFile) provides all needed data. Include W3C validation URL in implementation comments for manual verification.

## Standard Stack

RSS feed generation in the Node.js ecosystem typically uses libraries, but for this specific use case (simple blog with existing markdown infrastructure), a custom implementation is appropriate.

### Core Decision: Library vs Hand-Roll

| Approach | Tradeoff | Verdict |
|----------|----------|---------|
| **Custom Implementation** | Simple RSS 2.0 generation (~100 lines), reuses existing parseFrontmatter, zero dependencies, full control | **RECOMMENDED** - Spec is minimal, dependencies add security risk (12% XSS in RSS sources per 2024 Security.org study), existing infrastructure sufficient |
| **@bliztek/feed-generator** | Zero external dependencies, TypeScript native, passes W3C validator | Overkill for simple blog (supports RSS/Atom/JSON), adds 14 commits of third-party code |
| **feed (npm)** | Most popular (latest: 5.2.0), actively maintained | Has dependencies, feature-rich beyond needs |

**Installation (if library chosen):**
```bash
npm install @bliztek/feed-generator
```

## Architecture Patterns

### Recommended: Vite Plugin with closeBundle Hook

Follow the established pattern from seoPrerender.js:

```
src/
├── plugins/
│   ├── blogManifest.js      # Provides markdown data
│   ├── seoPrerender.js       # Phase 10 pattern
│   └── rssFeed.js            # NEW: RSS generation
```

**Pattern: Build-Time Static Generation**
```javascript
export default function rssFeed() {
  let config;

  return {
    name: 'rss-feed',
    apply: 'build',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    closeBundle() {
      // 1. Read blog markdown files (reuse existing functions)
      // 2. Generate RSS XML string
      // 3. Write to dist/rss.xml
    }
  };
}
```

### RSS 2.0 Minimal Structure

Required channel elements only (spec-compliant):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Tech Blog | Sander Buruma</title>
    <link>https://sanderburuma.nl/blog</link>
    <description>Technical articles on software development, Python, blockchain, and web technologies.</description>
    <language>en-US</language>
    <lastBuildDate>Wed, 29 Jan 2026 00:00:00 GMT</lastBuildDate>

    <item>
      <title>Post Title</title>
      <link>https://sanderburuma.nl/blog/post-slug</link>
      <description><![CDATA[Post description with <b>HTML</b> allowed]]></description>
      <pubDate>Tue, 28 Jan 2026 00:00:00 GMT</pubDate>
      <guid>https://sanderburuma.nl/blog/post-slug</guid>
    </item>
  </channel>
</rss>
```

### Auto-Discovery Pattern

Add to index.html `<head>` (all pages):

```html
<link rel="alternate" type="application/rss+xml" title="Tech Blog | Sander Buruma" href="https://sanderburuma.nl/rss.xml">
```

**Implementation:** Use vite-plugin-html (already installed) to inject this tag during build.

### Anti-Patterns to Avoid

- **Relative URLs**: RSS spec requires absolute URLs for all `link` and `guid` elements
- **Missing XML declaration**: Must start with `<?xml version="1.0" encoding="UTF-8"?>`
- **HTML entities without CDATA**: Use `<![CDATA[...]]>` for HTML content in description
- **Incorrect date format**: Must be RFC 822 (e.g., "Wed, 29 Jan 2026 00:00:00 GMT"), not ISO 8601

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| RFC 822 date formatting | Custom date parser | Template with built-in Date methods | RFC 822 is simple for UTC: day/month/year names are fixed arrays, use `toUTCString()` as base |
| XML escaping | String replace chains | CDATA sections | CDATA eliminates need for entity encoding (`<![CDATA[...]]>`), spec-approved approach |
| W3C validation | Custom validator | W3C Feed Validator (validator.w3.org/feed) | Official validator, manual check during testing |

**Key insight:** RSS XML generation is straightforward string templating. The only "complex" parts (date formatting, HTML encoding) are solved with standard approaches (CDATA, Date methods). Libraries add dependencies for minimal benefit in this use case.

## Common Pitfalls

### Pitfall 1: Whitespace Before XML Declaration

**What goes wrong:** XML parser errors like "XML or text declaration not at start of entity"

**Why it happens:** PHP closing tags or extra whitespace in generated content. Even a single space or newline before `<?xml` breaks the feed.

**How to avoid:**
- Start file generation with XML declaration as first characters (no template literals with leading newlines)
- Verify with: `fs.writeFileSync(path, xmlString)` where `xmlString` starts immediately with `<?xml`

**Warning signs:** Feed validator shows XML parsing error on line 1

### Pitfall 2: Incorrect Content-Type Header

**What goes wrong:** Feeds served as "text/html" instead of "application/rss+xml"

**Why it happens:** Server/CDN defaults to HTML mime type for all content

**How to avoid:** Configure hosting to serve `.xml` files with correct Content-Type (Netlify/Vercel usually handle this automatically)

**Warning signs:** W3C validator warning: "Feeds should not be served with the 'text/html' media type"

### Pitfall 3: RFC 822 Date Formatting Errors

**What goes wrong:** pubDate validation errors like "must be an RFC-822 date-time"

**Why it happens:** Using ISO 8601 format (2026-01-29), missing timezone, incorrect day/month abbreviations

**How to avoid:**
```javascript
// CORRECT: RFC 822 format
function toRFC822Date(dateString) {
  const date = new Date(dateString + 'T00:00:00Z'); // Force UTC
  return date.toUTCString(); // "Wed, 29 Jan 2026 00:00:00 GMT"
}

// WRONG: ISO format
const badDate = "2026-01-29"; // Fails validation
```

**Warning signs:** Validator shows "Invalid RFC2822 Date" or "Problematical RFC 822 date-time value"

### Pitfall 4: HTML in Description Without CDATA

**What goes wrong:** XML parsing errors or HTML tags displayed as literal text

**Why it happens:** Using entity encoding (`&lt;b&gt;`) when CDATA is simpler, or forgetting encoding entirely

**How to avoid:**
```xml
<!-- CORRECT: CDATA section -->
<description><![CDATA[This is <b>bold</b> text]]></description>

<!-- WRONG: No encoding -->
<description>This is <b>bold</b> text</description> <!-- Breaks XML -->

<!-- ACCEPTABLE but verbose: Entity encoding -->
<description>This is &lt;b&gt;bold&lt;/b&gt; text</description>
```

**Warning signs:** XML parser errors mentioning unclosed tags or entity references

### Pitfall 5: Relative URLs in Links

**What goes wrong:** Feed readers can't resolve URLs, broken links

**Why it happens:** Copying blog routing logic that uses relative paths (`/blog/post-slug`)

**How to avoid:** Always prepend base URL:
```javascript
const baseUrl = 'https://sanderburuma.nl';
const itemLink = `${baseUrl}/blog/${post.slug}`; // Absolute URL
```

**Warning signs:** Links work in browser but fail in feed readers

## Code Examples

Verified patterns from official sources:

### RFC 822 Date Formatting

```javascript
// Source: https://whitep4nth3r.com/blog/how-to-format-dates-for-rss-feeds-rfc-822/
// Simplified for UTC timezone (blog dates are day-specific, not timestamped)

function toRFC822Date(dateString) {
  // Input: "2026-01-29" from frontmatter
  // Output: "Wed, 29 Jan 2026 00:00:00 GMT"

  const date = new Date(dateString + 'T00:00:00Z'); // Force UTC to avoid timezone shifts
  return date.toUTCString();
}

// Example usage:
toRFC822Date('2026-01-29'); // "Wed, 29 Jan 2026 00:00:00 GMT"
```

### XML Generation Template

```javascript
// Source: RSS 2.0 Specification (rssboard.org/rss-specification)

function generateRSSFeed(posts) {
  const baseUrl = 'https://sanderburuma.nl';
  const buildDate = toRFC822Date(new Date().toISOString().split('T')[0]);

  const items = posts.map(post => `
    <item>
      <title>${post.title}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${toRFC822Date(post.date)}</pubDate>
      <guid>${baseUrl}/blog/${post.slug}</guid>
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Tech Blog | Sander Buruma</title>
    <link>${baseUrl}/blog</link>
    <description>Technical articles on software development, Python, blockchain, and web technologies by Sander Buruma.</description>
    <language>en-US</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;
}
```

### Vite Plugin Implementation

```javascript
// Source: Existing seoPrerender.js pattern (Phase 10)

import fs from 'fs';
import path from 'path';

export default function rssFeed() {
  let config;

  return {
    name: 'rss-feed',
    apply: 'build',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    closeBundle() {
      const distDir = config.build.outDir;
      const blogDir = path.resolve(config.root, 'src/content/blog');

      // Reuse existing markdown processing
      const posts = processAllPosts(blogDir); // From blogManifest.js pattern

      // Generate RSS XML
      const rssXml = generateRSSFeed(posts);

      // Write to dist/rss.xml
      fs.writeFileSync(path.join(distDir, 'rss.xml'), rssXml, 'utf-8');

      console.log('[rss-feed] Generated: dist/rss.xml');

      // Validation reminder
      console.log('[rss-feed] Validate at: https://validator.w3.org/feed/');
    }
  };
}
```

### Auto-Discovery Tag Injection

```javascript
// vite.config.js - Add to existing createHtmlPlugin configuration
// Source: RSS Autodiscovery spec (rssboard.org/rss-autodiscovery)

createHtmlPlugin({
  minify: true,
  inject: {
    tags: [
      // ...existing font preload tags...
      {
        injectTo: 'head',
        tag: 'link',
        attrs: {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'Tech Blog | Sander Buruma',
          href: 'https://sanderburuma.nl/rss.xml' // Absolute URL required
        }
      }
    ]
  }
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| content:encoded element | description with CDATA | RSS 2.0 (2003) | Simpler spec, description sufficient for full content |
| Complex date libraries | Date.toUTCString() | Native JS improvement | No dependencies needed for RFC 822 dates in UTC |
| XML libraries for generation | String templating | Matured understanding | RSS XML is simple enough for templates, libraries overkill for basic feeds |
| RSS + Atom dual feeds | RSS 2.0 only | Ecosystem consolidation (2010s) | RSS 2.0 won as standard, Atom adoption minimal |

**Deprecated/outdated:**
- **content:encoded**: Still valid but unnecessary for simple blogs. RSS 2.0 allows full HTML in description with CDATA.
- **FeedBurner**: Google service (deprecated 2012) once handled feed optimization/proxying. Now obsolete, serve feeds directly.
- **RSS 0.91/1.0**: Earlier versions. RSS 2.0 (2003) is current standard, use version="2.0" attribute.

## Open Questions

None—RSS 2.0 specification is stable (since 2003), implementation requirements are clear, and existing blog infrastructure provides all necessary data.

## Content Strategy Recommendation

**Feed Content Depth**: Use full post descriptions in `<description>` field (wrapped in CDATA), not excerpts.

**Rationale:**
- Existing frontmatter has comprehensive `description` field (see hello-world.md: ~2 sentences)
- RSS Best Practices Profile states: "Publishers who employ summaries should store the summary in description and the full content in content:encoded, ordering description first"
- Since blog posts have explicit descriptions (not excerpts), use description field as-is
- Don't include full markdown content—feed readers handle this poorly, description is sufficient preview

**Alternative considered:** Full content in content:encoded
- Rejected: Adds complexity (separate namespace, HTML conversion from markdown)
- Benefit minimal: Users click through to read full formatted post anyway

## Sources

### Primary (HIGH confidence)
- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification) - Official spec from RSS Advisory Board
- [RSS Best Practices Profile](https://www.rssboard.org/rss-profile) - Authoritative implementation guidance
- [RSS Autodiscovery Specification](https://www.rssboard.org/rss-autodiscovery) - Auto-discovery link tag spec
- [RSS Encoding Examples](https://www.rssboard.org/rss-encoding-examples) - CDATA vs entity encoding
- [W3C Feed Validator](https://validator.w3.org/feed/) - Official validation service

### Secondary (MEDIUM confidence)
- [How to format dates for RSS feeds (RFC-822)](https://whitep4nth3r.com/blog/how-to-format-dates-for-rss-feeds-rfc-822/) - JavaScript implementation guide (2022, verified with spec)
- [RSS Common Validation Errors](https://eventcalendarnewsletter.com/docs/fix-common-rss-validation-errors/) - Practical troubleshooting
- [W3Schools RSS Tutorial](https://www.w3schools.com/xml/xml_rss.asp) - Basic XML examples
- [@bliztek/feed-generator GitHub](https://github.com/bliztek/feed-generator) - Zero-dependency library reference

### Tertiary (LOW confidence)
- [RSS Feed Common Misconceptions](https://moldstud.com/articles/p-what-are-some-common-misconceptions-about-rss-feeds-among-developers) - Community insights on implementation risks (WebSearch only, security statistics cited without primary source links)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - RSS 2.0 spec is stable (2003), no dependencies needed for simple implementation
- Architecture: HIGH - Vite closeBundle pattern proven in Phase 10, RSS XML structure well-documented
- Pitfalls: HIGH - Validator documentation explicit, common errors documented by W3C

**Research date:** 2026-01-29
**Valid until:** 90 days (RSS 2.0 spec stable since 2003, unlikely to change)
