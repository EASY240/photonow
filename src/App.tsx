import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ShareButtons from './components/ui/ShareButtons';
import { Breadcrumbs } from './components/Breadcrumbs';
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ToolsPage = React.lazy(() => import('./pages/ToolsPage'));
const ToolPage = React.lazy(() => import('./pages/ToolPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogArticlePage = React.lazy(() => import('./pages/BlogArticlePage'));
const PromptGeneratorPage = React.lazy(() => import('./pages/PromptGeneratorPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfUsePage = React.lazy(() => import('./pages/TermsOfUsePage'));
const DMCAPage = React.lazy(() => import('./pages/DMCAPage'));
const CookiesPolicyPage = React.lazy(() => import('./pages/CookiesPolicyPage'));
const AcceptableUsePolicyPage = React.lazy(() => import('./pages/AcceptableUsePolicyPage'));

const pageFallback = (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Breadcrumbs />
      <main className="flex-grow">
        <Suspense fallback={pageFallback}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/:toolId" element={<ToolPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:articleId" element={<BlogArticlePage />} />
            <Route path="/tools/prompt-generator" element={<PromptGeneratorPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-use" element={<TermsOfUsePage />} />
            <Route path="/dmca" element={<DMCAPage />} />
            <Route path="/cookies-policy" element={<CookiesPolicyPage />} />
            <Route path="/acceptable-use" element={<AcceptableUsePolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ShareButtons />
    </div>
  );
}

export default App;
