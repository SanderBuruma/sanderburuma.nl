import { FaMapMarkerAlt, FaCalendar } from 'react-icons/fa'

const ExperienceSection = () => {
  const experiences = [
    {
      title: 'Python Developer',
      company: 'CitizenGO',
      location: 'Remote',
      period: 'Nov 2022 - Present',
      description: [
        'Developed Python Selenium end-to-end test environment for donation pipeline',
        'Implemented SQL monitoring of donation pipeline acceptance ratio and fraud detection',
        'Built AI project with Python Django for employee productivity reporting to management'
      ]
    },
    {
      title: 'Dotnet Developer',
      company: 'AWI bv',
      location: 'Netherlands',
      period: 'May 2022 - Nov 2022',
      description: [
        'Fixed bugs in decades-old C# legacy codebase with millions of lines of code',
        'Performed general refactoring and code improvements'
      ]
    },
    {
      title: 'Python Developer | Database Admin | Data Analyst',
      company: 'Civitas Christiana',
      location: 'Veenendaal',
      period: 'Feb 2021 - May 2022',
      description: [
        'Automated donation data input, saving 20 hours per week',
        'Implemented auto-correction of erroneous user input using Python',
        'Extracted data from legacy website using Python Selenium',
        'Implemented postcode checker in PHP, eliminating address errors',
        'Provided general IT support'
      ]
    },
    {
      title: 'Dotnet Developer',
      company: 'HRorganizer',
      location: 'Wageningen',
      period: 'Jan 2020 - Feb 2021',
      description: [
        'Converted 100,000+ lines of .NET code from synchronous to asynchronous',
        'Achieved 20% latency improvement',
        'Built personalization test in Angular (TypeScript) now in production use'
      ]
    }
  ]

  return (
    <section id="experience" className="experience">
      <div className="container">
        <h2 className="section-title">Work Experience</h2>
        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-content">
                <div className="experience-header">
                  <div>
                    <h3>{exp.title}</h3>
                    <h4>{exp.company}</h4>
                    <p className="experience-meta">
                      <FaMapMarkerAlt /> {exp.location} | <FaCalendar /> {exp.period}
                    </p>
                  </div>
                </div>
                <ul className="experience-description">
                  {exp.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExperienceSection
