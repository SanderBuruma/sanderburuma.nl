import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './utils/hooks'
import Portfolio from './pages/Portfolio'

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/blog" element={<div>Blog Index Placeholder</div>} />
          <Route path="/blog/:slug" element={<div>Blog Post Placeholder</div>} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
