import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './utils/hooks'
import RouteTransition from './components/RouteTransition'
import Portfolio from './pages/Portfolio'
import BlogIndex from './pages/BlogIndex'
import BlogPost from './pages/BlogPost'
import Blog404 from './pages/Blog404'

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <RouteTransition>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<Blog404 />} />
          </Routes>
        </RouteTransition>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
