import { FaGithub, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; 2025 Sander Buruma. All rights reserved.</p>
          <div className="social-links">
            <a
              href="https://github.com/sanderburuma"
              target="_blank"
              rel="noopener"
              className="social-link"
              aria-label="GitHub Profile"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/sander-buruma-729a84235"
              target="_blank"
              rel="noopener"
              className="social-link"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
