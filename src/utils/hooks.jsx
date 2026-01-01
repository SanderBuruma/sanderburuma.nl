import { useState, useEffect, useRef, useContext, createContext, useReducer } from 'react'

// Theme Context
export const ThemeContext = createContext()

// Custom hook for theme
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Theme reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, isDark: !state.isDark }
    case 'SET_THEME':
      return { ...state, isDark: action.payload }
    default:
      return state
  }
}

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, {
    isDark: localStorage.getItem('theme') !== 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.isDark ? 'dark' : 'light')
    localStorage.setItem('theme', state.isDark ? 'dark' : 'light')
  }, [state.isDark])

  return (
    <ThemeContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook for counter animation
export const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (isVisible) {
      let startTime
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        setCount(Math.floor(progress * end))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isVisible, end, duration])

  return [count, ref]
}
