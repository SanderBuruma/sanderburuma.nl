import { useEffect } from 'react'

/**
 * SEOHead - Dynamic meta tag management for SEO and social sharing
 *
 * Updates document head with page-specific metadata for search engines
 * and social media platforms (Open Graph, Twitter Card, JSON-LD).
 *
 * @param {Object} props
 * @param {string} props.title - Page title (appears in browser tab and search results)
 * @param {string} props.description - Meta description (~155 chars max)
 * @param {string} props.url - Canonical URL (full URL with https://sanderburuma.nl)
 * @param {string} [props.image] - OG image URL (defaults to fallback if not provided)
 * @param {string} [props.type='website'] - OG type: 'website' or 'article'
 * @param {Object} [props.article] - For blog posts: { author, publishedTime, tags }
 */
const SEOHead = ({ title, description, url, image, type = 'website', article }) => {
  useEffect(() => {
    // Store original meta tags for cleanup
    const originalTitle = document.title
    const originalMeta = {
      description: getMetaContent('name', 'description'),
      robots: getMetaContent('name', 'robots'),
      'og:title': getMetaContent('property', 'og:title'),
      'og:description': getMetaContent('property', 'og:description'),
      'og:url': getMetaContent('property', 'og:url'),
      'og:image': getMetaContent('property', 'og:image'),
      'og:type': getMetaContent('property', 'og:type'),
      'og:site_name': getMetaContent('property', 'og:site_name'),
      'twitter:card': getMetaContent('property', 'twitter:card'),
      'twitter:title': getMetaContent('property', 'twitter:title'),
      'twitter:description': getMetaContent('property', 'twitter:description'),
      'twitter:image': getMetaContent('property', 'twitter:image')
    }
    const originalCanonical = getLinkHref('canonical')

    // Update document title
    document.title = `${title} | Sander Buruma`

    // Basic meta tags
    setMetaTag('description', description)
    setMetaTag('robots', 'index, follow')

    // Prepare image URL (prepend domain if relative path, or use fallback)
    const baseUrl = 'https://sanderburuma.nl'
    let imageUrl = image
    if (!imageUrl) {
      imageUrl = '/images/og-default.svg'
    }
    if (imageUrl.startsWith('/')) {
      imageUrl = `${baseUrl}${imageUrl}`
    }

    // Open Graph tags
    setMetaProperty('og:title', title)
    setMetaProperty('og:description', description)
    setMetaProperty('og:url', url)
    setMetaProperty('og:image', imageUrl)
    setMetaProperty('og:type', type)
    setMetaProperty('og:site_name', 'Sander Buruma')

    // Twitter Card tags
    setMetaProperty('twitter:card', 'summary_large_image')
    setMetaProperty('twitter:title', title)
    setMetaProperty('twitter:description', description)
    setMetaProperty('twitter:image', imageUrl)

    // Canonical link
    setLinkTag('canonical', url)

    // Article-specific tags
    if (type === 'article' && article) {
      if (article.author) {
        setMetaProperty('og:article:author', article.author)
      }
      if (article.publishedTime) {
        setMetaProperty('og:article:published_time', article.publishedTime)
      }
      if (article.tags && Array.isArray(article.tags)) {
        // Remove existing article:tag tags
        const existingTags = document.querySelectorAll('meta[property="og:article:tag"]')
        existingTags.forEach(tag => tag.remove())

        // Add new tags
        article.tags.forEach(tag => {
          setMetaProperty('og:article:tag', tag)
        })
      }

      // JSON-LD structured data for articles
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: imageUrl,
        datePublished: article.publishedTime,
        author: {
          '@type': 'Person',
          name: article.author || 'Sander Buruma'
        }
      }
      setJsonLd(jsonLd)
    } else {
      // Clean up article-specific tags if switching from article to website
      const articleTags = document.querySelectorAll('meta[property^="og:article:"]')
      articleTags.forEach(tag => tag.remove())

      // Remove JSON-LD article structured data
      const jsonLdScript = document.querySelector('script[data-seo-jsonld]')
      if (jsonLdScript) {
        jsonLdScript.remove()
      }
    }

    // Cleanup function to restore original tags
    return () => {
      document.title = originalTitle

      if (originalMeta.description) setMetaTag('description', originalMeta.description)
      if (originalMeta.robots) setMetaTag('robots', originalMeta.robots)

      if (originalMeta['og:title']) setMetaProperty('og:title', originalMeta['og:title'])
      if (originalMeta['og:description']) setMetaProperty('og:description', originalMeta['og:description'])
      if (originalMeta['og:url']) setMetaProperty('og:url', originalMeta['og:url'])
      if (originalMeta['og:image']) setMetaProperty('og:image', originalMeta['og:image'])
      if (originalMeta['og:type']) setMetaProperty('og:type', originalMeta['og:type'])
      if (originalMeta['og:site_name']) setMetaProperty('og:site_name', originalMeta['og:site_name'])

      if (originalMeta['twitter:card']) setMetaProperty('twitter:card', originalMeta['twitter:card'])
      if (originalMeta['twitter:title']) setMetaProperty('twitter:title', originalMeta['twitter:title'])
      if (originalMeta['twitter:description']) setMetaProperty('twitter:description', originalMeta['twitter:description'])
      if (originalMeta['twitter:image']) setMetaProperty('twitter:image', originalMeta['twitter:image'])

      if (originalCanonical) setLinkTag('canonical', originalCanonical)

      // Clean up any added article tags
      const articleTags = document.querySelectorAll('meta[property^="og:article:"]')
      articleTags.forEach(tag => tag.remove())

      const jsonLdScript = document.querySelector('script[data-seo-jsonld]')
      if (jsonLdScript) {
        jsonLdScript.remove()
      }
    }
  }, [title, description, url, image, type, article])

  // SEOHead doesn't render anything - it only updates document head
  return null
}

// Helper functions

/**
 * Get content of a meta tag by name or property
 */
function getMetaContent(attr, value) {
  const meta = document.querySelector(`meta[${attr}="${value}"]`)
  return meta ? meta.getAttribute('content') : null
}

/**
 * Get href of a link tag by rel
 */
function getLinkHref(rel) {
  const link = document.querySelector(`link[rel="${rel}"]`)
  return link ? link.getAttribute('href') : null
}

/**
 * Set or create a meta tag by name attribute
 */
function setMetaTag(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

/**
 * Set or create a meta tag by property attribute
 */
function setMetaProperty(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

/**
 * Set or create a link tag by rel attribute
 */
function setLinkTag(rel, href) {
  let link = document.querySelector(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

/**
 * Set or create JSON-LD structured data script
 */
function setJsonLd(data) {
  let script = document.querySelector('script[data-seo-jsonld]')
  if (!script) {
    script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    script.setAttribute('data-seo-jsonld', 'true')
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

export default SEOHead
