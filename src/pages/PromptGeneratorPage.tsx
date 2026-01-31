import React, { useMemo, useState, useEffect, useRef } from 'react';
import { HelpCircle, ClipboardCopy, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import { FRAMEWORKS, analyzePromptIntent } from '../utils/promptAnalysis';
import { fetchOptimizedPrompt } from '../utils/api';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import PromptGuideSection from '../components/PromptGuideSection';
import ToolFeatureImage from '../components/ui/ToolFeatureImage';
import { findToolImage, generateAltText } from '../utils/imageMapper';
import SEO from '../components/ui/SEO';
import { generateCanonicalUrl, generateOgImageUrl } from '../utils/siteConfig';
import SupportBanner from '../components/ui/SupportBanner';

const DEFINITIONS: Record<string, string> = {
  Instruction: 'The specific task to perform.',
  Context: 'Background, purpose, or audience.',
  Data: 'Information or inputs to use.',
  Format: 'Desired structure of the output.',
  Role: 'Assigned job or expert persona.',
  Request: 'The exact task to complete.',
  Examples: 'Samples that illustrate quality.',
  Output: 'Final deliverable shape.',
  Constraints: 'Rules and limits to follow.',
  Message: 'Core takeaway or thesis.',
  Intention: 'Goal such as inform or persuade.',
  Rhythm: 'Tone and style.',
  Offer: 'Promotion or product being presented.',
  Target: 'Intended audience.',
  Action: 'What the reader should do.',
  Result: 'Business objective.'
};


export default function PromptGeneratorPage() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [framework, setFramework] = useState<string>('MICRO');
  const [fields, setFields] = useState<string[]>(FRAMEWORKS.MICRO.fields);
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const ideaInputRef = useRef<HTMLTextAreaElement | null>(null);
  const animateScrollToCenter = (el: HTMLElement, duration = 400) => {
    const rect = el.getBoundingClientRect();
    const startY = window.scrollY || window.pageYOffset;
    const elementCenterY = rect.top + startY + rect.height / 2;
    const viewportCenterY = startY + window.innerHeight / 2;
    const targetY = startY + (elementCenterY - viewportCenterY);
    const maxY = Math.max(0, (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight);
    const finalY = Math.max(0, Math.min(targetY, maxY));
    const start = performance.now();
    return new Promise<void>((resolve) => {
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const y = startY + (finalY - startY) * ease;
        window.scrollTo(0, y);
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  };

  const finalOutput = useMemo(() => {
    return fields.map((f) => `${f}: ${formValues[f] || suggestions[f] || ''}`.trim()).join('\n');
  }, [fields, formValues, suggestions]);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setErrorMessage(null);
    setIsLoading(true);
    setHasGenerated(false);
    const detected = analyzePromptIntent(input);
    setFramework(detected);
    const res = await fetchOptimizedPrompt(input, detected);
    if (!res || !res.success) {
      setIsLoading(false);
      setSuggestions({});
      setFormValues({});
      setErrorMessage(res && res.error ? res.error : 'We could not generate a prompt right now. Please try again.');
      return;
    }
    const data = res && res.data ? res.data : {};
    if (!data || Object.keys(data).length === 0) {
      setIsLoading(false);
      setSuggestions({});
      setFormValues({});
      setErrorMessage('We could not generate a prompt right now. Please try again.');
      return;
    }
    const keys = Object.keys(data);
    const frameworkObj = FRAMEWORKS[detected as keyof typeof FRAMEWORKS];
    const ordered = frameworkObj ? frameworkObj.fields : keys;
    setFields(ordered);
    setSuggestions(data as Record<string, string>);
    setFormValues(Object.fromEntries(ordered.map((k) => [k, (data as Record<string, string>)[k] || ''])));
    setIsLoading(false);
    setHasGenerated(true);
    const trimmed = input.trim();
    setRecentPrompts((prev) => {
      const next = [trimmed, ...prev.filter((p) => p !== trimmed)].slice(0, 10);
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('recentPrompts', JSON.stringify(next));
        }
      } catch {}
      return next;
    });
  };

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(finalOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AI Prompt Generator",
    url: "https://modernphototools.com/tools/prompt-generator",
    description:
      "Most Advanced Free AI Prompt Generator tool | Best Free ChatGPT Prompts Generator | Ultimate Free Prompt Engineering Tool. A professional AI Prompt Generator tool that helps you write perfect prompts using frameworks like COSTAR, MICRO, and ICDF.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "AI-powered prompt optimization",
      "Support for COSTAR and MICRO frameworks",
      "Instant prompt generation",
      "Completely free",
      "No registration required",
    ],
  } as const;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are the best AI image generation prompts?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The best AI image generation prompts clearly describe the subject, the desired change, and the final look of the image. In the context of photo editing, strong prompts combine an action (enhance, clean up, extend), a subject (portrait, product, landscape), style or mood, and important technical details like lighting and sharpness. The AI Prompt Generator helps you go beyond vague ideas by turning a simple description into a structured prompt that surfaces all of these elements automatically.",
        },
      },
      {
        "@type": "Question",
        name: "How to write better prompts for AI image generation?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "To write better prompts for AI image generation, you need to be specific about the task, context, and desired style. This tool guides you through frameworks like MICRO and ICDF so you do not forget key details such as audience, intention, format, and constraints. You start with a short idea, and the tool expands it into a complete, multi-line prompt that you can further refine field by field before copying it to your favorite AI model.",
        },
      },
      {
        "@type": "Question",
        name: "Where can I get free AI prompts?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You can generate unlimited free AI prompts directly with this AI Prompt Generator. There is no login or subscription barrier: you type an idea, get suggested structures, and copy a polished prompt at no cost. Combined with ModernPhotoTools blog guides and the built-in prompt examples on many tools, you have a continuously growing library of free, high-quality prompts to adapt to your own projects.",
        },
      },
      {
        "@type": "Question",
        name: "How to improve AI-generated content using prompts?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You improve AI-generated content by iterating on your prompts instead of accepting the first draft. This tool makes that loop easier: you can adjust individual fields such as context, constraints, or output format and instantly regenerate a stronger prompt. For example, if an AI image looks too generic, you can tighten the style and constraints fields here, then reuse the improved prompt to get cleaner, more on-brand results.",
        },
      },
      {
        "@type": "Question",
        name: "What are some ways to improve your prompts for AI art?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "To improve prompts for AI art, combine clear structure with rich stylistic direction. Inside this tool, you can treat the generated fields as levers: use the context and intention to describe the story behind the image, use style-related fields to define mood, color palette, and artistic influences, and use constraints to protect important details from being changed. Editing these pieces separately often leads to far more creative yet controlled AI artwork.",
        },
      },
      {
        "@type": "Question",
        name: "How to write clear and effective AI prompts?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Clear and effective AI prompts are specific, well-structured, and tailored to the model you use. This AI Prompt Generator ensures you cover instruction, context, data, format, and other key fields so your request is unambiguous. The final prompt it produces is easy to read both for you and for the AI model, which reduces confusion and makes it simpler to reuse and iterate across tools like ChatGPT, Claude, Gemini, or image-focused models.",
        },
      },
    ],
  } as const;

  const [featureImagePath, setFeatureImagePath] = useState<string | null>(null);
  const [featureAltText, setFeatureAltText] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const filename = await findToolImage('prompt-generator', 'AI Prompt Generator');
      const resolvedPath = filename ? `/images/tools images/${filename}` : null;
      if (mounted) {
        setFeatureImagePath(resolvedPath);
        setFeatureAltText(generateAltText('AI Prompt Generator'));
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setIsMounted(true);
    try {
      if (typeof window !== 'undefined') {
        const saved = window.localStorage.getItem('recentPrompts');
        if (saved) {
          const arr = JSON.parse(saved);
          if (Array.isArray(arr)) setRecentPrompts(arr);
        }
      }
    } catch {}
  }, []);

  return (
    <>
      <SEO 
        title={'AI Prompt Generator'} 
        description={'Turn a simple idea into a professional AI prompt'}
        ogImage={featureImagePath ? generateOgImageUrl(featureImagePath) : undefined}
        canonicalUrl={generateCanonicalUrl('/tools/prompt-generator')}
      />
      <SchemaJSONLD data={[webAppSchema, faqSchema]} />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">AI Prompt Generator</h1>
        <ClientOnly>
          <div className="max-w-3xl mx-auto">
            <ToolFeatureImage 
              toolId={'prompt-generator'}
              toolName={'AI Prompt Generator'}
              imagePath={featureImagePath ?? ''}
              altText={featureAltText}
            />
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your idea</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                ref={ideaInputRef}
                className="w-full border border-gray-300 rounded-md p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write a LinkedIn post about AI"
              />
              <div className="mt-4 flex items-center gap-3">
                <Button size="lg" onClick={handleGenerate} isLoading={isLoading}>Generate</Button>
                <span className="text-sm text-gray-600">Framework: {framework}</span>
              </div>
              {errorMessage && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}
            </div>

            {fields.length > 0 && suggestions && Object.keys(suggestions).length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Edit Fields</h2>
                <div className="grid grid-cols-1 gap-6">
                  {fields.map((key) => (
                    <div key={key} className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">{key}</span>
                        <div className="group relative inline-block align-middle">
                          <HelpCircle className="w-4 h-4 text-gray-500" />
                          <div className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 max-w-xs">
                            {DEFINITIONS[key] || ''}
                          </div>
                        </div>
                      </div>
                      <textarea
                        value={formValues[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fields.length > 0 && hasGenerated && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Final Output</h2>
                <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-auto text-sm whitespace-pre-wrap">{finalOutput}</pre>
                <div className="mt-4">
                  <Button variant="secondary" onClick={handleCopy} leftIcon={<ClipboardCopy className="w-4 h-4" />}>{copied ? 'Copied' : 'Copy to Clipboard'}</Button>
                </div>
                <SupportBanner />
              </div>
            )}

            {recentPrompts.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Prompts</h2>
                <ul className="space-y-3">
                  {recentPrompts.map((p, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 truncate max-w-[70%]">{p}</span>
                      <Button
                        variant="secondary"
                        onClick={async () => {
                          setInput(p);
                          const el = ideaInputRef.current;
                          if (el) {
                            await animateScrollToCenter(el, 400);
                            el.focus();
                            try { el.setSelectionRange(0, el.value.length); } catch {}
                          }
                        }}
                      >Use</Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ClientOnly>
        <PromptToolFAQ />
        <PromptGuideSection />
      </div>
    </>
  );
}

const promptFaqItems = [
  {
    id: 'best-prompts',
    question: 'What are the best AI image generation prompts?',
    answer: (
      <>
        <p className="text-gray-700">
          The best AI image generation prompts describe what is in the image, what you want to change, and how the final result should look. Short prompts like "edit this product photo" give the AI almost no direction, while structured prompts built with this tool spell out subject, style, lighting, and constraints.
        </p>
        <p className="text-gray-700">
          A typical before/after looks like this. Before: "Fix my portrait." After using the generator: "Retouch this indoor portrait photo, soften skin while keeping natural pores, brighten the eyes slightly, reduce dark circles, keep the original background, and avoid changing the face shape or expression." The second version is far easier for any AI model to follow.
        </p>
      </>
    ),
  },
  {
    id: 'write-better',
    question: 'How to write better prompts for AI image generation?',
    answer: (
      <>
        <p className="text-gray-700">
          To write better prompts, start with a simple idea in the input box and let the tool detect the right framework for you. It will break your request into fields like Instruction, Context, Data, and Format so you can fill in missing information instead of guessing what the AI needs.
        </p>
        <p className="text-gray-700">
          For example, you might type "improve my product photo for Amazon." The tool transforms this into editable pieces and suggests details such as background color, lighting style, and output format. By tweaking those fields, you move from a vague sentence to a precise, conversion-focused prompt tailored for AI editing or generation tools.
        </p>
      </>
    ),
  },
  {
    id: 'free-prompts',
    question: 'Where can I get free AI prompts?',
    answer: (
      <>
        <p className="text-gray-700">
          This AI Prompt Generator itself is a free way to create unlimited high-quality prompts. Every time you enter an idea and generate suggestions, you are effectively building your own custom prompt library that you can save, reuse, or adapt for future projects.
        </p>
        <p className="text-gray-700">
          You can also combine this tool with ModernPhotoTools editing pages, many of which include example prompts for portraits, products, landscapes, and creative edits. Start with one of those examples, drop it into the generator, and enhance it further using the structured fields.
        </p>
      </>
    ),
  },
  {
    id: 'improve-content',
    question: 'How to improve AI-generated content using prompts?',
    answer: (
      <>
        <p className="text-gray-700">
          Improving AI-generated images is an iterative process. After you see a result, identify what is wrong or missing and update only the relevant parts of your prompt: maybe the lighting is too flat, the background is distracting, or the style is not strong enough.
        </p>
        <p className="text-gray-700">
          Within this tool, you can adjust individual fields like Context or Constraints without rewriting everything. For example, you might tighten the constraints to say "keep the original composition and colors, but remove clutter on the desk and sharpen the main subject only." Copy the refined prompt back into your image model, and you will generally see a clear quality jump.
        </p>
      </>
    ),
  },
  {
    id: 'improve-art',
    question: 'What are some ways to improve your prompts for AI art?',
    answer: (
      <>
        <p className="text-gray-700">
          For AI art, combine the structured approach of this generator with bold stylistic direction. Use fields related to mood, audience, and output to describe the story you want the image to tell, then push further with details about color palette, camera angle, and artistic influences.
        </p>
        <p className="text-gray-700">
          A practical pattern is to start with a descriptive base prompt in the tool, then enrich the style-related fields with phrases like "cinematic lighting," "soft pastel color scheme," or "inspired by studio fashion editorials." This produces prompts that are both creatively rich and technically clear.
        </p>
      </>
    ),
  },
  {
    id: 'clear-prompts',
    question: 'How to write clear and effective AI prompts?',
    answer: (
      <>
        <p className="text-gray-700">
          Clear prompts avoid ambiguity and unnecessary complexity. Use the generator to separate your idea into smaller pieces so that each field has a single purpose: one field for the main instruction, one for context, one for style, and so on. This makes the final prompt easier for an AI model to interpret reliably.
        </p>
        <p className="text-gray-700">
          A helpful habit is to read the Final Output section as if you were the AI: would you know exactly what to do, what to keep, and what to avoid? If not, edit the relevant fields and generate a cleaner version until the instructions feel obvious. The built-in structure of this tool is designed to nudge you toward that level of clarity.
        </p>
      </>
    ),
  },
] as const;

function PromptToolFAQ() {
  const [openId, setOpenId] = useState<string | null>(promptFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  const handleBackToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="mt-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">Frequently Asked Questions</h2>
        <p className="text-center text-gray-600 mb-8">
          Learn how to use the AI Prompt Generator to turn rough ideas into polished, high-performing prompts for image generation and photo editing.
        </p>
        <div className="space-y-4">
          {promptFaqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="bg-white rounded-lg shadow">
                <button
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                    <span className="font-semibold text-gray-900">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 md:px-6 pb-4 space-y-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleBackToTop}
            className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50"
          >
            Back to Top
          </button>
        </div>
      </div>
    </section>
  );
}

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => { setHasMounted(true); }, []);
  if (!hasMounted) return null;
  return <>{children}</>;
}
