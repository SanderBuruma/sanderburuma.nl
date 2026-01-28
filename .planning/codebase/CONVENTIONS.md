# Coding Conventions

**Analysis Date:** 2026-01-28

## Naming Patterns

**Files:**
- React components use PascalCase: `Navbar.jsx`, `HeroSection.jsx`, `Footer.jsx`
- Section components use PascalCase with "Section" suffix: `AboutSection.jsx`, `ProjectsSection.jsx`, `MinesweeperSection.jsx`
- Utility files use camelCase: `hooks.jsx`
- Styles use kebab-case or SCSS: `styles.scss`

**Functions:**
- React functional components use PascalCase: `const Navbar = () => { }`
- Helper/utility functions use camelCase: `createBoard()`, `revealCell()`, `handleMouseDown()`
- Event handlers use camelCase with "handle" prefix: `handleSubmit()`, `handleChange()`, `handleFlag()`, `handleCellClick()`
- Callbacks and internal logic functions use camelCase: `generateFood()`, `moveSnake()`, `countAdjacentMines()`

**Variables:**
- State variables use camelCase: `const [board, setBoard] = useState([])`
- Boolean state variables use "is" prefix: `const [isSubmitting, setIsSubmitting] = useState(false)`, `const [isDark, setIsDark] = useState(false)`
- Object properties use camelCase: `{ isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 }`
- Coordinate/position variables use single letters (x, y, z, w) in 4D contexts: `{ x: 0, y: 0, z: 0, w: 0 }`
- Refs use camelCase with "Ref" suffix: `gameLoopRef`, `justDraggedRef`
- Constants use UPPERCASE_SNAKE_CASE: `const SIZE = 4`

**Types:**
- Custom hooks use "use" prefix: `useTheme()`, `useCountUp()`
- Context objects use "Context" suffix: `ThemeContext`
- Reducer functions use camelCase: `themeReducer()`

## Code Style

**Formatting:**
- Uses 2-space indentation (observed in JSX and SCSS)
- No explicit formatter configuration found (no .prettierrc)
- Trailing commas in multi-line objects and arrays

**Linting:**
- No ESLint configuration detected
- No Prettier configuration detected
- Code follows general React best practices without explicit lint rules

**Component Structure Pattern:**
```jsx
// Standard component structure observed
const ComponentName = () => {
  // 1. State declarations (useState, useReducer)
  const [state, setState] = useState(initialValue)

  // 2. Context/custom hooks
  const { value } = useCustomHook()

  // 3. Ref declarations (if needed)
  const ref = useRef(null)

  // 4. useEffect hooks (grouped by concern)
  useEffect(() => {
    // Effect logic
  }, [dependencies])

  // 5. Helper/utility functions
  const helperFunction = () => { }

  // 6. Event handlers
  const handleEvent = () => { }

  // 7. Render logic or return
  return (
    // JSX
  )
}

export default ComponentName
```

## Import Organization

**Order:**
1. React imports: `import React from 'react'`, `import { useState } from 'react'`
2. Third-party library imports: `import { FaSun } from 'react-icons/fa'`
3. Internal component imports: `import Navbar from './components/Navbar'`
4. Internal utility imports: `import { useTheme } from './utils/hooks'`
5. Style imports: `import './styles/styles.scss'`

**Path Aliases:**
- No path aliases configured (imports use relative paths: `./components/`, `./sections/`, `../utils/`)

**Example from `App.jsx`:**
```jsx
import { useEffect } from 'react'
import { ThemeProvider } from './utils/hooks'
import Navbar from './components/Navbar'
// ... other component imports
```

## Error Handling

**Patterns:**
- Try-catch blocks used for async operations: `try { await fetch(...) } catch (error) { console.error(...) }`
- Promise-based error handling with `.json()` response parsing
- User-facing alerts for validation errors: `alert('Please fill in all fields')`
- Console error logging for debugging: `console.error('Form submission error:', error)`
- Custom error in hooks with descriptive messages: `throw new Error('useTheme must be used within ThemeProvider')`
- Silent error suppression in some cases with fallbacks (e.g., smooth scroll links check if target exists)
- No global error boundary detected

