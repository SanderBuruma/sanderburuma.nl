# Sander Buruma - Portfolio Website

Modern, SEO-optimized portfolio website built with React and Vite. Features a 4D Minesweeper game, dark mode, and comprehensive SEO implementation.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 📋 Features

### 🎨 UI/UX
- **Single-page React application** with smooth scrolling
- **Dark/Light theme** with localStorage persistence
- **Responsive design** for mobile, tablet, and desktop
- **Interactive animations** (scroll reveal, parallax, typing effect)
- **4D Minesweeper game** with drag-to-reveal mechanics

### 🔍 SEO Optimization
- **Comprehensive meta tags** (title, description, keywords, author)
- **Open Graph tags** for Facebook/social media previews
- **Twitter Card tags** for Twitter link previews
- **Structured Data (JSON-LD)** - Person, WebSite, and BreadcrumbList schemas
- **robots.txt** for crawler control
- **sitemap.xml** for search engine indexing
- **Canonical URLs** to prevent duplicate content
- **Semantic HTML** with proper heading hierarchy

### ⚡ Performance
- **Production React builds** (minified, optimized)
- **Code splitting** with vendor chunking
- **Font preconnect** for faster font loading
- **Tree-shakeable icons** with react-icons
- **SASS preprocessing** for optimized CSS
- **Asset hashing** for optimal caching

### ♿ Accessibility
- **ARIA labels** on interactive elements
- **Skip navigation link** for keyboard users
- **Screen reader friendly** with .sr-only class
- **Semantic form labels** with proper associations
- **Keyboard navigation** support

## 🏗️ Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **SASS** - CSS preprocessing
- **React Icons** - Icon library (Font Awesome icons)
- **Google Fonts** - Inter font family

## 📁 Project Structure

```
sanderburuma.nl/
├── src/
│   ├── main.jsx              # Application entry point
│   ├── App.jsx               # Main app component with routing
│   ├── components/           # Reusable components
│   │   ├── Navbar.jsx        # Navigation with theme toggle
│   │   └── Footer.jsx        # Footer with social links
│   ├── sections/             # Page sections
│   │   ├── HeroSection.jsx           # Hero with typing animation
│   │   ├── AboutSection.jsx          # About with animated stats
│   │   ├── ExperienceSection.jsx     # Work experience timeline
│   │   ├── ProjectsSection.jsx       # Featured projects grid
│   │   ├── MinesweeperSection.jsx    # 4D Minesweeper game
│   │   └── ContactSection.jsx        # Contact form
│   ├── utils/
│   │   └── hooks.jsx         # Custom hooks (useTheme, useCountUp)
│   └── styles/
│       └── styles.scss       # Global styles with SASS
├── public/                   # Static assets
│   ├── favicon.ico          # Site favicon
│   ├── robots.txt           # Crawler instructions
│   └── sitemap.xml          # Site structure for SEO
├── index.html               # HTML template with SEO meta tags
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

## 🔧 Configuration

### Vite Configuration (`vite.config.js`)
- React plugin for JSX support
- SASS preprocessing
- Code splitting (React vendor chunk)
- Source maps for debugging
- esbuild minification

### Build Output
```
dist/
├── index.html                 # Optimized HTML
├── assets/
│   ├── index-[hash].css      # Minified CSS (~11.5 KB)
│   ├── react-vendor-[hash].js # React libraries (~11.4 KB)
│   └── index-[hash].js        # App code (~212 KB)
└── [static files]             # Favicon, robots.txt, sitemap.xml
```

## 🚀 Deployment

### Automatic Deployment (GitHub Actions)
Pushes to `main` branch automatically:
1. Checkout code
2. Install dependencies (with npm caching)
3. Build production bundle
4. Deploy `dist/` to VPS via SCP
5. Set proper file permissions

### Manual Deployment
```bash
# Build production bundle
npm run build

# Upload dist/ to server
scp -r dist/* user@server:/var/www/sanderburuma.nl/

# Set permissions on server
chown -R www-data:www-data /var/www/sanderburuma.nl
```

## 📊 SEO Checklist

### Pre-Launch
- [x] Meta tags configured (title, description, keywords)
- [x] Open Graph tags added
- [x] Twitter Card tags added
- [x] Structured data (JSON-LD) implemented
- [x] robots.txt created
- [x] sitemap.xml created
- [x] Favicon linked
- [ ] Create og-image.jpg (1200x630px) for social sharing
- [x] Canonical URLs set

### Post-Launch
- [ ] Submit sitemap to Google Search Console
- [ ] Verify Google Rich Results (structured data)
- [ ] Test with Google PageSpeed Insights (target: 90+)
- [ ] Test social media previews (opengraph.xyz, metatags.io)
- [ ] Set up Google Analytics 4
- [ ] Monitor search rankings

## 🎯 Performance Targets

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Total Bundle Size**: < 250 KB (gzipped: < 75 KB)

## 🌐 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## 📝 Development Notes

### Theme System
Theme preference is stored in `localStorage` and applied via CSS custom properties (`--primary-color`, `--bg-primary`, etc.). Toggle between light/dark mode using the moon/sun icon in the navbar.

### 4D Minesweeper
Interactive 4x4x4x4 minesweeper game with:
- Click to reveal cells
- Right-click to flag mines
- Drag selection for multi-cell reveal
- Auto-reveal adjacent cells
- Green mines on win, red on loss

### Custom Hooks
- **`useTheme()`** - Access theme context (isDark, dispatch)
- **`useCountUp()`** - Animated counter with intersection observer

## 🔒 Security

- No inline scripts (except JSON-LD structured data)
- CSP-friendly architecture
- No exposed API keys or secrets
- XSS protection via React's built-in escaping
- Form validation on contact form

## 📧 Contact

- **Email**: info@sanderburuma.nl
- **GitHub**: [@sanderburuma](https://github.com/sanderburuma)
- **LinkedIn**: [Sander Buruma](https://www.linkedin.com/in/sander-buruma-729a84235)

## 📄 License

ISC License - See package.json

---

**Built with ❤️ by Sander Buruma**
