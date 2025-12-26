import { useState, useEffect } from 'react'
import { FaCode } from 'react-icons/fa'

const HeroSection = () => {
  const [titleText, setTitleText] = useState('')
  const fullTitle = "Hi, I'm <span class=\"gradient-text\">Sander Buruma</span>"

  useEffect(() => {
    let index = 0
    const timer = setTimeout(() => {
      const typeWriter = () => {
        if (index < fullTitle.length) {
          setTitleText(fullTitle.slice(0, index + 1))
          index++
          setTimeout(typeWriter, 50)
        }
      }
      typeWriter()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1
            className="hero-title"
            dangerouslySetInnerHTML={{ __html: titleText }}
          />
          <h2 className="hero-subtitle">Software Developer</h2>
          <p className="hero-description">
            I create efficient, scalable solutions with a focus on blockchain technology, web development, and data analysis. Passionate about turning complex problems into elegant code.
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">
              View My Work
            </a>
            <a href="#contact" className="btn btn-secondary">
              Get In Touch
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card">
            <FaCode aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
