import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { getBlogArticleByIdSync, BlogArticleWithContent } from '../utils/blogLoader';
import ArticleNavigation from '../components/ArticleNavigation';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import { generateBreadcrumbSchema, personalProfile } from '../utils/siteConfig';
import 'img-comparison-slider/dist/styles.css';
import 'img-comparison-slider';

const extractFaqSchemaFromContent = (content: string): Record<string, unknown> | null => {
  const schemaScriptMatches = content.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );

  for (const match of schemaScriptMatches) {
    const scriptContent = match[1]?.trim();
    if (!scriptContent) {
      continue;
    }

    try {
      const parsed = JSON.parse(scriptContent) as Record<string, unknown> | Record<string, unknown>[];
      const schemaItems = Array.isArray(parsed) ? parsed : [parsed];
      const faqSchema = schemaItems.find(
        (item) => item && !Array.isArray(item) && item['@type'] === 'FAQPage'
      );

      if (faqSchema) {
        return faqSchema;
      }
    } catch {
      continue;
    }
  }

  return null;
};

const BlogArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const initialRedirect = articleId === 'remove-background-free-guide' ? '/blog/best-photo-background-editors-2025' : null;
  const initialArticle = articleId && !initialRedirect ? getBlogArticleByIdSync(articleId) || null : null;
  const [article, setArticle] = useState<BlogArticleWithContent | null>(initialArticle);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(!articleId ? true : !initialRedirect && !initialArticle);
  const [redirectTo, setRedirectTo] = useState<string | null>(initialRedirect);
  const canonicalUrl = `https://modernphototools.com/blog/${articleId}`;
  
  useEffect(() => {
    if (!articleId) {
      setArticle(null);
      setRedirectTo(null);
      setNotFound(true);
      setLoading(false);
      return;
    }

    if (articleId === 'remove-background-free-guide') {
      setArticle(null);
      setRedirectTo('/blog/best-photo-background-editors-2025');
      setNotFound(false);
      setLoading(false);
      return;
    }

    const loadedArticle = getBlogArticleByIdSync(articleId);
    setArticle(loadedArticle || null);
    setRedirectTo(null);
    setNotFound(!loadedArticle);
    setLoading(false);
  }, [articleId]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!article) return;
    try {
      const container = document.querySelector('.article-content');
      if (!container) return;

      const faqItems = Array.from(container.querySelectorAll('.faq-item')) as HTMLElement[];
      if (faqItems.length === 0) return;

      const buttons: HTMLButtonElement[] = [];

      faqItems.forEach((item, index) => {
        try {
          if (item.dataset.faqEnhanced === 'true') return;
          const questionEl = (item.querySelector('.faq-question') || item.querySelector('h3')) as HTMLElement | null;
          let answerEl = item.querySelector('.faq-answer') as HTMLElement | null;
          if (!answerEl) {
            const paragraphAnswer = item.querySelector('p') as HTMLElement | null;
            if (paragraphAnswer) {
              paragraphAnswer.classList.add('faq-answer');
              answerEl = paragraphAnswer;
            }
          }
          if (!questionEl || !answerEl) {
            console.warn('FAQ item missing expected structure', { hasQuestion: !!questionEl, hasAnswer: !!answerEl });
            return;
          }

          const existingButton = questionEl.querySelector('button');
          let button = existingButton as HTMLButtonElement | null;

          const answerId = answerEl.id || `faq-answer-${article.id}-${index}`;
          answerEl.id = answerId;
          answerEl.setAttribute('role', 'region');
          answerEl.setAttribute('aria-labelledby', `${answerId}-label`);
          answerEl.style.maxHeight = '0px';
          answerEl.style.overflow = 'hidden';
          answerEl.style.transition = 'max-height 0.25s ease';
          answerEl.setAttribute('hidden', 'true');

          if (!button) {
            button = document.createElement('button');
            button.type = 'button';
            button.id = `${answerId}-label`;
            button.className =
              'w-full flex items-center justify-between text-left px-4 py-3 md:px-5 md:py-4 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors';
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-controls', answerId);

            const labelSpan = document.createElement('span');
            labelSpan.textContent = questionEl.textContent || '';
            labelSpan.className = 'font-semibold text-gray-900';
            button.appendChild(labelSpan);

            button.insertAdjacentHTML(
              'beforeend',
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-5 h-5 text-gray-500 transition-transform duration-200"><path d="m6 9 6 6 6-6"></path></svg>'
            );

            questionEl.textContent = '';
            questionEl.appendChild(button);
          } else {
            button.setAttribute('aria-controls', answerId);
            button.id = `${answerId}-label`;
          }

          const toggle = () => {
            const isExpanded = button!.getAttribute('aria-expanded') === 'true';
            const newExpanded = !isExpanded;
            button!.setAttribute('aria-expanded', String(newExpanded));

            const icon = button!.querySelector('svg');
            if (icon) {
              if (newExpanded) {
                icon.classList.add('transform', 'rotate-180');
              } else {
                icon.classList.remove('transform', 'rotate-180');
              }
            }

            if (newExpanded) {
              answerEl.removeAttribute('hidden');
              const scrollHeight = answerEl.scrollHeight;
              answerEl.style.maxHeight = `${scrollHeight}px`;
            } else {
              answerEl.style.maxHeight = '0px';
              answerEl.setAttribute('hidden', 'true');
            }
          };

          button.addEventListener('click', toggle);
          button.addEventListener('keydown', (event: KeyboardEvent) => {
            const key = event.key;
            if (key === 'Enter' || key === ' ') {
              event.preventDefault();
              toggle();
            } else if (key === 'ArrowDown' || key === 'ArrowUp') {
              event.preventDefault();
              const currentItem = button!.closest('.faq-item') as HTMLElement | null;
              if (!currentItem) return;
              const allItems = Array.from(container.querySelectorAll('.faq-item')) as HTMLElement[];
              const currentIndex = allItems.indexOf(currentItem);
              if (currentIndex === -1) return;
              const offset = key === 'ArrowDown' ? 1 : -1;
              const nextIndex = currentIndex + offset;
              if (nextIndex < 0 || nextIndex >= allItems.length) return;
              const nextQuestion = allItems[nextIndex].querySelector('.faq-question button') as HTMLButtonElement | null;
              if (nextQuestion) {
                nextQuestion.focus();
              }
            }
          });

          buttons.push(button);
          item.dataset.faqEnhanced = 'true';
        } catch (err) {
          console.error('Failed to enhance FAQ item', err);
        }
      });

      return () => {
        buttons.forEach((button) => {
          button.replaceWith(button.cloneNode(true));
        });
      };
    } catch (err) {
      console.error('Failed to initialize FAQ accordions', err);
    }
  }, [article]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!article) return;
    let cancelled = false;

    const renderMermaid = async () => {
      const container = document.querySelector('.article-content');
      if (!container) return;
      const nodes = Array.from(container.querySelectorAll('.mermaid')) as HTMLElement[];
      if (nodes.length === 0) return;
      const pendingNodes = nodes.filter((node) => node.getAttribute('data-processed') !== 'true');
      if (pendingNodes.length === 0) return;

      const { default: mermaid } = await import('mermaid');
      if (cancelled) return;
      mermaid.initialize({ startOnLoad: false, theme: 'default' });
      await mermaid.run({ nodes: pendingNodes });
      pendingNodes.forEach((node) => {
        node.setAttribute('data-processed', 'true');
      });
    };

    renderMermaid().catch((error) => {
      console.error('Failed to render mermaid diagrams', error);
    });

    return () => {
      cancelled = true;
    };
  }, [article]);
  
  if (redirectTo) {
    return (
      <>
        <SEO 
          title={"Redirecting... | ModernPhotoTools"}
          description={"Redirecting to updated article."}
          canonicalUrl={canonicalUrl}
        />
        <Navigate to={redirectTo} replace />
      </>
    );
  }
  
  if (!articleId) {
    return <Navigate to="/blog" replace />;
  }
  if (notFound) {
    return (
      <>
        <SEO 
          title={"Article Not Found | ModernPhotoTools"}
          description={"The requested article could not be found."}
          canonicalUrl={canonicalUrl}
        />
        <Navigate to="/blog" replace />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <SEO 
          title={"Loading Article... | ModernPhotoTools"}
          description={"Please wait while the article loads."}
          canonicalUrl={canonicalUrl}
        />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
      </>
    );
  }
  
  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const upscalerFaqItems = [
    {
      question: 'When is a free AI image upscaler good enough?',
      answer:
        'Free AI image upscalers are usually good enough for personal projects, social media posts, and occasional upscaling tasks where you do not need massive print sizes or strict brand consistency. If you only upscale a handful of images each month and your final output is screens rather than large-format prints, you will get excellent value from free desktop tools like Upscayl or web-based services with modest limits.'
    },
    {
      question: 'When should I invest in paid AI upscaling software?',
      answer:
        'Paid AI upscaling software makes sense when you work with clients, print at large sizes, or process images in high volume. If you need batch processing, RAW support, consistent color, clear commercial licensing, and maximum detail retention, paid tools quickly pay for themselves. For e-commerce, print studios, agencies, or archival work, free tools rarely offer the control and reliability you need.'
    },
    {
      question: 'What features matter most when comparing AI upscaling tools?',
      answer:
        'The most important features are maximum resolution and scale, batch processing, noise and artifact control, support for formats like TIFF or RAW, export fidelity for EXIF and color profiles, and clear licensing for commercial use. Ease of use and processing speed also matter, especially when you handle dozens or hundreds of images per week.'
    },
    {
      question: 'How does Modern Photo Tools AI Image Upscaler fit into a workflow?',
      answer:
        'Modern Photo Tools AI Image Upscaler is ideal as a fast, browser-based step in your editing workflow. You can quickly upscale low-resolution assets, product photos, or social images without installing software or creating an account. For many users, it replaces basic desktop upscalers entirely; for professionals, it serves as a convenient first pass before deeper editing in tools like Photoshop, Topaz Gigapixel AI, or PhotoDirector.'
    }
  ];

  const shouldShowUpscalerFaq =
    article.id === 'free-ai-image-upscaler-vs-paid-software-when-free-is-good-enough-2026';

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: article.title, path: `/blog/${articleId}` }
  ]);

  const upscalerFaqSchema = shouldShowUpscalerFaq
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: upscalerFaqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      }
    : null;
  const articleFaqSchema = extractFaqSchemaFromContent(article.content);
  const activeFaqSchema = upscalerFaqSchema || articleFaqSchema;
  const schemaData = activeFaqSchema ? [activeFaqSchema, breadcrumbSchema] : breadcrumbSchema;

  const renderContent = (content: string) => {
    const sanitizedContent = content.replace(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
      ''
    );

    // Check if content contains HTML tags
    const hasHtmlTags = /<[^>]+>/.test(sanitizedContent);
    
    if (hasHtmlTags) {
      // Content contains HTML, render it directly with dangerouslySetInnerHTML
      // but add custom CSS classes for styling
      return (
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      );
    }
    
    // Fallback to markdown-like parsing for plain text content
    const lines = content.split('\n');
    const processedLines = new Set<number>();
    
    return lines.map((line, index) => {
      if (processedLines.has(index)) return null;
      
      const trimmedLine = line.trim();

      // Handle headings
      if (trimmedLine.startsWith('# ')) return <h1 key={index} className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 mt-10">{trimmedLine.substring(2)}</h1>;
      if (trimmedLine.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold text-gray-900 mb-4 mt-8">{trimmedLine.substring(3)}</h2>;
      if (trimmedLine.startsWith('### ')) return <h3 key={index} className="text-xl font-semibold text-gray-900 mb-3 mt-6">{trimmedLine.substring(4)}</h3>;
      
      // Handle unordered list items
      if (trimmedLine.startsWith('- ')) {
        const listItems = [];
        for (let j = index; j < lines.length && lines[j].trim().startsWith('- '); j++) {
          listItems.push(<li key={j}>{trimmedLine.substring(2)}</li>);
          processedLines.add(j);
        }
        return <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-gray-700">{listItems}</ul>;
      }

      // Handle paragraphs
      if (trimmedLine.length > 0) {
        return <p key={index} className="text-gray-700 mb-4 leading-relaxed">{trimmedLine}</p>;
      }

      return null;
    }).filter(Boolean);
  };

  return (
    <>
      <SEO 
        title={article.metaTitle || article.title}
        description={article.metaDescription || article.excerpt}
        canonicalUrl={`https://modernphototools.com/blog/${articleId}`}
        ogImage={article.featuredImage}
      />
      <SchemaJSONLD data={schemaData} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <Link 
              to="/blog" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
              aria-label="Go back to blog page"
            >
              ← Back to Blog
            </Link>
          </nav>

              <article className="max-w-4xl mx-auto">
                <div className="h-64 md:h-80 bg-gray-200 rounded-xl mb-8 relative overflow-hidden">
                  <img 
                    src={article.featuredImage} 
                    alt={`Featured image for ${article.title}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block px-4 py-2 bg-white bg-opacity-90 text-blue-600 text-sm font-medium rounded-full mb-4">
                      {article.category === 'general' ? 'General' : 'Tools'}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {article.title}
                    </h1>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{new Date(article.publishDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                      <span className="mx-2">•</span>
                      <span>{article.readTime}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors duration-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="prose prose-lg max-w-none">
                    {renderContent(article.content)}
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <img
                          src={personalProfile.imageUrl}
                          alt={`Portrait of ${personalProfile.fullName}`}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-md shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">About the Author</h3>
                          <p className="text-blue-700 font-semibold">{personalProfile.fullName} — {personalProfile.title}</p>
                          <p className="text-gray-700 mt-4">{personalProfile.bioParagraphs[1]}</p>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <a
                          href={personalProfile.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Visit Personal Site
                        </a>
                        <a
                          href={personalProfile.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-gray-800 font-semibold hover:border-blue-500 hover:text-blue-700 transition-colors"
                        >
                          Follow on Instagram
                        </a>
                        <a
                          href={`mailto:${personalProfile.contactEmail}`}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-gray-800 font-semibold hover:border-blue-500 hover:text-blue-700 transition-colors"
                        >
                          Contact Ali
                        </a>
                      </div>
                    </div>
                  </div>

                  {shouldShowUpscalerFaq && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                      <p className="text-gray-600 mb-6">
                        Answers to the most common questions about choosing between free and paid AI upscaling tools.
                      </p>
                      <div className="space-y-4">
                        {upscalerFaqItems.map((item) => (
                          <div key={item.question} className="rounded-lg border border-gray-200 bg-white p-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.question}</h3>
                            <p className="text-gray-700">{item.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Ready to Try Our AI Tools?
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Transform your photos with our powerful AI-powered editing tools.
                      </p>
                      <Link 
                        to="/tools"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                      >
                        Explore Tools
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  <ArticleNavigation currentArticleId={articleId!} />

                </div>
              </article>
            
        </div>
      </div>
    </>
  );
};

export default BlogArticlePage;
