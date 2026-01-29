import { useState, useMemo } from 'react'
import BlogNavbar from '../components/BlogNavbar'
import BlogPostCard from '../components/BlogPostCard'
import TagFilter from '../components/TagFilter'
import Pagination from '../components/Pagination'
import SEOHead from '../components/SEOHead'
import posts from 'virtual:blog-manifest'

const POSTS_PER_PAGE = 10

const BlogIndex = () => {
  const [activeTags, setActiveTags] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  // Derive all unique tags from all posts, sorted alphabetically
  const allTags = useMemo(() => {
    const tagSet = new Set()
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [])

  // Filter posts based on active tags (AND logic)
  const filteredPosts = useMemo(() => {
    if (activeTags.length === 0) return posts
    return posts.filter(post =>
      activeTags.every(tag => post.tags.includes(tag))
    )
  }, [activeTags])

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  // Get posts for current page
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)
  }, [filteredPosts, currentPage])

  // Handler to toggle tag filter
  const toggleTag = (tag) => {
    setActiveTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag)
      } else {
        return [...prev, tag]
      }
    })
    setCurrentPage(1) // Reset to page 1 when filters change
  }

  // Handler to clear all filters
  const clearTags = () => {
    setActiveTags([])
    setCurrentPage(1)
  }

  // Handler for page changes
  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <SEOHead
        title="Tech Blog"
        description="Thoughts on web development, software engineering, and building modern applications. Technical articles and insights from Sander Buruma."
        url="https://sanderburuma.nl/blog"
        type="website"
      />
      <BlogNavbar />
      <main className="blog-page">
        <div className="blog-container">
          <header className="blog-header">
            <h1>Blog</h1>
            <p className="blog-subtitle">Thoughts on software development, web technologies, and more.</p>
          </header>

          {posts.length === 0 ? (
            <div className="blog-empty-state">
              <p>Coming soon! Check back later for blog posts.</p>
            </div>
          ) : (
            <>
              <TagFilter
                allTags={allTags}
                activeTags={activeTags}
                onTagClick={toggleTag}
                onClear={clearTags}
              />

              {filteredPosts.length === 0 ? (
                <div className="blog-empty-state">
                  <p>No posts found for these tags.</p>
                  <button className="clear-filters-btn" onClick={clearTags}>
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="blog-post-list">
                    {paginatedPosts.map(post => (
                      <BlogPostCard
                        key={post.slug}
                        post={post}
                        activeTags={activeTags}
                        onTagClick={toggleTag}
                      />
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}

export default BlogIndex
