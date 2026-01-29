import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import BlogNavbar from '../components/BlogNavbar'
import MarkdownRenderer from '../components/MarkdownRenderer'
import Blog404 from '../pages/Blog404'
import posts from 'virtual:blog-manifest'

const BlogPost = () => {
  const { slug } = useParams()
  const [imageError, setImageError] = useState(false)

  const post = posts.find(p => p.slug === slug)

  if (!post) {
    return <Blog404 />
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <>
      <BlogNavbar />
      <main className="blog-page">
        <article className="blog-post">
          <h1 className="blog-post-page-title">{post.title}</h1>

          <div className="blog-post-tags-row">
            {post.tags?.map(tag => (
              <Link key={tag} to="/blog" className="blog-post-tag-chip">
                {tag}
              </Link>
            ))}
          </div>

          <div className="blog-post-byline">
            {post.author && <span>{post.author}</span>}
            {post.author && <span className="blog-post-byline-sep">&middot;</span>}
            <span>{formattedDate}</span>
            {post.readingTime && (
              <>
                <span className="blog-post-byline-sep">&middot;</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>

          {post.image && !imageError && (
            <img
              src={post.image}
              alt={`Featured image for ${post.title}`}
              className="blog-post-featured-image"
              onError={() => setImageError(true)}
            />
          )}
          {post.image && imageError && (
            <div className="blog-post-image-placeholder">
              Featured image unavailable
            </div>
          )}

          <MarkdownRenderer content={post.content} />

          <Link to="/blog" className="blog-back-link">
            &larr; Back to Blog
          </Link>
        </article>
      </main>
    </>
  )
}

export default BlogPost
