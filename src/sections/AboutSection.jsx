import { useCountUp } from '../utils/hooks'

const StatCard = ({ value, label, suffix = '' }) => {
  const [count, ref] = useCountUp(value)

  return (
    <div className="stat" ref={ref}>
      <h3>{count}{suffix}</h3>
      <p>{label}</p>
    </div>
  )
}

const AboutSection = () => {
  // Calculate years of experience from February 2020 to now, rounded up
  const startDate = new Date(2020, 1) // February 2020 (month is 0-indexed)
  const now = new Date()
  const yearsDiff = (now - startDate) / (1000 * 60 * 60 * 24 * 365.25)
  const yearsExperience = Math.ceil(yearsDiff)

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              I'm a software developer with a passion for creating innovative solutions in blockchain technology, web development, and data analysis. With experience in multiple programming languages and frameworks, I enjoy tackling complex challenges and building applications that make a difference.
            </p>
            <p>
              My expertise spans from backend development with Python and JavaScript to blockchain analysis and cryptocurrency trading tools. I believe in writing clean, maintainable code and staying up-to-date with the latest technologies.
            </p>
          </div>
          <div className="about-stats">
            <StatCard
              value={yearsExperience}
              label="Years Experience"
              suffix="+"
            />
            <StatCard
              value={50}
              label="Projects Completed"
              suffix="+"
            />
            <StatCard
              value={10}
              label="Technologies"
              suffix="+"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
