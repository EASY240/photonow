import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ScrollToTop from './components/layout/ScrollToTop';
import './index.css';

const rootElement = document.getElementById('root');
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if (rootElement?.innerHTML) {
  // If the root element has content (from SSG), hydrate it.
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  // Otherwise, render as a normal SPA.
  ReactDOM.createRoot(rootElement!).render(app);
}
