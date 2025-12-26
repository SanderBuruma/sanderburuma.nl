import { useState } from 'react'
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiSignal } from 'react-icons/si'

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'cf0434f9-44f0-46ba-ac53-978c15bbb240',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Contact Form Message from ${formData.name}`
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('Thank you for your message! I\'ll get back to you soon.')
        setFormData({ name: '', email: '', message: '' })
      } else {
        alert('Something went wrong. Please try again or email me directly at info@sanderburuma.nl')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Something went wrong. Please try again or email me directly at info@sanderburuma.nl')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Let's work together</h3>
            <p>
              I'm always interested in new opportunities and exciting projects. Whether you have a question or just want to say hi, feel free to reach out!
            </p>
            <div className="contact-items">
              <div className="contact-item">
                <FaEnvelope aria-hidden="true" />
                <a href="mailto:info@sanderburuma.nl">
                  info@sanderburuma.nl
                </a>
              </div>
              <div className="contact-item">
                <FaGithub aria-hidden="true" />
                <a
                  href="https://github.com/sanderburuma"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/sanderburuma
                </a>
              </div>
              <div className="contact-item">
                <FaLinkedin aria-hidden="true" />
                <a
                  href="https://www.linkedin.com/in/sander-buruma-729a84235"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/sander-buruma
                </a>
              </div>
              <div className="contact-item">
                <SiSignal aria-hidden="true" />
                <a
                  href="https://signal.me/#eu/V29V5cqjQfOqIDIFY6k909ZQtZ86-ygr1q1OH_lJBN1q031LAGVIz5nDn0-7k4y7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  signal.me/cubit32.68
                </a>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="sr-only">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="sr-only">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message" className="sr-only">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Your Message"
                required
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
