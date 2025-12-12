import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import ScrollToTop from './components/layout/ScrollToTop.tsx'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('[main] No root element found to mount React app')
} else {
  const hasPlaceholderComment = () => {
    try {
      for (let i = 0; i < rootElement.childNodes.length; i++) {
        const n = rootElement.childNodes[i]
        if (n && n.nodeType === Node.COMMENT_NODE && String((n as Comment).nodeValue).includes('app-html')) {
          return true
        }
      }
    } catch {
      return false
    }
    return false
  }

  const raw = rootElement.innerHTML || ''
  const hasSSGContent = raw.trim().length > 0 && !hasPlaceholderComment()
  const shouldSkipHydration = typeof window !== 'undefined' && window.location && window.location.pathname === '/tools/prompt-generator'

  const app = (
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <ScrollToTop />
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  )

  if (hasSSGContent && !shouldSkipHydration) {
    try {
      ReactDOM.hydrateRoot(rootElement, app)
    } catch (err) {
      console.error('[main] hydrateRoot failed — falling back to createRoot', err)
      ReactDOM.createRoot(rootElement).render(app)
    }
  } else {
    ReactDOM.createRoot(rootElement).render(app)
  }
}
