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
 * Calculate reading time from content (~200 words per minute)
 */
function calculateReadingTime(content) {
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return minutes;
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
  return match ? match[1] : null;
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

  const readingTime = calculateReadingTime(body);
  const image = extractFeaturedImage(frontmatter, body);
  const author = frontmatter.author || 'Sander Buruma';

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    description: frontmatter.description,
    tags: frontmatter.tags,
    author,
    readingTime,
    image,
    content: body // Include full markdown content for Phase 9 rendering
  };
}

/**
 * Discover and process all markdown files in blog directory
 */
function generateBlogManifest(blogDir) {
  if (!fs.existsSync(blogDir)) {
    console.warn(`Blog directory does not exist: ${blogDir}`);
    return [];
  }

  const files = fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(blogDir, file));

  const posts = files.map(processMarkdownFile);

  // Sort by date, newest first
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return posts;
}

/**
 * Vite plugin for blog manifest generation
 */
export default function blogManifest() {
  const virtualModuleId = 'virtual:blog-manifest';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  let blogDir;

  return {
    name: 'blog-manifest',

    configResolved(config) {
      // Resolve blog directory relative to project root
      blogDir = path.resolve(config.root, 'src/content/blog');
    },

    buildStart() {
      // Validate all markdown files at build start (ensures validation runs even if virtual module not imported)
      generateBlogManifest(blogDir);
    },

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        const manifest = generateBlogManifest(blogDir);
        return `export default ${JSON.stringify(manifest, null, 2)}`;
      }
    },

    handleHotUpdate({ file, server }) {
      // Regenerate manifest when markdown files change in dev mode
      if (file.startsWith(blogDir) && file.endsWith('.md')) {
        const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
        if (module) {
          server.moduleGraph.invalidateModule(module);
          server.ws.send({
            type: 'full-reload',
            path: '*'
          });
        }
      }
    }
  };
}
