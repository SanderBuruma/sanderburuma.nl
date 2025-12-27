import { useState, useEffect } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'
import { useTheme } from '../utils/hooks'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isDark, dispatch } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navStyle = {
    background: isDark
      ? (scrolled ? 'rgba(15, 23, 42, 0.98)' : 'rgba(15, 23, 42, 0.95)')
      : (scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)'),
    backdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)'
  }

  return (
    <nav className="navbar" style={navStyle}>
      <div className="nav-container">
        <div className="nav-logo">
          <h2>Sander Buruma</h2>
        </div>
        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          {['Home', 'About', 'Experience', 'Projects', 'Minesweeper', 'Snake', 'Contact'].map(item => (
            <li key={item} className="nav-item">
              <a
                href={`#${item.toLowerCase()}`}
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <button
          className={`nav-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
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

export default Navbar
