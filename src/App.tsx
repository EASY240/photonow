import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ShareButtons from './components/ui/ShareButtons';
import { Breadcrumbs } from './components/Breadcrumbs';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ToolPage from './pages/ToolPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import BlogPage from './pages/BlogPage';
import BlogArticlePage from './pages/BlogArticlePage';
const PromptGeneratorPage = React.lazy(() => import('./pages/PromptGeneratorPage'));
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import DMCAPage from './pages/DMCAPage';
import CookiesPolicyPage from './pages/CookiesPolicyPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Breadcrumbs />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/:toolId" element={<ToolPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:articleId" element={<BlogArticlePage />} />
          <Route
            path="/tools/prompt-generator"
            element={
              <React.Suspense
                fallback={
                  <div className="min-h-[200px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                }
              >
                <PromptGeneratorPage />
              </React.Suspense>
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />
          <Route path="/dmca" element={<DMCAPage />} />
          <Route path="/cookies-policy" element={<CookiesPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ShareButtons />
    </div>
  );
}

export default App;
