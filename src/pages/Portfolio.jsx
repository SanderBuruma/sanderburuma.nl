import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'
import HeroSection from '../sections/HeroSection'
import AboutSection from '../sections/AboutSection'
import ExperienceSection from '../sections/ExperienceSection'
import ProjectsSection from '../sections/ProjectsSection'
import MinesweeperSection from '../sections/MinesweeperSection'
import Snake4DSection from '../sections/Snake4DSection'
import ContactSection from '../sections/ContactSection'

const Portfolio = () => {
  useEffect(() => {
    const handleInitialScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          // Use a timeout to ensure all content is loaded and rendered
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    };

    handleInitialScroll();
    
    const smoothScroll = (e) => {
      if (e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()
        const target = document.querySelector(e.target.getAttribute('href'))
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    document.addEventListener('click', smoothScroll)

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0)'
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    })

    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .stat')
    animatedElements.forEach(el => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(20px)'
      el.style.transition = 'all 0.6s ease-out'
      observer.observe(el)
    })

    const handleParallax = () => {
      const scrolled = window.pageYOffset
      const parallaxElements = document.querySelectorAll('.floating-card')
      parallaxElements.forEach(element => {
        const speed = 0.5
        element.style.transform = `translateY(${scrolled * speed}px)`
      })
    }

    window.addEventListener('scroll', handleParallax)

    document.body.style.opacity = '0'
    document.body.style.transition = 'opacity 0.5s ease-in-out'
    setTimeout(() => {
      document.body.style.opacity = '1'
    }, 100)

    return () => {
      document.removeEventListener('click', smoothScroll)
      window.removeEventListener('scroll', handleParallax)
    }
  }, [])

  return (
    <div>
      <SEOHead
        title="Software Developer"
        description="Experienced software developer specializing in Python, blockchain analysis, and web development. Based in Netherlands. Available for remote work and projects."
        url="https://sanderburuma.nl"
        image="/og-image.jpg"
        type="website"
      />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <MinesweeperSection />
      <Snake4DSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default Portfolio
