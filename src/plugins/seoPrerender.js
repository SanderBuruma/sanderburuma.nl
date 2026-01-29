import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Lightweight frontmatter parser (no dependencies)
 * Handles YAML-like syntax: strings, arrays (- item), dates
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    throw new Error('No frontmatter found (must be delimited by --- at start and end)');
  }

  const [, frontmatterText, body] = match;
  const frontmatter = {};
  const lines = frontmatterText.split('\n');

  let currentKey = null;
  let arrayItems = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) continue;

    // Array item (starts with -)
    if (trimmed.startsWith('-')) {
      const item = trimmed.slice(1).trim();
      arrayItems.push(item);
      continue;
    }

    // Key-value pair
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex !== -1) {
      // Save previous array if exists
      if (currentKey && arrayItems.length > 0) {
        frontmatter[currentKey] = arrayItems;
        arrayItems = [];
      }

      const key = trimmed.slice(0, colonIndex).trim();
      const value = trimmed.slice(colonIndex + 1).trim();

      currentKey = key;

      // If value is not empty, it's a simple key-value
      if (value) {
        frontmatter[key] = value;
        currentKey = null;
      }
      // Otherwise, next lines might be array items
    }
  }

  // Save final array if exists
  if (currentKey && arrayItems.length > 0) {
    frontmatter[currentKey] = arrayItems;
  }

  return { frontmatter, body: body.trim() };
}

/**
 * Validate required frontmatter fields
 */
function validateFrontmatter(frontmatter, filename) {
  const required = ['title', 'date', 'description', 'tags'];
  const missing = required.filter(field => !frontmatter[field]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required frontmatter fields in ${filename}: ${missing.join(', ')}\n` +
      `Required fields: ${required.join(', ')}`
    );
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(frontmatter.date)) {
    throw new Error(
      `Invalid date format in ${filename}: "${frontmatter.date}"\n` +
      `Expected format: YYYY-MM-DD`
    );
  }

  // Validate tags is an array
  if (!Array.isArray(frontmatter.tags)) {
    throw new Error(
      `Tags must be an array in ${filename}\n` +
      `Found: ${typeof frontmatter.tags}`
    );
  }
}

/**
 * Extract featured image from frontmatter or first image in content
 */
function extractFeaturedImage(frontmatter, content) {
  // Check frontmatter first
  if (frontmatter.image) {
    return frontmatter.image;
  }

  // Scan content for first image markdown: ![alt](url)
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  if (!match) return null;

  let imagePath = match[1];

  // Normalize relative paths to absolute paths
  // Convert ../../../public/images/... to /images/...
  if (imagePath.includes('../public/')) {
    imagePath = imagePath.replace(/.*\/public\//, '/');
  }
  // Convert ./images/... to /images/...
  if (imagePath.startsWith('./images/')) {
    imagePath = imagePath.replace('./', '/');
  }

  return imagePath;
}

/**
 * Process a single markdown file and extract metadata
 */
function processMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const slug = filename.replace(/\.md$/, '');

  const { frontmatter, body } = parseFrontmatter(content);
  validateFrontmatter(frontmatter, filename);

  const image = extractFeaturedImage(frontmatter, body);
  const author = frontmatter.author || 'Sander Buruma';

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    description: frontmatter.description,
    tags: frontmatter.tags,
    author,
    image
  };
}

/**
 * Escape special characters for regex
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Replace or add meta tag in HTML
 */
function replaceMetaTag(html, property, content) {
  const escapedProperty = escapeRegex(property);
  const pattern = new RegExp(`<meta property="${escapedProperty}" content="[^"]*">`, 'g');
  const replacement = `<meta property="${property}" content="${content}">`;

  if (html.match(pattern)) {
    return html.replace(pattern, replacement);
  } else {
    // If tag doesn't exist, add it before Twitter section
    const twitterComment = '<!-- Twitter -->';
    if (html.includes(twitterComment)) {
      return html.replace(twitterComment, `    ${replacement}\n\n    ${twitterComment}`);
    }
    return html;
  }
}

/**
 * Generate static HTML for a blog post
 */
