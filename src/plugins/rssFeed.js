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
 * Convert YYYY-MM-DD date to RFC 822 format for RSS
 */
function toRFC822Date(dateString) {
  return new Date(dateString + 'T00:00:00Z').toUTCString();
}

/**
 * Process a single markdown file and extract RSS metadata
 */
function processMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const slug = filename.replace(/\.md$/, '');

  const { frontmatter } = parseFrontmatter(content);
  validateFrontmatter(frontmatter, filename);

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    description: frontmatter.description
  };
}

/**
 * Generate RSS 2.0 XML feed
 */
function generateRSSFeed(posts) {
  const baseUrl = 'https://sanderburuma.nl';
  const lastBuildDate = toRFC822Date(new Date().toISOString().split('T')[0]);

  const items = posts.map(post => {
    const link = `${baseUrl}/blog/${post.slug}`;
    const pubDate = toRFC822Date(post.date);

    return `    <item>
      <title>${post.title}</title>
      <link>${link}</link>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid>${link}</guid>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Tech Blog | Sander Buruma</title>
    <link>${baseUrl}/blog</link>
    <description>Technical articles on software development, Python, blockchain, and web technologies by Sander Buruma.</description>
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;
}

/**
 * Vite plugin for RSS feed generation
 */
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

      if (!fs.existsSync(blogDir)) {
        console.warn('[rss-feed] Blog directory does not exist, skipping RSS generation');
        return;
      }

      // Read all markdown files
      const markdownFiles = fs.readdirSync(blogDir)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(blogDir, file));

      // Process files and sort by date (newest first)
      const posts = markdownFiles
        .map(processMarkdownFile)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      // Generate RSS XML
      const rssXml = generateRSSFeed(posts);

      // Write RSS file to dist
      const rssPath = path.join(distDir, 'rss.xml');
      fs.writeFileSync(rssPath, rssXml, 'utf-8');

      console.log('[rss-feed] Generated: dist/rss.xml');
      console.log('[rss-feed] Validate at: https://validator.w3.org/feed/');
    }
  };
}