**Example from `ContactSection.jsx`:**
```jsx
try {
  const response = await fetch('https://api.web3forms.com/submit', { ... })
  const result = await response.json()
  if (result.success) {
    // Handle success
  } else {
    alert('Something went wrong...')
  }
} catch (error) {
  console.error('Form submission error:', error)
  alert('Something went wrong...')
} finally {
  setIsSubmitting(false)
}
```

## Logging

**Framework:** Browser `console` object (no logging library)

**Patterns:**
- Error logging: `console.error('message', error)` - used in form submission error handling
- No debug logging observed
- No info/warn logging patterns established
- Logging used only for exceptions, not routine operations

## Comments

**When to Comment:**
- Minimal comments observed
- Comments used for non-obvious logic or important algorithm explanations
- Cookie helper functions are documented with inline comments: `// Cookie helper functions`
- Algorithm comments for complex game logic: `// Check self collision`, `// Automatically reveal a random zero cell to start the game`

**JSDoc/TSDoc:**
- Not used in this codebase
- No type documentation observed
- No function parameter documentation

**Example from `MinesweeperSection.jsx`:**
```jsx
// Cookie helper functions
const getCookie = (name) => { ... }

// Handle difficulty progression when game ends
useEffect(() => { ... }, [gameOver, win])
```

## Form Handling

**Pattern:**
- Controlled components with `value` and `onChange` handlers
- Form data consolidated in single state object: `const [formData, setFormData] = useState({ name: '', email: '', message: '' })`
- Validation before submission with regex for email: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

**Example:**
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: ''
})

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}
```

## State Management

**Pattern:**
- React Context API for global theme state: `ThemeContext` with `useTheme()` hook
- `useReducer` for complex state logic: `themeReducer()` for theme state
- `useState` for local component state
- `useRef` for mutable values that don't cause re-renders: DOM refs, game loop refs
- localStorage for persistence: theme preference, game difficulty

**Example from `hooks.jsx`:**
```jsx
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
```

## SCSS/CSS Conventions

**Variables:**
- CSS custom properties (CSS variables) for colors, spacing, and effects: `--primary-color`, `--text-primary`, `--bg-primary`
- SCSS variables for design tokens: `$border-radius`, `$gap-default`, `$padding-card`
- Theme switching via `[data-theme="dark"]` selector

**Mixins:**
- Standard mixins for common patterns: `@mixin transition()`, `@mixin flex-center`

**Organization:**
- Variables at the top
- Reset/base styles
- Mixins defined early for reuse
- Component-specific styles below

**Example structure:**
```scss
// Variables
:root {
  --primary-color: #6366f1;
}

[data-theme="dark"] {
  --text-primary: #f1f5f9;
}

// SCSS Variables
$border-radius: 12px;

// Mixins
@mixin transition($props: all, $duration: .3s, $ease: ease) {
  transition: $props $duration $ease;
}
```

## Accessibility

**Patterns Observed:**
- ARIA labels on interactive elements: `aria-label="Toggle navigation menu"`, `aria-expanded={mobileMenuOpen}`
- Hidden labels with `sr-only` class for screen reader only content: `<label htmlFor="name" className="sr-only">Your Name</label>`
- Semantic HTML: proper heading hierarchy, form labels
- `aria-hidden="true"` on decorative icons
- Proper heading structure (h1, h2, h3)

## React Patterns

**Hooks Usage:**
- Standard React hooks: `useState`, `useEffect`, `useRef`, `useContext`, `useReducer`
- Custom hooks for reusable logic: `useTheme()`, `useCountUp()`
- Early returns in effects for cleanup

**Effect Dependencies:**
- Proper dependency arrays specified
- Effect cleanup functions for event listeners: `return () => { removeEventListener(...) }`

**Key Props:**
- Keys used in lists: `key={item.id}`, `key={w}-${z}`, ensuring unique identifiers

**Example from Navbar:**
```jsx
{[
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  // ...
].map(item => (
  <li key={item.id} className="nav-item">
    {/* ... */}
  </li>
))}
```

---

*Convention analysis: 2026-01-28*