function generatePostHtml(baseHtml, post) {
  let html = baseHtml;

  // Replace title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${post.title} | Sander Buruma</title>`);

  // Replace description meta
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${post.description}">`
  );

  // Replace OG tags
  html = replaceMetaTag(html, 'og:type', 'article');
  html = replaceMetaTag(html, 'og:url', `https://sanderburuma.nl/blog/${post.slug}`);
  html = replaceMetaTag(html, 'og:title', post.title);
  html = replaceMetaTag(html, 'og:description', post.description);

  const ogImage = post.image
    ? `https://sanderburuma.nl${post.image}`
    : 'https://sanderburuma.nl/images/og-default.svg';
  html = replaceMetaTag(html, 'og:image', ogImage);

  // Replace Twitter tags
  html = replaceMetaTag(html, 'twitter:url', `https://sanderburuma.nl/blog/${post.slug}`);
  html = replaceMetaTag(html, 'twitter:title', post.title);
  html = replaceMetaTag(html, 'twitter:description', post.description);
  html = replaceMetaTag(html, 'twitter:image', ogImage);

  // Add article-specific meta tags after og:locale (in minified HTML, comments are removed)
  const articleMetas = [
    `<meta property="article:published_time" content="${post.date}">`,
    `<meta property="article:author" content="${post.author}">`,
    ...post.tags.map(tag => `<meta property="article:tag" content="${tag}">`)
  ].join('');

  // Find the last og: property tag and insert article tags after it
  const ogLocalePattern = /<meta property="og:locale:alternate"[^>]*>/;
  const match = html.match(ogLocalePattern);
  if (match) {
    html = html.replace(ogLocalePattern, match[0] + articleMetas);
  }

  return html;
}

/**
 * Generate static HTML for blog index
 */
function generateBlogIndexHtml(baseHtml) {
  let html = baseHtml;

  // Replace title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>Tech Blog | Sander Buruma</title>`);

  // Replace description meta
  const description = 'Technical articles on software development, Python, blockchain, and web technologies by Sander Buruma.';
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${description}">`
  );

  // Replace OG tags
  html = replaceMetaTag(html, 'og:type', 'website');
  html = replaceMetaTag(html, 'og:url', 'https://sanderburuma.nl/blog');
  html = replaceMetaTag(html, 'og:title', 'Tech Blog | Sander Buruma');
  html = replaceMetaTag(html, 'og:description', description);
  html = replaceMetaTag(html, 'og:image', 'https://sanderburuma.nl/images/og-default.svg');

  // Replace Twitter tags
  html = replaceMetaTag(html, 'twitter:url', 'https://sanderburuma.nl/blog');
  html = replaceMetaTag(html, 'twitter:title', 'Tech Blog | Sander Buruma');
  html = replaceMetaTag(html, 'twitter:description', description);
  html = replaceMetaTag(html, 'twitter:image', 'https://sanderburuma.nl/images/og-default.svg');

  return html;
}

/**
 * Vite plugin for SEO prerendering
 */
export default function seoPrerender() {
  let config;

  return {
    name: 'seo-prerender',
    apply: 'build',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    closeBundle() {
      const distDir = config.build.outDir;
      const baseHtmlPath = path.join(distDir, 'index.html');

      if (!fs.existsSync(baseHtmlPath)) {
        console.warn('[seo-prerender] No index.html found in dist, skipping prerender');
        return;
      }

      const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');
      const blogDir = path.resolve(config.root, 'src/content/blog');

      if (!fs.existsSync(blogDir)) {
        console.warn('[seo-prerender] Blog directory does not exist, skipping prerender');
        return;
      }

      // Generate blog index page
      const blogIndexDir = path.join(distDir, 'blog');
      fs.mkdirSync(blogIndexDir, { recursive: true });
      const blogIndexHtml = generateBlogIndexHtml(baseHtml);
      fs.writeFileSync(path.join(blogIndexDir, 'index.html'), blogIndexHtml);
      console.log('[seo-prerender] Generated: dist/blog/index.html');

      // Generate individual post pages
      const markdownFiles = fs.readdirSync(blogDir)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(blogDir, file));

      for (const filePath of markdownFiles) {
        const post = processMarkdownFile(filePath);
        const postHtml = generatePostHtml(baseHtml, post);

        const postDir = path.join(distDir, 'blog', post.slug);
        fs.mkdirSync(postDir, { recursive: true });
        fs.writeFileSync(path.join(postDir, 'index.html'), postHtml);

        console.log(`[seo-prerender] Generated: dist/blog/${post.slug}/index.html`);
      }
    }
  };
}
