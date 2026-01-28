import { useParams, Link } from 'react-router-dom'
import BlogNavbar from '../components/BlogNavbar'

const BlogPost = () => {
  const { slug } = useParams()

  return (
    <>
      <BlogNavbar />
      <main className="blog-page">
        <div className="blog-container">
          <Link to="/blog" className="blog-back-link">
            &larr; Back to Blog
          </Link>
          <h1>Blog Post: {slug}</h1>
          <p className="blog-placeholder">
            This post doesn't exist yet. Content will be added in Phase 7-9.
          </p>
        </div>
      </main>
    </>
  )
}

export default BlogPost
