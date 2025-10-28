import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import ScrollToTop from './components/layout/ScrollToTop.tsx'
import './index.css'

const rootElement = document.getElementById('root')!

// Check if the root element has actual SSG content (not just the placeholder comment)
const hasSSGContent = rootElement.innerHTML.trim() && 
                     !rootElement.innerHTML.includes('<!--app-html-->') &&
                     rootElement.innerHTML !== '<!--app-html-->'

if (hasSSGContent) {
  // Hydrate the pre-rendered content
  ReactDOM.hydrateRoot(
    rootElement,
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
} else {
  // Render normally for SPA mode (development or no SSG content)
  ReactDOM.createRoot(rootElement).render(
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
}
