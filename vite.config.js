import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
      inject: {
        tags: [
          {
            injectTo: 'head',
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: '/assets/inter-latin-300-normal.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: 'anonymous'
            }
          },
          {
            injectTo: 'head',
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: '/assets/inter-latin-400-normal.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: 'anonymous'
            }
          },
          {
            injectTo: 'head',
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: '/assets/inter-latin-600-normal.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: 'anonymous'
            }
          },
          {
            injectTo: 'head',
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: '/assets/inter-latin-700-normal.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: 'anonymous'
            }
          }
        ]
      }
    }),
    // Custom plugin to inline CSS
    {
      name: 'inline-css',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml: {
        order: 'post',
        handler(html, { bundle }) {
          if (!bundle) return html

          // Find the CSS file in the bundle
          const cssFileName = Object.keys(bundle).find(
            fileName => fileName.endsWith('.css')
          )

          if (cssFileName) {
            const cssContent = bundle[cssFileName].source
            const cssLinkRegex = /<link[^>]*rel="stylesheet"[^>]*>/g

            // Replace the CSS link with an inline style tag
            html = html.replace(
              cssLinkRegex,
              `<style>${cssContent}</style>`
            )

            // Remove the CSS file from the bundle so it's not emitted
            delete bundle[cssFileName]
          }

          return html
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom']
        },
        // Use predictable asset file names for fonts
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.woff2')) {
            // Keep font filenames predictable for preload tags
            const name = assetInfo.name.replace(/\.[^.]+\.woff2$/, '.woff2')
            return `assets/${name}`
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ``
      }
    }
  }
})
