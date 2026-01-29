import { Link } from 'react-router-dom'

const BlogPostCard = ({ post, activeTags = [], onTagClick }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className="blog-post-card">
      {post.image && (
        <div className="blog-post-image">
          <img src={post.image} alt={post.title} />
        </div>
      )}
      <div className="blog-post-content">
        <Link to={`/blog/${post.slug}`} className="blog-post-title-link">
          <h2 className="blog-post-title">{post.title}</h2>
        </Link>
        <div className="blog-post-meta">
          <span className="blog-post-date">{formatDate(post.date)}</span>
          <span className="blog-post-reading-time">{post.readingTime} min read</span>
        </div>
        <p className="blog-post-description">{post.description}</p>
        <div className="blog-post-tags">
          {post.tags.map((tag) => (
            <button
              key={tag}
              className={`tag-chip ${activeTags.includes(tag) ? 'active' : ''}`}
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}

export default BlogPostCard
