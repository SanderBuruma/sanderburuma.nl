import { Link } from 'react-router-dom'
import { FaSun, FaMoon } from 'react-icons/fa'
import { useTheme } from '../utils/hooks'

const BlogNavbar = () => {
  const { isDark, dispatch } = useTheme()

  return (
    <nav className="blog-navbar">
      <div className="blog-nav-container">
        <Link to="/" className="blog-nav-logo">
          <h2>Sander Buruma</h2>
        </Link>
        <div className="blog-nav-links">
          <Link to="/blog" className="blog-nav-link">Blog</Link>
          <Link to="/" className="blog-nav-link">Portfolio</Link>
        </div>
        <button
          className="theme-toggle"
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          aria-label="Toggle theme"
        >
          {isDark ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </nav>
  )
}

export default BlogNavbar
