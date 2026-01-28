import { Link } from 'react-router-dom'
import BlogNavbar from '../components/BlogNavbar'

const Blog404 = () => {
  return (
    <>
      <BlogNavbar />
      <main className="blog-page blog-404">
        <div className="blog-container">
          <h1>Oops!</h1>
          <p>That post doesn't exist. Maybe it was moved, or maybe you made a typo.</p>
          <Link to="/blog" className="blog-404-link">
            &larr; Head back to the blog
          </Link>
        </div>
      </main>
    </>
  )
}

export default Blog404
