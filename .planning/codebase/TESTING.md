# Testing Patterns

**Analysis Date:** 2026-01-28

## Test Framework

**Status:** No testing framework detected

**Runner:**
- Not detected. No Jest, Vitest, or other test runner configured.

**Test Files:**
- No `.test.js`, `.test.jsx`, `.spec.js`, or `.spec.jsx` files in the project source (`src/` directory)
- Only test files found are in `node_modules/` from dependencies (not part of this project)

**Assertion Library:**
- Not detected. No assertion libraries configured.

**Configuration Files:**
- No `jest.config.js`, `vitest.config.js`, or test configuration files detected

**Run Commands:**
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview built site
```
No test execution commands defined in `package.json`.

## Manual Testing Patterns

While automated tests are not present, the codebase demonstrates the following manual testing and error-handling approaches:

### Browser DevTools / Console Testing

**Location:** Logging occurs in `src/sections/ContactSection.jsx`
```jsx
catch (error) {
  console.error('Form submission error:', error)
  alert('Something went wrong. Please try again or email me directly at info@sanderburuma.nl')
}
```

**Pattern:**
- `console.error()` logs errors to browser console for developer debugging
- User-facing `alert()` provides feedback for form failures

### Error Prevention Through Validation

**Form Validation Pattern** (from `ContactSection.jsx`):
```jsx
// Check required fields
if (!formData.name || !formData.email || !formData.message) {
  alert('Please fill in all fields')
  return
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(formData.email)) {
  alert('Please enter a valid email address')
  return
}
```

**Pattern:**
- Pre-submission validation prevents invalid data submission
- User receives immediate feedback via alert
- Early returns prevent processing invalid data

## Component Logic Testing Practices

### State Management Verification

**Hook Error Boundary** (from `hooks.jsx`):
```jsx
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

**Pattern:**
- Custom hooks validate they're used within proper context providers
- Throw errors immediately for incorrect hook usage
- Prevents silent failures with clear error messages

### Game Logic Safeguards

**Minesweeper Game** (from `MinesweeperSection.jsx`):
```jsx
// Prevent revealing flagged cells
if (board[w][z][y][x].isFlagged) {
  return
}

// Prevent moves when game is over
if (gameOver) return

// Prevent drag selection on flagged or already revealed cells
const isDifferentCell = dragStart.x !== x || dragStart.y !== y || dragStart.z !== z || dragStart.w !== w

if (isDifferentCell) {
  justDraggedRef.current = true
  setTimeout(() => {
    justDraggedRef.current = false
  }, 100)
  // ... process drag selection
}
```

**Pattern:**
- Guard clauses prevent invalid game state transitions
- Side effects are tracked with refs (`justDraggedRef`) to prevent race conditions
- State checks prevent unwanted operations during invalid game states

### DOM Validation

**Smooth Scroll Handler** (from `App.jsx`):
```jsx
const smoothScroll = (e) => {
  if (e.target.getAttribute('href')?.startsWith('#')) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    if (target) {  // Check if element exists before scrolling
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
```

**Pattern:**
- DOM queries are validated before use
- Optional chaining (`?.`) prevents null reference errors
- Conditional checks prevent errors on missing DOM elements

## Cookie Persistence Testing

**Cookie Helper Functions** (from `MinesweeperSection.jsx`):
```jsx
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

const setCookie = (name, value, days = 365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}
```

**Pattern:**
- Persistence layer verified through browser cookie storage
- Manual testing via browser DevTools -> Application tab -> Cookies
- Default values provided when cookies don't exist: `const savedMines = getCookie('minesweeper4d_mines'); return savedMines ? parseInt(savedMines, 10) : 20`

## Testing Gaps & Areas Not Covered

**Critical untested areas:**
1. **Form Submission** (`src/sections/ContactSection.jsx`):
   - Web3Forms API integration has no automated tests
   - Failure modes not verified (network errors, invalid API key, rate limiting)
   - Success response handling not validated
   - File: `src/sections/ContactSection.jsx`, lines 29-58

2. **Game Logic** (`src/sections/MinesweeperSection.jsx`):
   - 4D Minesweeper board generation not unit tested
   - Mine placement algorithm not verified
   - Win/loss condition logic not covered
   - Adjacent mine counting algorithm (4D) not verified
   - Drag selection logic not tested
   - File: `src/sections/MinesweeperSection.jsx`, lines 74-541

3. **Snake Game** (`src/sections/Snake4DSection.jsx`):
   - Game loop movement not tested
   - Collision detection not verified
   - Food generation algorithm not validated
   - File: `src/sections/Snake4DSection.jsx`

4. **Theme Management** (`src/utils/hooks.jsx`):
   - Theme persistence to localStorage not tested
   - ThemeProvider context provider not tested
   - useCountUp animation logic not covered
   - File: `src/utils/hooks.jsx`, lines 28-85

5. **Animation & Effects** (`src/App.jsx`):
   - Smooth scroll behavior not tested
   - Intersection Observer animation logic not covered
   - Parallax scroll effect not verified
   - Page load fade-in not tested
   - File: `src/App.jsx`, lines 14-67

6. **Component Rendering**:
   - Component prop handling not tested
   - Conditional rendering not verified
   - Navbar mobile menu toggle not tested

## Current Testing Capability

**What CAN be verified manually:**
- Browser console shows errors/warnings
- DevTools Network tab shows API calls and responses
- DevTools Application tab shows cookies/localStorage
- Browser rendering shows visual layout and animations
- Browser console assertions could be written manually

**What WOULD need test framework:**
- Automated game logic validation
- API mock testing (Web3Forms)
- Component unit tests
- Snapshot testing for component rendering
- Integration tests for user interactions
- E2E tests for complete workflows

## Recommended Testing Additions

To improve test coverage, consider adding:

1. **Unit Test Framework:**
   - Vitest (lightweight, works well with Vite)
   - Jest (alternative, more feature-rich)

2. **Test Libraries:**
   - `@testing-library/react` for component testing
   - `vitest` or `jest` for running tests

3. **Priority Test Areas:**
   - Game logic functions (Minesweeper, Snake) - high priority due to complexity
   - Form validation - medium priority
   - Theme persistence - medium priority
   - Hook behavior - medium priority
   - API integration - low priority (Web3Forms is external service)

4. **Example Test Structure** (if Vitest were added):
   ```jsx
   // src/sections/Minesweeper.test.jsx
   import { describe, it, expect } from 'vitest'
   import { render, screen } from '@testing-library/react'

   describe('Minesweeper4D', () => {
     it('should initialize board with correct dimensions', () => {
       // Test board creation
     })

     it('should place correct number of mines', () => {
       // Test mine placement
     })

     it('should reveal adjacent cells when zero adjacent mines', () => {
       // Test auto-reveal logic
     })
   })
   ```

---

*Testing analysis: 2026-01-28*
