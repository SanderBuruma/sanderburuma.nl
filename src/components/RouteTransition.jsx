import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const RouteTransition = ({ children }) => {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayLocation, setDisplayLocation] = useState(location)

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Start transition (fade out)
      setIsTransitioning(true)

      // After fade out, update location and scroll to top
      const timeout = setTimeout(() => {
        setDisplayLocation(location)
        window.scrollTo(0, 0)

        // Brief pause then fade in
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 150)

      return () => clearTimeout(timeout)
    }
  }, [location, displayLocation])

  return (
    <div className={`route-transition ${isTransitioning ? 'transitioning' : ''}`}>
      {children}
    </div>
  )
}

export default RouteTransition
