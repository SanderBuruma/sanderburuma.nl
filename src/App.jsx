import { useEffect } from 'react'
import { ThemeProvider } from './utils/hooks'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import ExperienceSection from './sections/ExperienceSection'
import ProjectsSection from './sections/ProjectsSection'
import MinesweeperSection from './sections/MinesweeperSection'
import ContactSection from './sections/ContactSection'

const AppContent = () => {
  useEffect(() => {
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
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <MinesweeperSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
