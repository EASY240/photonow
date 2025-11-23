import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { HelpCircle, ClipboardCopy } from 'lucide-react';
import Button from '../components/ui/Button';
import { FRAMEWORKS, analyzePromptIntent } from '../utils/promptAnalysis';
import { fetchOptimizedPrompt } from '../utils/api';
import blogRaw from '../../blog.txt?raw';
import PromptGuideSection from '../components/PromptGuideSection';
import ToolFeatureImage from '../components/ui/ToolFeatureImage';
import { findToolImage, generateAltText } from '../utils/imageMapper';
import SEO from '../components/ui/SEO';
import { generateCanonicalUrl, generateOgImageUrl } from '../utils/siteConfig';

function getDefinition(field: string): string {
  const pattern = new RegExp(`${field}\\s*:\\s*([^\\n]+)`, 'i');
  const match = blogRaw.match(pattern);
  if (match && match[1]) return match[1].trim();
  const fallback: Record<string, string> = {
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
  return fallback[field] || '';
}

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

  const finalOutput = useMemo(() => {
    return fields.map((f) => `${f}: ${formValues[f] || suggestions[f] || ''}`.trim()).join('\n');
  }, [fields, formValues, suggestions]);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    const detected = analyzePromptIntent(input);
    setFramework(detected);
    const res = await fetchOptimizedPrompt(input, detected);
    const data = res && res.data ? res.data : {};
    const keys = Object.keys(data);
    const frameworkObj = FRAMEWORKS[detected as keyof typeof FRAMEWORKS];
    const ordered = frameworkObj ? frameworkObj.fields : keys;
    setFields(ordered);
    setSuggestions(data as Record<string, string>);
    setFormValues(Object.fromEntries(ordered.map((k) => [k, (data as Record<string, string>)[k] || ''])));
    setIsLoading(false);
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
        name: "What is the AI Prompt Generator?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "A free web tool that turns a simple idea into a professional prompt using frameworks like COSTAR, MICRO, ICDF, and RCREOC. It analyzes intent, suggests structured fields, and assembles a polished prompt ready for ChatGPT, Claude, or Gemini.",
        },
      },
      {
        "@type": "Question",
        name: "How does the AI Prompt Generator work?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You enter a short idea; the analyzer detects the best framework; the backend uses Bytez with GPT-4o to generate structured suggestions; the UI lets you refine each field and outputs a final prompt you can copy.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use the tool for free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. It is completely free and requires no registration.",
        },
      },
      {
        "@type": "Question",
        name: "What use cases does the tool support?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Marketing emails and ads (COSTAR), content scripts and posts (MICRO), data analysis and reporting (ICDF), expert reviews and critiques (RCREOC), plus general prompt polishing for chat models.",
        },
      },
      {
        "@type": "Question",
        name: "How can I ensure high-quality Prompts?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Provide clear context and goals, include relevant data or constraints, select the right framework, and refine the suggested fields for accuracy before copying the final prompt.",
        },
      },
      {
        "@type": "Question",
        name: "Do the generated Prompts support all AI models?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The tool supports popular AI models like ChatGPT, Claude, and Gemini, and is adaptable to most other models. You may need slight adjustments to fit specific model requirements.",
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

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-500">Loading Prompt Tool...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <SEO 
        title={'AI Prompt Generator'} 
        description={'Turn a simple idea into a professional AI prompt'}
        ogImage={featureImagePath ? generateOgImageUrl(featureImagePath) : undefined}
        canonicalUrl={generateCanonicalUrl('/tools/prompt-generator')}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">AI Prompt Generator</h1>
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
            className="w-full border border-gray-300 rounded-md p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a LinkedIn post about AI"
          />
          <div className="mt-4 flex items-center gap-3">
            <Button size="lg" onClick={handleGenerate} isLoading={isLoading}>Generate</Button>
            <span className="text-sm text-gray-600">Framework: {framework}</span>
          </div>
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
                        {getDefinition(key)}
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

        {fields.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Final Output</h2>
            <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-auto text-sm whitespace-pre-wrap">{finalOutput}</pre>
            <div className="mt-4">
              <Button variant="secondary" onClick={handleCopy} leftIcon={<ClipboardCopy className="w-4 h-4" />}>{copied ? 'Copied' : 'Copy to Clipboard'}</Button>
            </div>
          </div>
        )}

        {isMounted && recentPrompts.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Prompts</h2>
            <ul className="space-y-3">
              {recentPrompts.map((p, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate max-w-[70%]">{p}</span>
                  <Button variant="secondary" onClick={() => setInput(p)}>Use</Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <PromptGuideSection />
    </div>
  );
}