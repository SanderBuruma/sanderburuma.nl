import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiSignal } from 'react-icons/si'

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
            <a
              href="https://signal.me/#eu/V29V5cqjQfOqIDIFY6k909ZQtZ86-ygr1q1OH_lJBN1q031LAGVIz5nDn0-7k4y7"
              target="_blank"
              rel="noopener"
              className="social-link"
              aria-label="Signal Contact"
            >
              <SiSignal />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
