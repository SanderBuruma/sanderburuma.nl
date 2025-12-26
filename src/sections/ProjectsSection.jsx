import { useState } from 'react'
import { FaChartLine, FaRobot, FaWallet, FaGlobe, FaShieldAlt } from 'react-icons/fa'

const ProjectsSection = () => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const projects = [
    {
      title: 'Solana Chain Analyzer',
      icon: FaChartLine,
      description: 'Comprehensive cryptocurrency analysis tool that processes Solana blockchain data to identify trading patterns, volatility, and market trends.',
      tags: ['Python', 'Blockchain', 'Data Analysis'],
      category: 'blockchain'
    },
    {
      title: 'Telegram Trading Bot',
      icon: FaRobot,
      description: 'Automated trading signal analyzer that evaluates crypto trading channels and provides performance metrics and success rates.',
      tags: ['Python', 'Telegram API', 'Django'],
      category: 'automation'
    },
    {
      title: 'Blockchain Wallet Inspector',
      icon: FaWallet,
      description: 'Web3 tool for inspecting Solana wallets, displaying token balances, and transaction history with a clean, user-friendly interface.',
      tags: ['Web3', 'Solana', 'React'],
      category: 'blockchain'
    },
    {
      title: 'Portfolio Website',
      icon: FaGlobe,
      description: 'Modern React-based portfolio website with interactive components, theme switching, and smooth animations.',
      tags: ['React', 'JavaScript', 'CSS'],
      category: 'web'
    },
    {
      title: 'API Rate Limiter',
      icon: FaShieldAlt,
      description: 'High-performance rate limiting service built with Redis and Node.js for API protection and traffic management.',
      tags: ['Node.js', 'Redis', 'Docker'],
      category: 'backend'
    }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.category === filter
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const categories = ['all', ...new Set(projects.map(p => p.category))]

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-filters">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="project-search"
            aria-label="Search projects"
          />
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${filter === category ? 'active' : ''}`}
                onClick={() => setFilter(category)}
                aria-label={`Filter by ${category}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="projects-grid">
          {filteredProjects.map(project => {
            const IconComponent = project.icon
            return (
              <div key={project.title} className="project-card">
                <div className="project-image">
                  <IconComponent aria-hidden="true" />
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map(tag => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
