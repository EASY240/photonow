import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Download, Loader, Brush, XCircle, HelpCircle, X, ChevronDown, Sparkles, ShoppingBag, Car, Home, KeyIcon, CameraIcon, Gem, Atom, Users, Gift, Briefcase } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { Helmet } from 'react-helmet-async';
import Button from '../components/ui/Button';
import ImageDropzone from '../components/ui/ImageDropzone';
import PromptsGuide from '../components/ui/PromptsGuide';
import ToolRecommendations from '../components/ui/ToolRecommendations';
import ToolFeatureImage from '../components/ui/ToolFeatureImage';
import ImageComparisonSlider from '../components/ui/ImageComparisonSlider';
import { tools } from '../data/tools';
import { findToolImage, generateAltText } from '../utils/imageMapper';
import { processImage, uploadImageAndGetUrl, startCleanupJob, startWatermarkRemoverJob, startExpandJob, startReplaceJob, startCartoonJob, startCaricatureJob, startAvatarJob, startProductPhotoshootJob, startBackgroundGeneratorJob, startImageGeneratorJob, startPortraitJob, startFaceSwapJob, startOutfitJob, startImageToImageJob, startSketchToImageJob, startHairstyleJob, startUpscaleJob, startAIFilterJob, checkOrderStatus, convertUrlToBlob, pollJobUntilComplete, pollWatermarkJobUntilComplete, pollV1JobUntilComplete } from '../utils/api';
import type { ImageFile, ProcessedImage, Tool, FaceSwapStyle } from '../types';
import { maleCartoonStyles, femaleCartoonStyles } from '../constants/cartoonStyles';
import { caricatureStyles, Style } from '../constants/caricatureStyles';
import { avatarStyles, AvatarStyle } from '../constants/avatarStyles';
import { productStyles, suggestedPrompts, type ProductStyle } from '../constants/productStyles';
import { imageResolutions, suggestedPrompts as imageGeneratorPrompts, type ImageResolution } from '../constants/imageGeneratorOptions';
import { portraitStyles, suggestedPortraitPrompts, type PortraitStyle } from '../constants/portraitStyles';
import { faceSwapStyles } from '../constants/faceSwapStyles';
import { presetOutfitStyles, suggestedOutfitPrompts, type OutfitStyle } from '../constants/outfitStyles';
import { hairstylePresets } from '../constants/hairstylePrompts';
import { aiFilterStyles, filterCategories, type AIFilterStyle } from '../constants/filterStyles';
import { generateCanonicalUrl, generateOgImageUrl } from '../utils/siteConfig';
import { scrollToResultContainer, scrollToGenerateButton, debounce } from '../utils/scrollUtils';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import SupportBanner from '../components/ui/SupportBanner';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SectionErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('Error in ToolPage section', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          Something went wrong while loading this section.
        </div>
      );
    }

    return this.props.children;
  }
}

function CartoonHeroSection() {
  const [activePrompt, setActivePrompt] = useState<'prompt1' | 'prompt2' | 'prompt3'>('prompt3');

  const prompts = {
    prompt1: {
      label: 'Prompt 1:',
      text: 'Fredrickson character, cartoon look',
      imageSrc: '/images/blog/Fredrickson character, cartoon look.jpg'
    },
    prompt2: {
      label: 'Prompt 2:',
      text: 'Moanna character, cartoon',
      imageSrc: '/images/blog/Moanna character, cartoon look.jpg'
    },
    prompt3: {
      label: 'Prompt 3:',
      text: 'Russel, realistic character',
      imageSrc: '/images/blog/Russel, realistic character.jpg'
    }
  } as const;

  const current = prompts[activePrompt];

  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Convert yourself into a cartoon character via prompt
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Expand your creativity by turning yourself into a custom cartoon character using simple text prompts. Describe the look you want and let AI draw the rest.
            </p>
            <div className="mt-6 space-y-3">
              {(['prompt1', 'prompt2', 'prompt3'] as const).map((key) => {
                const prompt = prompts[key];
                const isActive = activePrompt === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActivePrompt(key)}
                    className={`w-full flex items-center justify-start rounded-2xl border-2 px-3 py-3 text-left transition-colors ${
                      isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 text-xs font-semibold text-blue-700 px-3 py-2 mr-3">
                      {prompt.label}
                    </div>
                    <div className="text-sm md:text-base text-gray-700">{prompt.text}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-full max-w-md">
              <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
                <img
                  src={current.imageSrc}
                  alt="AI-generated cartoon character example"
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundHeroSection() {
  const [activeVariant, setActiveVariant] = useState<'variant1' | 'variant2' | 'variant3'>('variant1');

  const variants = {
    variant1: {
      label: 'Example 1:',
      text: 'Insta photos with unique backgrounds',
      imageSrc: '/images/blog/bg-insta-unique-placeholder.jpg'
    },
    variant2: {
      label: 'Example 2:',
      text: 'Backgrounds for fashion photoshoots',
      imageSrc: '/images/blog/bg-fashion-photoshoot-placeholder.jpg'
    },
    variant3: {
      label: 'Example 3:',
      text: 'Backgrounds for professional portraits',
      imageSrc: '/images/blog/bg-professional-portraits-placeholder.jpg'
    }
  } as const;

  const current = variants[activeVariant];

  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Generate new AI backgrounds for any photo
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Turn ordinary images into scroll-stopping visuals by swapping the background with AI. Pick a style you like, describe the scene, and let the background generator handle the rest.
            </p>
            <div className="mt-6 space-y-3">
              {(['variant1', 'variant2', 'variant3'] as const).map((key) => {
                const variant = variants[key];
                const isActive = activeVariant === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveVariant(key)}
                    className={`w-full flex items-center justify-start rounded-2xl border-2 px-3 py-3 text-left transition-colors ${
                      isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 text-xs font-semibold text-blue-700 px-3 py-2 mr-3">
                      {variant.label}
                    </div>
                    <div className="text-sm md:text-base text-gray-700">{variant.text}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-full max-w-md">
              <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
                <img
                  src={current.imageSrc}
                  alt="AI-generated background example"
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterHeroSection() {
  const [activePrompt, setActivePrompt] = useState<'prompt1' | 'prompt2' | 'prompt3'>('prompt1');

  const prompts = {
    prompt1: {
      label: 'Prompt 1:',
      text: 'Japanese zen filter',
      imageSrc: '/images/blog/Japanese zen filter.jpg',
      imageAlt: 'Photo styled with a calm Japanese zen inspired AI filter'
    },
    prompt2: {
      label: 'Prompt 2:',
      text: 'Art deco filter',
      imageSrc: '/images/blog/AI filter art deco.jpg',
      imageAlt: 'Portrait enhanced with a bold geometric art deco AI filter'
    },
    prompt3: {
      label: 'Prompt 3:',
      text: 'Bohemian chic filter',
      imageSrc: '/images/blog/AI filter bohemian chic.jpg',
      imageAlt: 'Image transformed with a colorful bohemian chic AI filter'
    }
  } as const;

  const current = prompts[activePrompt];

  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Create imaginative filters with simple prompts
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Describe the mood, era, or art style you have in mind and let the AI Filter tool
              design a custom look for your photo. Turn your ideas into trendy color grades and
              artistic effects instead of scrolling through generic presets.
            </p>
            <div className="mt-6 space-y-3">
              {(['prompt1', 'prompt2', 'prompt3'] as const).map((key) => {
                const prompt = prompts[key];
                const isActive = activePrompt === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActivePrompt(key)}
                    className={`w-full flex items-center justify-start rounded-2xl border-2 px-3 py-3 text-left transition-colors ${
                      isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 text-xs font-semibold text-blue-700 px-3 py-2 mr-3">
                      {prompt.label}
                    </div>
                    <div className="text-sm md:text-base text-gray-700">{prompt.text}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-full max-w-md">
              <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
                <img
                  src={current.imageSrc}
                  alt={current.imageAlt}
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CaricatureHeroSection() {
  const [activePrompt, setActivePrompt] = useState<'prompt1' | 'prompt2' | 'prompt3'>('prompt1');

  const prompts = {
    prompt1: {
      label: 'Prompt 1:',
      text: 'Doctor caricature, big smile, exaggerated features',
      imageSrc: '/images/blog/Doctor caricature.jpg'
    },
    prompt2: {
      label: 'Prompt 2:',
      text: 'Rockstar caricature, bold outlines, dramatic lighting',
      imageSrc: '/images/blog/Rockstar caricature.jpg'
    },
    prompt3: {
      label: 'Prompt 3:',
      text: 'Architect caricature, playful details, vibrant colors',
      imageSrc: '/images/blog/Architect caricature.jpg'
    }
  } as const;

  const current = prompts[activePrompt];

  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Turn photos into expressive caricatures with prompts
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Use the AI Caricature tool to transform regular portraits into fun, stylized caricatures. Choose a mood and describe the style in a short prompt, then let AI reveal a new side of each face.
            </p>
            <div className="mt-6 space-y-3">
              {(['prompt1', 'prompt2', 'prompt3'] as const).map((key) => {
                const prompt = prompts[key];
                const isActive = activePrompt === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActivePrompt(key)}
                    className={`w-full flex items-center justify-start rounded-2xl border-2 px-3 py-3 text-left transition-colors ${
                      isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 text-xs font-semibold text-blue-700 px-3 py-2 mr-3">
                      {prompt.label}
                    </div>
                    <div className="text-sm md:text-base text-gray-700">{prompt.text}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-full max-w-md">
              <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
                <img
                  src={current.imageSrc}
                  alt="AI-generated caricature example"
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PortraitHeroSection() {
  const [activePrompt, setActivePrompt] = useState<'prompt1' | 'prompt2' | 'prompt3'>('prompt1');

  const prompts = {
    prompt1: {
      label: 'Prompt 1:',
      text: 'Soft daylight portrait, neutral background, natural skin tones',
      imageSrc: '/images/blog/Soft daylight portrait.jpg'
    },
    prompt2: {
      label: 'Prompt 2:',
      text: 'Studio headshot, dramatic lighting, cinematic color grading',
      imageSrc: '/images/blog/Studio headshot portrait.jpg'
    },
    prompt3: {
      label: 'Prompt 3:',
      text: 'Outdoor lifestyle portrait, warm sunset light, shallow depth of field',
      imageSrc: '/images/blog/Outdoor lifestyle portrait.jpg'
    }
  } as const;

  const current = prompts[activePrompt];

  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Turn simple photos into AI-enhanced portraits
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Use the AI Portrait tool to upgrade everyday photos into polished portraits with professional lighting, color grading, and styling. Start from a clear face photo and guide the look with short prompts.
            </p>
            <div className="mt-6 space-y-3">
              {(['prompt1', 'prompt2', 'prompt3'] as const).map((key) => {
                const prompt = prompts[key];
                const isActive = activePrompt === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActivePrompt(key)}
                    className={`w-full flex items-center justify-start rounded-2xl border-2 px-3 py-3 text-left transition-colors ${
                      isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 text-xs font-semibold text-blue-700 px-3 py-2 mr-3">
                      {prompt.label}
                    </div>
                    <div className="text-sm md:text-base text-gray-700">{prompt.text}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-full max-w-md">
              <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
                <img
                  src={current.imageSrc}
                  alt="AI-generated portrait example"
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReplaceHeroSection() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Replace: effortlessly substitute items in images using prompts
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Highlight the area you want to change, describe what should appear instead, and let AI Replace generate a realistic swap that blends naturally with the rest of the photo.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-black">
            <video
              src="/videos/AI-Replace_Tool page-Video.mp4"
              autoPlay
              loop
              playsInline
              muted
              preload="none"
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpandHeroSection() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Uncrop and enlarge your images using AI Photo Expander
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Select your favorite picture and see it transform—adding more sky, more land, and everything else that makes it unique. Use AI technology to extend images beyond your original capture.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-black">
            <video
              src="/videos/AI_Expand_video_tool-page.mp4"
              autoPlay
              loop
              playsInline
              muted
              preload="none"
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

function WatermarkHeroSection() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Free AI watermark remover for all your photos
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Clean up logos, text, and proof stamps in a single click. The AI Watermark Remover automatically finds and erases marks for you, so you do not need to trace shapes or brush over pixels manually. Use it online for free whenever you need a polished, ready-to-share image.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-black">
            <video
              src="/videos/Remove Watermark_video-tool-page.mp4"
              autoPlay
              loop
              playsInline
              muted
              preload="none"
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageToImageHeroSection() {
  return (
    <section className="mb-10">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    Create AI images from any photo
                  </h2>
                  <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                    Transform a simple photo into a polished AI image using ModernPhotoTools image-to-image generator.
                Combine your input image with text prompts and strength controls to decide how boldly the AI
                reimagines the style, colors, and mood of your scene.</p>
                </div>
                <div className="max-w-3xl mx-auto">
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-black">
                    <video
                      src="/videos/ai-image-to-image_video tool page.mp4"
                      autoPlay
                      loop
                      playsInline
                      muted
                      preload="none"
                      className="w-full h-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </section>
  );
}

function SketchToImageHeroSection() {
  const useCases = [
    {
      id: 'fashion-design',
      eyebrow: 'Fashion designing',
      title: 'Visualize garments from rough fashion sketches',
      description:
        'Transform hand-drawn silhouettes into polished outfit visuals you can use for lookbooks, client pitches, and social previews. Explore fabrics, colors, and styling options without sewing a single sample.',
      icon: <Sparkles className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'interior-architecture',
      eyebrow: 'Interior and architectural design',
      title: 'Bring interior and architectural drafts to life',
      description:
        'Upload floor plans, elevations, or room sketches and turn them into realistic concept images. Test lighting, materials, and furniture layouts so clients can understand the space long before construction begins.',
      icon: <Home className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'product-prototyping',
      eyebrow: 'Product prototyping',
      title: 'Prototype products without complex 3D software',
      description:
        'Convert quick product doodles into clean, presentation-ready renders. Use sketch-to-image AI to explore form, finish, and context shots for packaging, gadgets, and consumer goods before investing in physical prototypes.',
      icon: <Briefcase className="w-5 h-5 text-blue-600" />
    }
  ] as const;

  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Turn rough sketches into production-ready visuals
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the AI Sketch to Image tool to move from quick ideas on paper to detailed images for
            fashion, interiors, and product design—all in a few uploads and prompts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col h-full"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                {item.icon}
                <span>{item.eyebrow}</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface RemoveBgZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
}

const removeBgZigZagSections: RemoveBgZigZagSection[] = [
  {
    id: 'portraits',
    eyebrow: 'Portraits',
    title: 'Take the background out of the picture automatically',
    description:
      'Turn busy or cluttered portraits into clean, professional cutouts in seconds. The AI finds the subject, handles hair and edges, and delivers ready-to-use PNGs for social profiles, avatars, and headshots.',
    imageSrc: '/images/blog/background out of the picture automatically.jpg',
    imageAlt: 'Portrait photo with the background removed to a clean backdrop',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'products',
    eyebrow: 'Ecommerce products',
    title: 'Create studio-style product photos without a studio',
    description:
      'Remove distracting backgrounds from product shots and place them on clean, on-brand canvases that are ready for marketplaces, ads, and catalogs.',
    imageSrc: '/images/blog/product photos without a studio.jpg',
    imageAlt: 'Product image prepared with a clean background for online listings',
    icon: <ShoppingBag className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'logo',
    eyebrow: 'Logos',
    title: 'Make Logo Transparent With Modern Transparent Image Maker',
    description:
      'Logos and text with transparent background offer a versatile and professional aesthetic, allowing seamless integration into various marketing materials, websites, and promotional content. With this tools precision you can ensures that intricate details of the logo are preserved.',
    imageSrc: '/images/blog/Make Logo Transparent.jpg',
    imageAlt: 'Make Logo Transparent With Modern Transparent Image Maker',
    icon: <KeyIcon className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'real-estate',
    eyebrow: 'Real estate and interiors',
    title: 'Highlight the property, not the distractions',
    description:
      'Remove signs, mismatched decor, and visual noise from room photos so the space feels brighter, clearer, and easier to browse on listing pages.',
    imageSrc: '/images/blog/Real estate and interiors.jpg',
    imageAlt: 'Interior photo cleaned up with a simplified background',
    icon: <Home className="w-6 h-6 text-blue-600" />
  }
];

interface WatermarkZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const watermarkZigZagSections: WatermarkZigZagSection[] = [
  {
    id: 'clean-removal',
    eyebrow: 'Automatic cleanup',
    title: 'Erase watermarks and logos so they blend away',
    description:
      'Use AI to strip out visible logos, text stamps, and copyright labels without drawing masks by hand. The model detects the mark, separates it from the rest of the image, and rebuilds the area using nearby pixels so the edit looks natural at a glance.',
    imageSrc: '/images/blog/Erase watermarks and logos so they blend away.jpg',
    imageAlt: 'Example image cleaned with an AI watermark remover',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Handles simple text watermarks as well as more complex logo graphics.',
      'Fills the cleared region based on surrounding colors and textures.',
      'Works on common formats like JPG and PNG used for everyday photos.'
    ]
  },
  {
    id: 'who-it-is-for',
    eyebrow: 'For work and personal use',
    title: 'A single watermark remover for many kinds of users',
    description:
      'Whether you manage content for a brand or simply want cleaner personal images, the tool is designed to fit into everyday workflows without extra software.',
    imageSrc: '/images/blog/single watermark remover for many kinds of users.jpg',
    imageAlt: 'Professionals and casual users using a watermark remover tool',
    icon: <Briefcase className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Photographers and designers can tidy up previews or retire old watermarks from their own archives.',
      'Businesses can clean licensed images after purchase so final creatives stay on-brand.',
      'Content creators can remove marks from approved assets before posting on social platforms.',
      'Students and teachers can prepare watermark-free visuals for presentations when usage rights allow.',
      'Everyday users can clear proof labels added by mobile editing apps on their personal photos.'
    ]
  },
  {
    id: 'image-types',
    eyebrow: 'Flexible image types',
    title: 'Remove watermarks from many kinds of visuals',
    description:
      'Apply the AI Watermark Remover to a wide range of images used across the web, social media, and marketing materials.',
    imageSrc: '/images/blog/Remove watermarks from many kinds of visuals.jpg',
    imageAlt: 'Different image types prepared with watermark removal',
    icon: <CameraIcon className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Stock imagery that needs to be cleaned after you obtain the proper license.',
      'Product shots where old logos or labels distract from the item itself.',
      'Event photography from weddings, concerts, and festivals with heavy proof marks.',
      'Property and interior photos where agency overlays hide important details.',
      'Mockups that include sample watermarks before you add your real design.',
      'Editorial and educational visuals that must look clean and readable.'
    ]
  },
  {
    id: 'benefits',
    eyebrow: 'Why use this tool',
    title: 'A fast, reliable AI proof remover',
    description:
      'Combine automatic detection with high-quality image reconstruction to get watermark-free results you can confidently share or publish.',
    imageSrc: '/images/blog/fast reliable AI proof remover.jpg',
    imageAlt: 'High quality result after AI proof removal',
    icon: <Gem className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Free to start using directly in your browser.',
      'Quick, one-click workflow with no complex settings required.',
      'Processing designed with modern privacy standards in mind.',
      'Outputs stay sharp so your image does not look heavily edited.',
      'Pairs well with tools like AI Cleanup, AI Replace, and AI Image Upscaler for deeper edits.'
    ]
  }
];

interface FilterZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
}

const filterZigZagSections: FilterZigZagSection[] = [
  {
    id: 'sketch-painting',
    eyebrow: 'Sketches and paintings',
    title: 'Turn photos into sketches and paintings with AI filters',
    description:
      'Use the AI Filter tool to transform your images into detailed sketches or rich painterly artwork. Experiment with pencil-style, ink, and cross-hatching looks for line-focused results, or apply painting filters that add color, depth, and texture for a gallery-ready finish.',
    imageSrc: '/images/blog/AI filter sketches and paintings.jpg',
    imageAlt: 'Photo transformed into a pencil sketch and painted artwork using AI filters',
    icon: <Brush className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'anime-manga',
    eyebrow: 'Anime and manga',
    title: 'Explore anime and manga-inspired AI photo filters',
    description:
      'Apply bold colors, stylized outlines, and cel-shaded lighting to turn your photos into anime or manga-style scenes. Combine ready-made filters with your own prompts to live out popular character aesthetics and create vibrant comic-style artwork from everyday images.',
    imageSrc: '/images/blog/AI filter anime and manga.jpg',
    imageAlt: 'Portrait converted into anime and manga-style art with AI filters',
    icon: <Atom className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'free-filters',
    eyebrow: 'Free filters',
    title: 'Free AI filters for every kind of photo',
    description:
      'Browse a range of trending AI filters and apply them in a single click. Quickly add creative effects to portraits, products, and social content without complex manual editing or paid desktop software.',
    imageSrc: '/images/blog/AI filter free effects.jpg',
    imageAlt: 'Various photos enhanced with different AI filter styles',
    icon: <Gift className="w-6 h-6 text-blue-600" />
  }
];

interface AvatarZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
}

const avatarZigZagSections: AvatarZigZagSection[] = [
  {
    id: 'best-generator',
    eyebrow: 'Top-rated',
    title: 'The best AI avatar generator website',
    description:
      'Know no limits when it comes to creating avatars. With the Modern-powered AI avatar generator inside Modern PhotoTools, you can explore a growing library of ready-made styles, from fantasy and anime to cartoon and 3D looks. Each style is tuned for accuracy and realism so your avatar still feels like you, just more stylized.',
    imageSrc: '/images/blog/The best AI avatar generator website.jpg',
    imageAlt: 'Example of different AI avatar styles generated from one face',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'unlimited-avatars',
    eyebrow: 'Efficient',
    title: 'Make unlimited avatars from a single photo upload',
    description:
      'Upload one high-quality photo of your face and generate avatars in multiple styles without repeating the upload. Modern AI studies your features once, then lets you remix the look across professional, creative, and playful presets so you can experiment quickly without extra effort.',
    imageSrc: '/images/blog/Make unlimited avatars from a single photo upload.jpg',
    imageAlt: 'Multiple AI avatar variations created from a single portrait',
    icon: <CameraIcon className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'gaming-social',
    eyebrow: 'Versatile',
    title: 'Avatar maker for gaming, chat rooms, and social media',
    description:
      'Turn your face into a recognizable avatar for online games, chat rooms, forums, or social platforms. Use AI-generated avatars to give your profile a consistent visual identity, stand out in crowded feeds, and share a version of yourself that feels fun but still authentic.',
    imageSrc: '/images/blog/Avatar maker for gaming, chat rooms, and social media.jpg',
    imageAlt: 'AI avatar examples used across gaming and social platforms',
    icon: <Users className="w-6 h-6 text-blue-600" />
  }
];

interface PortraitZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const portraitZigZagSections: PortraitZigZagSection[] = [
  {
    id: 'professional-headshots',
    eyebrow: 'Professional',
    title: 'Create polished AI portraits for profiles and portfolios',
    description:
      'Start from a clear face photo and generate portraits that look like they were shot in a studio. Adjust lighting, framing, and background while keeping the person recognisable and true to life.',
    imageSrc: '/images/blog/AI portraits for profiles and portfolios.jpg',
    imageAlt: 'AI-generated professional portrait headshot example',
    icon: <CameraIcon className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Upgrade casual photos into clean, professional headshots.',
      'Match different industries with subtle style changes.',
      'Keep natural skin tones and realistic facial features.'
    ]
  },
  {
    id: 'creative-looks',
    eyebrow: 'Creative looks',
    title: 'Explore artistic portrait styles in a few prompts',
    description:
      'Experiment with cinematic, editorial, and painterly portrait styles without hiring a full creative team. Use short prompts to try new moods, color palettes, and compositions around the same face.',
    imageSrc: '/images/blog/artistic portrait styles in a few prompts.jpg',
    imageAlt: 'AI-generated artistic portrait variations',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Test different lighting setups such as golden hour or film noir.',
      'Switch between minimal, bold, or textured backgrounds.',
      'Create cohesive sets of portraits for campaigns or series.'
    ]
  },
  {
    id: 'brand-ready',
    eyebrow: 'Brand-ready',
    title: 'Portraits that fit your brand identity',
    description:
      'Keep portraits aligned with your visual identity by reusing the same prompts and settings across your team. Generate consistent photos for websites, pitch decks, and social media profiles.',
    imageSrc: '/images/blog/Portraits that fit your brand identity.jpg',
    imageAlt: 'AI-generated portraits used across a brand touchpoints',
    icon: <Gem className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Create matching portrait sets for teams and collaborators.',
      'Adapt framing and crop to different platforms and layouts.',
      'Quickly refresh portraits as your style or branding evolves.'
    ]
  }
];

interface OutfitZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
}

const outfitZigZagSections: OutfitZigZagSection[] = [
  {
    id: 'virtual-try-on',
    eyebrow: 'Virtual try-on',
    title: 'AI outfit generator for virtual try-on in photos',
    description:
      'Use Modern’s AI clothes changer to preview new looks on your existing photos. Upload one image, pick a one-click outfit style, and try everything from casual streetwear to red-carpet looks without changing in real life.',
    imageSrc: '/images/blog/AI outfit generator.jpg',
    imageAlt: 'Photo showing a virtual AI outfit try-on on a person',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'festive-outfits',
    eyebrow: 'Festive outfits',
    title: 'Get ready for the holidays with AI festive looks',
    description:
      'Dress up for Halloween, Christmas, birthdays, and cultural celebrations using AI-generated outfits instead of shopping and manual editing. In a few clicks, turn everyday photos into festive portraits with themed clothing and accessories.',
    imageSrc: '/images/blog/holidays with AI festive looks.jpg',
    imageAlt: 'AI-generated festive outfits applied to a portrait',
    icon: <Gift className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'corporate-outfits',
    eyebrow: 'Professional style',
    title: 'Explore corporate looks with an AI formal outfit editor',
    description:
      'Transform casual photos into polished professional portraits by trying on suits, blazers, and formal dresses. Modern’s AI outfit creator builds clean, office-ready looks from a single upload so you can update headshots and profile photos in minutes.',
    imageSrc: '/images/blog/AI formal outfit editor.jpg',
    imageAlt: 'AI-generated formal outfit applied for a professional portrait',
    icon: <Briefcase className="w-6 h-6 text-blue-600" />
  }
];

interface HairstyleZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const hairstyleZigZagSections: HairstyleZigZagSection[] = [
  {
    id: 'scissor-free-transformation',
    eyebrow: 'Virtual hairstyle try-on',
    title: 'Transform your look without a single haircut',
    description:
      'Use ModernPhotoTools’ AI hairstyle generator to explore bold hair changes with zero commitment. Upload one clear photo, pick a preset style, and preview short, long, curly, or textured looks that are mapped precisely to your face.',
    imageSrc:
      '/images/blog/Transform your look without a single haircut.jpg',
    imageAlt: 'AI-generated long wavy hairstyle applied virtually to a portrait',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'celebrity-hairstyles',
    eyebrow: 'Celebrity-inspired looks',
    title: 'See yourself in celebrity-style AI hairstyles',
    description:
      'Try hairstyles inspired by icons in seconds. From classic silhouettes to modern trends, combine your photo with AI to see how signature cuts, fringes, and volumes would look on you before you ever book a salon visit.',
    imageSrc:
      '/images/blog/See yourself in celebrity-style AI hairstyles.jpg',
    imageAlt: 'AI preview of a sharp taper fade inspired by celebrity styles',
    icon: <Gem className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'creative-use-cases',
    eyebrow: 'Everyday uses',
    title: 'An AI hairstyle changer for real-life decisions',
    description:
      'Plan hair changes, content, and client looks with practical AI previews you can trust.',
    imageSrc:
      '/images/blog/AI hairstyle changer for real-life decisions.jpg',
    imageAlt: 'AI-generated space bun hairstyle preview on a portrait',
    icon: <Home className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Before salon visits: compare cuts, lengths, and textures before committing.',
      'Match hairstyles to face shape so cuts suit round, oval, square, or long faces.',
      'Experiment with mustache and beard combinations using coordinated hair previews.',
      'Plan looks for weddings, parties, shoots, and everyday styling with virtual trials.',
      'Support wig, barbershop, and salon consultations by sharing realistic hairstyle renders.'
    ]
  }
];

interface ImageUpscalerZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const imageUpscalerZigZagSections: ImageUpscalerZigZagSection[] = [
  {
    id: 'sharper-detail',
    eyebrow: 'Sharper images',
    title: 'Get higher-quality, sharper, more detailed images',
    description:
      'Turn soft, low-resolution photos into crisp, high-resolution images in just a few seconds. The AI Image Upscaler boosts resolution while preserving important details, improving edges, textures, and patterns so results look clean instead of over-smoothed, even on low-light or compressed images.',
    imageSrc: '/images/blog/AI upscaler sharper images.jpg',
    imageAlt: 'Portrait photo upscaled with sharper details and reduced noise',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'zoom-without-pixels',
    eyebrow: 'Clean zoom',
    title: 'Zoom in without pixelation',
    description:
      'When you zoom into a small photo, blocks and jagged pixels usually appear because there are not enough original pixels to fill the space. The AI upsizer intelligently generates additional pixels between what is already there so close-up crops stay clear and readable instead of breaking apart.',
    imageSrc: '/images/blog/AI upscaler zoom without pixelation.jpg',
    imageAlt: 'Zoomed-in image upscaled to remove blocky pixels',
    icon: <CameraIcon className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'why-use-upscaler',
    eyebrow: 'Everyday uses',
    title: 'Why use the AI Image Upscaler?',
    description:
      'Use AI upscaling whenever you need more resolution, cleaner details, or larger exports without re-shooting the original photo.',
    imageSrc: '/images/blog/AI upscaler use cases.jpg',
    imageAlt: 'Collage of different photos enhanced with AI upscaling',
    icon: <Gem className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Create 4K-ready wallpapers and screensavers from everyday photos.',
      'Recover small or blurry text so screenshots and documents are easier to read.',
      'Prepare sharp images for Instagram, Facebook, and YouTube thumbnails.',
      'Clarify CCTV and security footage to better distinguish faces and objects.',
      'Boost resolution before printing posters, flyers, and large banners.',
      'Enhance product photos so fine textures and details stand out in listings.',
      'Revive older or scanned photos by increasing resolution and reducing noise.'
    ]
  }
];

interface ImageGeneratorZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const imageGeneratorZigZagSections: ImageGeneratorZigZagSection[] = [
  {
    id: 'no-prompts',
    eyebrow: 'No prompt skills needed',
    title: 'A text-to-image tool that does not require prompt expertise',
    description:
      'Create AI images without learning complex prompt formulas. The AI Image Generator includes purpose-built tools so you can focus on your idea instead of technical wording.',
    imageSrc: '/images/blog/A text to image tool.jpg',
    imageAlt: 'AI Image Generator interface creating visuals from simple prompts',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Pick from tools like the AI Logo Generator or AI Anime Art Generator.',
      'Each tool is tuned for a specific type of image, so prompts can stay simple.',
      'Type short, natural language descriptions and let the model handle the details.'
    ]
  },
  {
    id: 'brands',
    eyebrow: 'For brands',
    title: 'An image generator designed for brands',
    description:
      'Experiment with bold visual ideas that would be too expensive or slow to produce with traditional photoshoots. Quickly explore variations before you commit budget to a full campaign.',
    imageSrc: '/images/blog/image generator designed for brands.jpg',
    imageAlt: 'Brand visuals created with an AI image generator',
    icon: <Atom className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Generate marketing visuals, ad concepts, and social media posts on demand.',
      'Test packaging concepts, logos, and branding directions without a studio setup.',
      'Produce multiple creative variations from a single idea in just a few prompts.'
    ]
  },
  {
    id: 'customize',
    eyebrow: 'Edit and refine',
    title: 'Customize AI images with powerful editing features',
    description:
      'Turn generated images into production-ready assets using the rest of the ModernPhotoTools suite. Enhance quality, adapt formats, and fine-tune details in the same workflow.',
    imageSrc: '/images/blog/Customize AI images with powerful editing features.jpg',
    imageAlt: 'AI-generated image being refined with additional editing tools',
    icon: <Gem className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Upscale AI images up to 4× for sharper, higher resolution output.',
      'Apply AI filters to match different moods, styles, or campaign aesthetics.',
      'Resize images for different platforms without manual cropping.',
      'Make precise cutouts to isolate subjects or remove unwanted elements.',
      'Replace parts of an image to perfect the overall composition or message.'
    ]
  }
];

interface ImageToImageZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const imageToImageZigZagSections: ImageToImageZigZagSection[] = [
  {
    id: 'ai-transformer',
    eyebrow: 'Image transformation',
    title: 'An AI image transformer for fresh compositions',
    description:
      'Use the image-to-image tool to restyle any photo into a new composition while keeping the main layout recognizable. The model analyzes structure, lighting, and style, then rebuilds textures, colors, and details so the result feels like a new version of the same scene.',
    imageSrc: '/images/blog/AI image transformer for fresh compositions.jpg',
    imageAlt: 'Example of an AI-transformed image based on an input photo',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'prompt-control',
    eyebrow: 'Prompt control',
    title: 'Personalize every image with detailed text prompts',
    description:
      'Guide the AI with short prompts that describe what you want to see more of and what to avoid. Combine your source image with clear directions about style, mood, and subject so each generation moves closer to your ideal result without endless trial and error.',
    imageSrc: '/images/blog/Personalize every image with detailed text prompts.jpg',
    imageAlt: 'Interface showing text prompts used to control an AI image transformation',
    icon: <Atom className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Add or remove elements by describing them in natural language.',
      'Specify materials, lighting, camera angle, or artistic style.',
      'Use prompts to keep key subjects while refreshing the overall look.'
    ]
  },
  {
    id: 'targeted-edits',
    eyebrow: 'Targeted edits',
    title: 'Use prompts for precise modifications and scene updates',
    description:
      'Describe focused changes such as “add a golden sunset,” “make the city look futuristic,” or “turn this into a painterly illustration.” The AI applies your instructions across the image so you can explore variations and refinements without manual brushing.',
    imageSrc: '/images/blog/prompts for precise modifications.jpg',
    imageAlt: 'AI-generated variations of the same scene shown side by side',
    icon: <Gem className="w-6 h-6 text-blue-600" />
  }
];

interface SketchToImageZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const sketchToImageZigZagSections: SketchToImageZigZagSection[] = [
  {
    id: 'turn-sketch-into-photo',
    eyebrow: 'From sketch to image',
    title: 'Turn sketches into detailed AI-generated images',
    description:
      'Upload your sketch or draw directly on the canvas, then let the sketch-to-image engine rebuild it as a finished scene. The model interprets lines, shapes, and shading to create rich lighting, texture, and depth around your original idea.',
    imageSrc: '/images/blog/Turn sketches into detailed AI-generated images.jpg',
    imageAlt: 'Example of a hand-drawn sketch transformed into a polished AI-generated image',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'sketch-to-digital-art',
    eyebrow: 'Sketch to digital art',
    title: 'Convert hand-drawn art into polished digital visuals',
    description:
      'Move seamlessly from paper or tablet sketches to clean, presentation-ready artwork. The AI reads contours, textures, and notes in your drawing, then outputs a refined image suitable for portfolios, pitch decks, and marketing creatives.',
    imageSrc: '/images/blog/hand-drawn art into polished digital visuals.jpg',
    imageAlt: 'Side-by-side comparison of a sketch and its refined digital counterpart',
    icon: <Atom className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'multi-modal-control',
    eyebrow: 'Multi-modal control',
    title: 'Guide generations with text prompts and style references',
    description:
      'Combine rough sketches with text prompts and optional style images to control every aspect of the result. Describe the mood, environment, and color palette, or reference another image so the AI follows your vision while still respecting the structure of your sketch.',
    imageSrc: '/images/blog/Guide generations with text prompts and style references.jpg',
    imageAlt: 'Sketch-to-image interface showing prompts and style reference controls',
    icon: <Gem className="w-6 h-6 text-blue-600" />
  }
];

interface ProductZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
}

const productZigZagSections: ProductZigZagSection[] = [
  {
    id: 'fast-results',
    eyebrow: 'Speed and quality',
    title: 'AI product photoshoot: fast and realistic results',
    description:
      'Create polished product photos that look like they came from a professional studio, without booking equipment or locations. Use ModernPhotoTools’ AI Product Photoshoot to generate on-brand scenes in minutes instead of days.',
    imageSrc: '/images/blog/AI product photoshoot results.jpg',
    imageAlt: 'Example of AI-generated product photos in different realistic scenes',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'for-everyone',
    eyebrow: 'For every team',
    title: 'Online AI product shot generator for any workflow',
    description:
      'Support agencies, photographers, ecommerce sellers, and social media teams with one flexible tool. Start from ready-made styles or your own prompts to keep product photos consistent across websites, ads, and marketplaces.',
    imageSrc: '/images/blog/Online AI product shot generator for any workflow.jpg',
    imageAlt: 'Different people using an AI product photography workflow',
    icon: <Users className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'imaginative-backgrounds',
    eyebrow: 'Creative backgrounds',
    title: 'Imaginative AI product background generation with prompts',
    description:
      'Place your product in any environment you can describe. Type a short prompt to stage it on a beach, in a studio, on a marble counter, or inside a themed set—without having to physically shoot in each location.',
    imageSrc: '/images/blog/Imaginative AI product background generation with prompts.jpg',
    imageAlt: 'Product shown on multiple AI-generated backgrounds based on prompts',
    icon: <CameraIcon className="w-6 h-6 text-blue-600" />
  }
];

interface CleanupZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const cleanupZigZagSections: CleanupZigZagSection[] = [
  {
    id: 'people',
    eyebrow: 'People & portraits',
    title: 'Remove people and distractions in a few strokes',
    description:
      'Use the AI cleanup brush to erase photobombers, strangers, or small distractions from portraits, travel shots, event photos, and family pictures. The tool intelligently fills the cleaned area so the composition looks natural, like the unwanted element was never there.',
    imageSrc: '/images/blog/Remove people and distractions.jpg',
    imageAlt: "Tattoo removed from girl's arm using AI cleanup tool for a smoother skin appearance.",
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'products',
    eyebrow: 'Product photos',
    title: 'Clean up product photos professionally',
    description:
      "Clean up product photos of clothing, jewelry, electronics, cosmetics, food, home decor, and more. Remove clutter, distractions, scratches, dust, or harsh shadows so your images look polished and ready for marketplaces like Amazon, Shopify, Etsy, or eBay.",
    imageSrc: '/images/blog/Clean up product photos professionally.jpg',
    imageAlt: 'Product photo cleanup done using AI to enhance image quality and remove unwanted elements.',
    icon: <ShoppingBag className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'backgrounds',
    eyebrow: 'Backgrounds & scenes',
    title: 'Flawless cleanup with natural background generation',
    description:
      'ModernPhotoTools analyzes the masked subject and surrounding scene to rebuild what should be behind it. Its content-aware fill creates a contextual, natural-looking background so there are no obvious smudges or artifacts after cleanup.',
    imageSrc: '/images/blog/Flawless cleanup with natural background generation.jpg',
    imageAlt: 'Girl removed from a beach photo using AI cleanup to preserve the scenery.',
    icon: <Car className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'why-modern',
    eyebrow: 'Why ModernPhotoTools',
    title: 'Why choose ModernPhotoTools’ AI photo cleaner?',
    description:
      'ModernPhotoTools gives you a fast, browser-based way to erase anything you do not want in a photo while keeping everything else sharp and natural.',
    imageSrc: '/images/tools images/AI Cleanup Tool.jpg',
    imageAlt: 'Example of a clean, polished image edited with ModernPhotoTools.',
    icon: <KeyIcon className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Free, easy, and quick photo cleanup workflow in the browser.',
      'Precise control with brush-based masking you can refine at any time.',
      'Real-time preview so you can undo or redo edits instantly.',
      'High-quality, realistic outputs suitable for print and online use.',
      'Secure processing that respects user privacy.',
      'Works great alongside AI portrait retouching and other ModernPhotoTools features.'
    ]
  }
];

interface CleanupFaqItem {
  id: string;
  question: string;
  answer: string;
}

const cleanupFaqItems: CleanupFaqItem[] = [
  {
    id: 'keep-areas',
    question: 'What happens if the AI cleans up something that I want to keep?',
    answer:
      'The AI only cleans up the masked area in the picture. If part of the subject you want to keep gets removed, you can undo the step and refine your mask. Paint more precisely around the object you want to erase, then run cleanup again until the important details stay and only the distractions disappear.'
  },
  {
    id: 'id-passport',
    question: 'Can I use this tool for ID or passport photo cleanup?',
    answer:
      'You can use AI cleanup to fix small issues such as dust spots, minor background marks, or subtle distractions. For official ID or passport photos, always follow your local authority’s rules. Avoid changing facial features, lighting, or background in ways that could make the photo non-compliant.'
  },
  {
    id: 'labels-logos',
    question: 'Is the tool able to clean product labels and logos in photos?',
    answer:
      'Yes. The AI cleanup brush can remove labels, logos, or text from packaging and products so you can create neutral, generic visuals. This is helpful for mockups, templates, and marketing layouts. Always make sure you respect brand and licensing guidelines when editing branded content.'
  },
  {
    id: 'reflections',
    question: 'Can AI cleanup handle reflective surfaces like glass or water?',
    answer:
      'AI cleanup can work on reflective surfaces, but they are more complex because reflections contain fine details and gradients. For best results, use smaller brush strokes and zoom in while masking. The tool will attempt to rebuild believable reflections, but extremely complex reflections may need a couple of passes or minor manual adjustments.'
  }
];

const cleanupFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: cleanupFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface ProductFaqItem {
  id: string;
  question: string;
  answer: string;
}

const productFaqItems: ProductFaqItem[] = [
  {
    id: 'what-it-does',
    question: 'What does the AI Product Photoshoot tool do?',
    answer:
      'It uses AI to generate professional-looking product photos in different scenes and styles. You upload a product image, choose or describe a setup, and the tool creates new shots that are ready for stores, ads, and social media.'
  },
  {
    id: 'who-it-is-for',
    question: 'Who is the AI Product Photoshoot tool designed for?',
    answer:
      'It is built for ecommerce sellers, marketers, photographers, and agencies who need consistent product visuals quickly. Whether you manage a small online shop or a large catalog, you can use it to refresh photos without repeated studio sessions.'
  },
  {
    id: 'image-requirements',
    question: 'What kind of product photos work best with this tool?',
    answer:
      'Clear, well-lit product photos with the item in focus work best. Centered products on simple backgrounds are easier for the AI to understand. Very dark, blurry, or low-resolution images may produce lower quality results.'
  },
  {
    id: 'pricing',
    question: 'Is the AI Product Photoshoot tool free to use?',
    answer:
      'You can try the AI Product Photoshoot tool directly in your browser without installing extra software. Availability, limits, and commercial usage options can depend on your current plan, but it is optimized so you can start testing it on real products right away.'
  },
  {
    id: 'where-it-works',
    question: 'Which types of products can I create AI photos for?',
    answer:
      'You can generate shots for jewelry, clothing, perfumes, cosmetics, electronics, food, decor, and more. The same tool works across categories by letting you pick different styles, backgrounds, and prompts tailored to your brand.'
  }
];

const productFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: productFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface ReplaceZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
}

const replaceZigZagSections: ReplaceZigZagSection[] = [
  {
    id: 'mask-and-prompt',
    eyebrow: 'Mask and prompt',
    title: 'Replace image content with easy masking and simple prompts',
    description:
      'Use ModernPhotoTools AI Replace to swap anything in a photo without starting from scratch. Brush over the area you want to change, describe the new object or scene in a short text prompt, and let the model generate a realistic replacement that matches lighting, perspective, and texture.',
    imageSrc: '/images/blog/Replace image content with easy masking and simple prompts.jpg',
    imageAlt: 'Example of AI Replace swapping objects in a photo.',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'social-media',
    eyebrow: 'Social media',
    title: 'AI image replacer for social media content creators',
    description:
      'Polish travel shots, lifestyle posts, and promotional images by removing unwanted details and inserting better-fitting elements. Guide the tool with simple prompts so your content looks curated and on-brand without hours of manual editing.',
    imageSrc: '/images/blog/AI image replacer for social media content creators.jpg',
    imageAlt: 'Social media image refined using AI Replace.',
    icon: <CameraIcon className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'product-photos',
    eyebrow: 'Product photos',
    title: 'Replace clutter with matching aesthetics in product photos',
    description:
      'Clean up product photos taken in busy environments by replacing distracting objects with props that fit the style of your brand. Add or swap items in the frame so the final image feels cohesive, similar to generative fill in pro editing software—all from your browser.',
    imageSrc: '/images/blog/Replace clutter with matching aesthetics in product photos.jpg',
    imageAlt: 'Product scene improved by replacing clutter with cohesive elements.',
    icon: <ShoppingBag className="w-6 h-6 text-blue-600" />
  }
];

interface ReplaceFaqItem {
  id: string;
  question: string;
  answer: string;
}

const replaceFaqItems: ReplaceFaqItem[] = [
  {
    id: 'add-objects',
    question: 'Is there an AI that can add objects in photos?',
    answer:
      'Yes. AI Replace lets you add new objects to your photos by masking an area and describing what should appear there. The tool generates content that fits the existing scene so additions feel like part of the original shot.'
  },
  {
    id: 'how-to-replace',
    question: 'How do I replace objects in images with AI?',
    answer:
      'Upload your image, select the AI Replace tool, and brush over the object or region you want to change. Then type a short description of the new object or look you want. The AI will remove the original content and render a replacement that matches the scene.'
  },
  {
    id: 'pets-and-objects',
    question: 'Can I replace my pet with an object in the picture?',
    answer:
      'Technically you can mask your pet and prompt for another object, and the AI will attempt to generate a believable result. Always keep ethics and personal preferences in mind when editing people or animals in photos, especially if they belong to someone else.'
  },
  {
    id: 'customize-results',
    question: 'Can I customize the AI-generated replacements?',
    answer:
      'You can refine results by adjusting your mask and updating the prompt. If the first version is not quite right, undo, tweak the selection or description, and run AI Replace again until the output matches your creative direction.'
  },
  {
    id: 'partial-replace',
    question: 'Can AI replace part of an image?',
    answer:
      'Yes. AI Replace is designed to edit only the region you select. It preserves the rest of the photo while regenerating new content inside the masked area so the final image looks cohesive.'
  }
];

const replaceFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: replaceFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface ExpandZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const expandZigZagSections: ExpandZigZagSection[] = [
  {
    id: 'realistic-expansion',
    eyebrow: 'Quality & detail',
    title: 'Realistic image expansion without quality loss',
    description:
      'The AI Expand tool is developed to uncrop pictures, enlarge backgrounds, and outpaint images without causing stretching or blurring. It assesses the layout, lighting, and context of your picture, then fabricates new pixels that match the original in texture, color, and style for integrated results.',
    imageSrc: '/images/blog/Realistic image expansion without quality loss.jpg',
    imageAlt: 'Wide photo extended with AI while keeping sharp detail.',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'social-sizes',
    eyebrow: 'Social formats',
    title: 'AI images of the perfect size for social media',
    description:
      'This tool not only utilizes AI to enlarge images but also enhances their usability. It features preset sizes designed for various social media platforms. You can conveniently select your preferred size for image enlargement. It ensures that your images are perfectly sized for platforms like Instagram, Facebook, Twitter, etc., without requiring any manual adjustments. This tool is perfect for filling in missing areas or cropped images, and enlarging your picture to provide a complete look.',
    imageSrc: '/images/blog/AI images of the perfect size for social media.jpg',
    imageAlt: 'Photo expanded to fit a social media-friendly aspect ratio.',
    icon: <CameraIcon className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'creative-uses',
    eyebrow: 'Creative ideas',
    title: 'Creative ways to use generative expand',
    description:
      'Use AI Expand to go beyond simple uncropping. Treat extra canvas as a place to add story, context, or playful details around your original subject.',
    imageSrc: '/images/blog/Creative ways to use generative expand.jpg',
    imageAlt: 'Creative AI expansion adding context around a central subject.',
    icon: <Gem className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Create extra space around product photos to add text overlays or promotional graphics without crowding the subject.',
      'Imagine what lies beyond the borders of famous artworks by extending paintings or illustrations past their original frame.',
      'Turn landscape photos into wider panoramas or dramatic cityscapes by expanding the sky, ground, and surroundings.',
      'Resize and extend photos so posts, stories, and headers line up cleanly across different social platforms.',
      'Expand classic meme images so AI can invent new surrounding content and fresh variations on familiar jokes.'
    ]
  }
];

interface BackgroundZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const backgroundZigZagSections: BackgroundZigZagSection[] = [
  {
    id: 'drive-sales',
    eyebrow: 'Sell more',
    title: 'AI photo backgrounds that help products stand out',
    description:
      'Stop searching for stock photos or setting up complex shoots. Use the AI Background Generator to create polished, realistic scenes around your existing photos so every image looks ready for your store, ads, and social feeds.',
    imageSrc: '/images/blog/AI photo backgrounds that help products stand out.jpg',
    imageAlt: 'Product photo placed on an AI-generated background designed for ecommerce.',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'for-every-industry',
    eyebrow: 'For any brand',
    title: 'Built for every industry and product category',
    description:
      'Whether you work with fashion, electronics, furniture, beauty, food, or accessories, you can turn plain or cluttered backgrounds into on-brand, buyer-friendly scenes that match your visual identity.',
    imageSrc: '/images/blog/AI-backgrounds-for-every-industry.jpg',
    imageAlt: 'Different product categories shown with AI-generated backgrounds.',
    icon: <ShoppingBag className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'use-cases',
    eyebrow: 'Use cases',
    title: 'Explore a wide range of AI background use cases',
    description:
      'Use AI-generated backgrounds anywhere you need clean, consistent visuals, from marketplaces to personal branding.',
    imageSrc: '/images/blog/AI-background-generator-use-cases.jpg',
    imageAlt: 'Collage of photos using AI-generated backgrounds for different purposes.',
    icon: <Home className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Use AI backgrounds for product listings on Amazon, Shopify, eBay, Etsy, or your own site.',
      'Generate multiple background options and A/B test which versions convert better.',
      'Create catalog images and marketing visuals without organizing new photo shoots.',
      'Design social posts, reel covers, YouTube thumbnails, and other creator content.',
      'Update model and actor portfolios with clean, versatile scenes at low cost.',
      'Apply simple, professional backdrops for CV photos and job application headshots.'
    ]
  }
];

interface CartoonZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const cartoonZigZagSections: CartoonZigZagSection[] = [
  {
    id: 'custom-characters',
    eyebrow: 'Text to cartoon',
    title: 'Generate custom cartoon characters from text prompts',
    description:
      'Make custom cartoon characters using the AI cartoon maker. Just describe your idea through a text prompt and the AI will generate it. Choose outfits, hairstyles, accessories, and background scenes so the final cartoon looks exactly how you imagined.',
    imageSrc: '/images/blog/Generate custom cartoon characters from text prompts.jpg',
    imageAlt: 'AI-generated cartoon characters created from text prompts.',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'photo-to-cartoon',
    eyebrow: 'Cartoon look-alikes',
    title: 'Turn your photo into popular cartoon characters',
    description:
      'See the cartoon version of yourself with an AI cartoon filter. Explore comic, manga, Disney-style, 3D, anime, webtoon, caricature, and more. Use one-click presets or prompts to transform selfies and portraits into familiar or completely original characters.',
    imageSrc: '/images/blog/Turn your photo into popular cartoon characters.jpg',
    imageAlt: 'Portrait photo transformed into different cartoon styles.jpg',
    icon: <Atom className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'uses-and-benefits',
    eyebrow: 'Uses & benefits',
    title: 'Use AI cartoon characters for many purposes',
    description:
      'Convert photos into cartoon characters you can reuse across gaming, social content, branding, and more. Enjoy authentic transformations that preserve facial features, deliver precise details, and export in high resolution.',
    imageSrc: '/images/blog/Use AI cartoon characters for many purposes.jpg',
    imageAlt: 'AI cartoon avatars used across social media, gaming, and branding.',
    icon: <Gem className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Gaming: design expressive cartoon characters that react naturally in games.',
      'Profile pictures: create unique cartoon avatars for your online identity.',
      'Social media content: share playful cartoon versions of yourself or your audience.',
      'Marketing and advertising: use AI cartoons in ads, banners, and email visuals.',
      'Branding and e-commerce: turn characters into mascots or product visuals for your store.'
    ]
  }
];

interface FaceSwapZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const faceSwapZigZagSections: FaceSwapZigZagSection[] = [
  {
    id: 'ai-face-swap',
    eyebrow: 'AI face swap',
    title: 'AI Face Swap: replace faces in your photos',
    description:
      'Modern PhotoTools precisely places one face onto another body so swaps feel natural. Put yourself or someone else into new scenes, from portraits to characters, while keeping expressions, lighting, and perspective believable.',
    imageSrc: '/images/blog/Online Face Swapping.jpg',
    imageAlt: 'Examples of AI-generated characters suitable for face swapping',
    icon: <Users className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Replace faces in photos without manual cutouts or layered editing.',
      'Keep facial structure recognizable while adapting to new poses and angles.',
      'Try swaps on portraits, character shots, and creative concepts.'
    ]
  },
  {
    id: 'superhero-swaps',
    eyebrow: 'Superhero & characters',
    title: 'Create superhero-style AI face replacements',
    description:
      'Combine your photos with stylized character bodies for cartoon, realistic, or 3D superhero looks. The AI aligns and blends your face so it matches the pose, lighting, and style of the original character image.',
    imageSrc: '/images/blog/superhero-style AI face replacements.jpg',
    imageAlt: 'AI character presets that can be used for superhero-style swaps',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />,
    bullets: [
      'Use presets inspired by action heroes and fantasy characters.',
      'Generate cartoon, realistic, or 3D superhero face replacements.',
      'Upload your own source face to create unique hero variations.'
    ]
  }
];

interface CaricatureZigZagSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const caricatureZigZagSections: CaricatureZigZagSection[] = [
  {
    id: 'text-prompts',
    eyebrow: 'Text prompts',
    title: 'Turn photos into caricatures with simple text prompts',
    description:
      'Transform everyday photos into playful caricatures in a few words. Describe a mood like humorous, serious, or quirky and let the AI exaggerate features, expression, and style while keeping the person recognizable.',
    imageSrc: '/images/blog/Turn photos into caricatures with simple text prompts.jpg',
    imageAlt: 'Photo turned into expressive AI caricature using text prompts',
    icon: <Sparkles className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'friends-caricatures',
    eyebrow: 'Friends and social',
    title: 'Create funny caricatures of your friends',
    description:
      'Upload photos of your friends and generate lighthearted caricatures you can share in chats, on social media, or as digital gifts. Keep it friendly, adjust the prompts for softer or bolder exaggeration, and create reactions that make everyone smile.',
    imageSrc: '/images/blog/nano-banana-3d-caricature-easy.jpeg',
    imageAlt: 'Funny AI caricature of friends ready to share online',
    icon: <Users className="w-6 h-6 text-blue-600" />
  }
];

interface ExpandFaqItem {
  id: string;
  question: string;
  answer: string;
}

const expandFaqItems: ExpandFaqItem[] = [
  {
    id: 'pricing',
    question: 'Is the AI Expand tool free to use?',
    answer:
      'Yes, you can try the AI Expand tool directly in your browser without installing extra software. Availability, limits, and commercial usage terms may depend on your current plan, but it is designed so you can start testing image expansion for free on typical photos.'
  },
  {
    id: 'privacy',
    question: 'What about the privacy of uploaded images?',
    answer:
      'Uploaded images are processed securely and used only to generate your expanded results. Do not upload confidential documents or sensitive personal information, and always follow your own privacy and compliance requirements when working with client images.'
  },
  {
    id: 'content-generation',
    question: 'Can I generate content within images?',
    answer:
      'AI Expand focuses on extending your existing canvas with new, context-aware content around the original photo. It can suggest new scenery, background detail, and empty space for text, but it is not a full prompt-only image generator. For completely new scenes, combine it with dedicated generative tools.'
  },
  {
    id: 'batch-processing',
    question: 'Can I upload and expand images in a batch?',
    answer:
      'The current tool is optimized for expanding one image at a time so you can fine-tune prompts and framing. For high-volume or batch workflows, you can process images sequentially or explore automation options built on the same API.'
  },
  {
    id: 'max-resolution',
    question: 'What’s the maximum resolution for an expanded image?',
    answer:
      'To keep results fast and stable, expansion works best when the final image stays within typical web and print limits. Very large inputs may be resized before processing, and extremely high-resolution outputs might require multiple passes. For most workflows, starting with images up to around 3000–4000 pixels on the longest side produces reliable results.'
  }
];

const expandFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: expandFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface BackgroundFaqItem {
  id: string;
  question: string;
  answer: string;
}

const backgroundFaqItems: BackgroundFaqItem[] = [
  {
    id: 'transparent-required',
    question: 'Do I have to upload an image with a transparent background for a new AI background?',
    answer:
      'No. You can upload regular photos with their original backgrounds. The AI Background Generator can detect the subject and replace or rebuild the background for you. Well-lit images with a clear subject usually give the best results.'
  },
  {
    id: 'without-subject',
    question: 'Can I generate a background image without a product or subject?',
    answer:
      'Yes. You can use the tool to generate standalone backgrounds from text prompts, then reuse them later behind products, portraits, or designs. Just describe the scene you want and download the generated background.'
  },
  {
    id: 'same-product-different-scenes',
    question: 'Is it possible to generate the same product in different background settings?',
    answer:
      'Yes. Upload a clear photo of your product once, then try multiple prompts or presets to place it in different scenes. This is useful for testing lifestyle, studio, and seasonal backgrounds without repeating photoshoots.'
  },
  {
    id: 'generation-time',
    question: 'How long does it take for the AI to generate a background?',
    answer:
      'In most cases, results appear within a few seconds, depending on image size and server load. More complex prompts or very large images can take slightly longer, but the goal is to keep generation fast enough for quick experimentation.'
  },
  {
    id: 'popular-backgrounds',
    question: 'What are some popular backgrounds that I can try with AI?',
    answer:
      'Common choices include clean studio setups, soft gradients, minimal desk scenes, outdoor lifestyle settings, seasonal themes, and on-brand color backdrops. You can also reference materials like wood, marble, concrete, or fabric for more texture.'
  },
  {
    id: 'free-limits',
    question: 'How many backgrounds can I generate for free?',
    answer:
      'You can start generating backgrounds for free in your browser. Exact limits depend on your current plan and any usage caps in place, but the experience is tuned so you can try multiple prompts and variations before deciding whether you need more.'
  },
  {
    id: 'watermarks',
    question: 'Will my photos be watermark-free?',
    answer:
      'Yes. Backgrounds generated with ModernPhotoTools are delivered without watermarks so you can use them in product listings, marketing designs, and personal projects. Always review the latest terms of use for details on commercial usage.'
  }
];

const backgroundFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: backgroundFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface RemoveBgFaqItem {
  id: string;
  question: string;
  answer: string;
}

const removeBgFaqItems: RemoveBgFaqItem[] = [
  {
    id: 'what-it-does',
    question: 'What does the Remove Background tool do?',
    answer:
      'It automatically detects the main subject in your photo and separates it from the background, so you can download a clean cutout or pair it with a new background without manual masking.'
  },
  {
    id: 'who-it-is-for',
    question: 'Who is the background remover designed for?',
    answer:
      'It is built for creators, sellers, and teams that work with visuals every day: ecommerce sellers, marketers, photographers, real estate agents, and anyone who needs clean, consistent images fast.'
  },
  {
    id: 'image-requirements',
    question: 'What image formats and sizes work best?',
    answer:
      'Standard formats like JPG and PNG work best. For the most accurate cutouts, upload clear photos where the subject is well lit and separated from the background. Very small or heavily compressed images may produce lower quality results.'
  },
  {
    id: 'pricing',
    question: 'Is the Remove Background tool free to use?',
    answer:
      'You can use the online background remover directly in your browser without installing software. Pricing and limits may depend on the current plan, but you can start testing it for free on typical photos.'
  },
  {
    id: 'where-it-works',
    question: 'Can I use the tool for product, portrait, and real estate photos?',
    answer:
      'Yes. The same background remover works across people, products, cars, and property photos. You can combine it with other ModernPhotoTools features to generate new backgrounds or polish your final image.'
  }
];

const removeBgFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: removeBgFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface WatermarkFaqItem {
  id: string;
  question: string;
  answer: string;
}

const watermarkFaqItems: WatermarkFaqItem[] = [
  {
    id: 'download-no-watermark',
    question: 'Will the edited image get downloaded without a watermark?',
    answer:
      'Yes. When processing is complete you download the cleaned version without an additional watermark from the tool. If you still see marks, they are either part of the original file that could not be fully removed or elements the AI chose to keep to preserve image quality.'
  },
  {
    id: 'multiple-watermarks',
    question: 'Can the tool remove multiple watermarks in one image?',
    answer:
      'In many cases it can. The AI scans the entire photo and tries to remove repeated logos or text that follow a similar pattern. Extremely dense or overlapping marks may leave slight traces, in which case you can run another pass or refine the result with an object cleanup tool.'
  },
  {
    id: 'text-based-images',
    question: 'Is it possible to erase watermarks from text-based images?',
    answer:
      'It can work on documents, quotes, and other text-heavy images, but results depend on how much of the underlying text is covered. If a watermark hides large portions of words or lines, removing it completely may also erase important content or reduce readability.'
  },
  {
    id: 'manual-brush',
    question: 'Is there a manual brush feature?',
    answer:
      'The AI Watermark Remover is designed as a one-click automatic tool, so it does not require you to paint masks. If you need fine-grained control for specific areas, you can pair it with a separate cleanup or inpainting tool that supports manual brushing.'
  },
  {
    id: 'semi-transparent',
    question: 'Does the tool work on semi-transparent watermarks?',
    answer:
      'Often yes. Semi-transparent marks with clear contrast from the background are good candidates for AI removal. Very dense patterns or tiled overlays may be harder to clean perfectly and can sometimes leave faint texture where the mark used to be.'
  },
  {
    id: 'ethics',
    question: 'Is it ethical to remove copyright from photo?',
    answer:
      'Only remove watermarks from photos and assets you own, have created, or are otherwise permitted to edit. Do not use the tool to bypass licensing terms or remove copyright information from media you do not have rights to. Always follow local laws and the usage rules set by the content owner.'
  }
];

const watermarkFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: watermarkFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface FilterFaqItem {
  id: string;
  question: string;
  answer: string;
}

const filterFaqItems: FilterFaqItem[] = [
  {
    id: 'what-is-ai-filter',
    question: 'What is the AI filter?',
    answer:
      'The AI filter is an image effect powered by artificial intelligence that restyles your photos. Instead of simple color overlays, it can change textures, lighting, and artistic details based on preset styles or your own text prompts.'
  },
  {
    id: 'how-to-get-filter',
    question: 'How do I get an AI filter for a photo?',
    answer:
      'Open the AI Filter tool, upload your photo, then choose a preset style or switch to a custom style with your own prompt. Click Generate and the AI will apply the selected filter so you can download the updated image.'
  },
  {
    id: 'anime-filter-online',
    question: 'Where can I find an AI filter online for anime?',
    answer:
      'You can create anime-style looks directly in the AI Filter tool. Pick anime or manga-inspired presets if available, or describe the character, era, or art style you like in a text prompt to generate a custom anime filter for your photo.'
  },
  {
    id: 'how-to-add-filter',
    question: 'How do I add an AI filter?',
    answer:
      'Upload an image to the AI Filter tool, select a style or type a prompt that describes the look you want, and click Generate. The filter is applied automatically, so you do not need to install extra plugins or edit layers manually.'
  },
  {
    id: 'popular-filter',
    question: 'What is the AI filter everyone is using?',
    answer:
      'Popular AI filters change over time, from vintage film looks to anime, cyberpunk, or illustrative styles. With the AI Filter tool, you can explore curated presets that follow current trends or recreate viral looks by describing them in a prompt.'
  },
  {
    id: 'free-ai-effect',
    question: 'How can I use AI effect for free?',
    answer:
      'You can experiment with AI effects for free in your browser using the AI Filter tool. Upload a compatible image, apply filters, and download results without installing heavy software. Usage limits may depend on the current plan.'
  },
  {
    id: 'ai-filter-app',
    question: 'Is there an AI filter app?',
    answer:
      'You do not need a separate app. The AI Filter tool runs in your browser on desktop and mobile, so you can access it like an app by visiting the site or adding a shortcut to your home screen.'
  },
  {
    id: 'where-to-get-free-filter',
    question: 'Where can I get AI image filter for free?',
    answer:
      'You can get free AI image filters on Modern PhotoTools by opening the AI Filter tool, uploading a photo, and trying different presets or custom prompts. Everything runs online, so there is nothing to download or install.'
  }
];

const filterFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: filterFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface UpscalerFaqItem {
  id: string;
  question: string;
  answer: string;
}

const upscalerFaqItems: UpscalerFaqItem[] = [
  {
    id: '2x-vs-4x',
    question: 'What is the difference between 2x and 4x upscaling?',
    answer:
      '2x upscaling doubles your image dimensions, while 4x upscaling makes them four times larger. Both use the same AI model, but 4x creates much bigger files and is best for smaller images that need to be enlarged a lot. For larger photos, 2x is usually enough to sharpen details without overdoing the size.'
  },
  {
    id: 'file-size',
    question: 'Will upscaling increase the file size?',
    answer:
      'Yes. When you upscale an image, the number of pixels increases, so the file usually gets larger as well. The final size also depends on the format and compression level, but expect bigger dimensions and a larger file compared to your original image.'
  },
  {
    id: 're-upscale',
    question: 'Can I upscale the image again to improve quality even more?',
    answer:
      'You can re-upload an upscaled image and run it through the tool again, but repeated passes rarely add meaningful detail and may start to look artificial. For best results, start from the original photo and choose the highest upscale factor you need in one step.'
  },
  {
    id: 'max-size',
    question: 'What is the maximum image size I can upload for upscaling?',
    answer:
      'You can upload images up to 2048 pixels on the longest side. For images larger than 1024 pixels on the longest edge, only 2x upscaling is available so the output stays within safe limits. Smaller images can use both 2x and 4x upscaling.'
  },
  {
    id: 'hi-res',
    question: 'Will upscaling improve the details of an already high-resolution image?',
    answer:
      'Upscaling can gently sharpen and clean noise in high-resolution photos, but it cannot invent unlimited new detail. If your image is already large and crisp, 2x upscaling is usually enough, and sometimes you may not need to upscale at all for typical screen use.'
  },
  {
    id: 'mobile',
    question: 'Is there a mobile version or app available for upscaling on the go?',
    answer:
      'You do not need a separate app. The AI Image Upscaler runs directly in your browser, so you can open the site on your phone or tablet and upscale images on the go as long as you have an internet connection.'
  }
];

const upscalerFaqSchema = {
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
} as const;

interface AvatarFaqItem {
  id: string;
  question: string;
  answer: string;
}

const avatarFaqItems: AvatarFaqItem[] = [
  {
    id: 'what-is-avatar',
    question: 'What is an AI avatar?',
    answer:
      'An AI avatar is a stylized image of your face generated by artificial intelligence. It keeps your core features recognizable while reimagining you in different artistic, professional, or playful styles for online profiles, games, and communities.'
  },
  {
    id: 'best-generator',
    question: 'What is the best AI avatar generator?',
    answer:
      'The best AI avatar generator is one that creates accurate, high-quality results from a single clear photo while giving you control over style. Modern PhotoTools uses Modern technology to offer curated presets and custom prompts so you can generate avatars that look polished and on-brand.'
  },
  {
    id: 'free-avatar',
    question: 'Where can I generate an AI avatar for free?',
    answer:
      'You can generate free AI avatars directly in your browser on Modern PhotoTools. Upload a compatible image, choose a preset or describe your desired look, and create avatars without installing software or setting up complex tools.'
  },
  {
    id: 'single-photo',
    question: 'How do I make an avatar with a single photo?',
    answer:
      'Upload one clear, front-facing photo with good lighting and minimal obstructions. Select a preset style or add a short text prompt, then run the AI Avatar tool. The system analyzes your face once and produces avatars based on that single image.'
  },
  {
    id: 'face-avatar',
    question: 'How can I create an AI avatar of my face?',
    answer:
      'Start with a photo where your facial features are visible and sharp. Avoid heavy filters or blurred shots. Upload it to the AI Avatar tool, pick a style or describe one with text, and let the AI generate versions that keep your face recognizable while changing the styling.'
  },
  {
    id: 'avatar-types',
    question: 'What are the different types of AI avatars?',
    answer:
      'You can create many types of AI avatars, including realistic portraits, cartoon and anime styles, fantasy characters, game-inspired looks, and professional profile images. Each type adjusts lighting, color, and details while preserving your core facial structure.'
  },
  {
    id: 'avatar-uses',
    question: 'What are the different applications of AI avatars?',
    answer:
      'AI avatars are used for gaming profiles, social media pictures, streaming and creator branding, online communities, business headshots, and anonymous but expressive identities. They help you stay recognizable while sharing a curated or creative version of yourself.'
  }
];

const avatarFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: avatarFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface PortraitFaqItem {
  id: string;
  question: string;
  answer: string;
}

const portraitFaqItems: PortraitFaqItem[] = [
  {
    id: 'what-it-does',
    question: 'What does the AI Portrait tool do?',
    answer:
      'The AI Portrait tool upgrades regular photos into polished portraits with improved lighting, color, and styling while keeping the person recognizable.'
  },
  {
    id: 'best-input-photo',
    question: 'What kind of photo should I upload for best results?',
    answer:
      'Use a clear, front-facing photo with good lighting where the face is not cropped, heavily blurred, or covered by strong filters, text, or stickers.'
  },
  {
    id: 'background-and-lighting',
    question: 'Can I change the background and lighting in my portraits?',
    answer:
      'Yes. You can describe the mood, lighting, and background in a short prompt to generate portraits that feel like they were taken in a studio or a specific location.'
  },
  {
    id: 'retouching',
    question: 'Is this the same as traditional photo retouching?',
    answer:
      'Traditional retouching makes small edits to an existing photo. The AI Portrait tool uses generative AI to reinterpret the portrait while keeping key facial traits and overall likeness.'
  },
  {
    id: 'where-to-use',
    question: 'Where can I use AI portraits from this tool?',
    answer:
      'You can use them for social media profiles, websites, pitch decks, resumes, brand pages, and creator thumbnails as long as they follow the terms of use for your platform.'
  },
  {
    id: 'privacy',
    question: 'Is my photo stored or used to train models?',
    answer:
      'Modern PhotoTools processes your images to generate results and follows strict policies around data handling. Always review the latest privacy policy and terms of use for details.'
  }
];

const portraitFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: portraitFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface FaceSwapFaqItem {
  id: string;
  question: string;
  answer: string;
}

const faceSwapFaqItems: FaceSwapFaqItem[] = [
  {
    id: 'swap-vs-morph',
    question: "What's the difference between face swapping and face morphing?",
    answer:
      'Face swapping replaces one face with another while keeping the rest of the image the same. Face morphing gradually blends two faces into a new in-between face, usually shown as an animation or sequence. The AI Face Swap tool focuses on clean, realistic replacements rather than animated morphs.'
  },
  {
    id: 'free-use',
    question: 'Can I replace a face in a photo for free?',
    answer:
      'You can start testing AI face swaps for free in your browser. Exact limits, export sizes, and advanced options may depend on your current plan, but the experience is designed so you can try multiple swaps without installing software.'
  },
  {
    id: 'realism',
    question: 'Is the face swapping realistic?',
    answer:
      'The tool analyzes skin tone, lighting, and perspective to blend faces as naturally as possible. Results look most realistic when the source and target faces have similar angles, expressions, and image quality. You can always try a few different photos to see which combination looks best.'
  },
  {
    id: 'photo-security',
    question: 'How secure are my photos when using your face swapping tool?',
    answer:
      'Uploaded images are processed over encrypted connections and handled according to ModernPhotoTools privacy and data policies. Avoid uploading highly sensitive photos, and review the latest privacy policy and terms of use to understand how long images are stored and how they may be processed.'
  },
  {
    id: 'safety-measures',
    question: 'What measures are in place to prevent my face from appearing in explicit content?',
    answer:
      'The service is built with strict content and safety guidelines. Models are tuned and monitored to block explicit, abusive, or otherwise harmful outputs where possible, and usage is governed by clear terms of use. You should still avoid prompts, uploads, or use cases that violate the content policy or local laws.'
  }
];

const faceSwapFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faceSwapFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface OutfitFaqItem {
  id: string;
  question: string;
  answer: string;
}

const outfitFaqItems: OutfitFaqItem[] = [
  {
    id: 'ai-try-on-app',
    question: 'Which AI app lets you try on clothes?',
    answer:
      'Modern PhotoTools includes an AI Outfit tool that lets you virtually try on outfits in your existing photos. Upload a clear image, choose a preset style or describe your own look, and see the new outfit applied automatically.'
  },
  {
    id: 'find-dress',
    question: 'Can AI help me find a dress?',
    answer:
      'Yes. You can describe the type of dress you have in mind—such as “long satin evening dress in emerald green” or “casual summer floral dress”—and the AI Outfit tool will generate versions that match your description on your photo.'
  },
  {
    id: 'virtual-try-on',
    question: 'Is there a way to virtually try on clothes?',
    answer:
      'Use the AI Outfit tool as a virtual try-on. Upload a portrait or full-body photo, then try different clothing styles, colors, and themes without changing in real life. You can quickly compare multiple looks to decide what you like best.'
  },
  {
    id: 'image-safety',
    question: 'Are my images safe when using Modern’s AI Clothes Changer?',
    answer:
      'Images are processed according to Modern PhotoTools privacy and security policies. Photos are sent over encrypted connections and used to generate your results. Avoid uploading highly sensitive images, and review the latest terms of use and privacy policy to understand how your data is handled.'
  }
];

const outfitFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: outfitFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface HairstyleFaqItem {
  id: string;
  question: string;
  answer: string;
}

const hairstyleFaqItems: HairstyleFaqItem[] = [
  {
    id: 'how-to-try',
    question: 'How do I try hairstyles virtually with AI?',
    answer:
      'Upload a clear, front-facing photo to the AI Hairstyle tool and choose a preset style or describe the cut and length you want. The AI maps hair directly onto your face so you can compare different looks before you change your real hair.'
  },
  {
    id: 'what-is-generator',
    question: 'What is an AI hairstyle generator?',
    answer:
      'An AI hairstyle generator is a tool that uses artificial intelligence to simulate haircuts, colors, and styles on your photos. Instead of guessing in a mirror, you get realistic previews that follow your face shape, features, and lighting.'
  },
  {
    id: 'choose-color',
    question: 'Can I generate a hairstyle in a specific color?',
    answer:
      'Yes. You can either pick presets that already include certain colors or describe the shade you want in your text prompt, such as “platinum blonde bob” or “dark curly hair with copper highlights.” The AI applies both the style and color to your image.'
  },
  {
    id: 'apps-availability',
    question: 'Is there an app that lets you try different hairstyles?',
    answer:
      'ModernPhotoTools works in any modern browser on desktop or mobile, so you can use the AI Hairstyle tool like an app without installing heavy software. Open the site, upload a photo, and start exploring new hairstyles instantly.'
  }
];

const hairstyleFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: hairstyleFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface CartoonFaqItem {
  id: string;
  question: string;
  answer: string;
}

const cartoonFaqItems: CartoonFaqItem[] = [
  {
    id: 'what-it-does',
    question: 'What does the AI Cartoon tool do?',
    answer:
      'The AI Cartoon tool transforms your photos into cartoon-style artwork. You can start from a selfie or upload a reference and guide the look with text prompts so the final image matches the style you have in mind.'
  },
  {
    id: 'text-or-photo',
    question: 'Can I create cartoons from text prompts or only from photos?',
    answer:
      'You can do both. Describe your character with a text prompt to generate a brand-new cartoon from scratch, or upload a photo and use prompts or presets to turn yourself into a cartoon version while keeping your key features recognizable.'
  },
  {
    id: 'styles',
    question: 'What cartoon styles can I generate?',
    answer:
      'You can explore many styles like comic, manga, Disney-inspired, anime, 3D, webtoon, or caricature. Try the built-in presets for quick results or combine them with your own prompts for more specific looks.'
  },
  {
    id: 'quality-and-usage',
    question: 'Is the output quality good enough for social media and branding?',
    answer:
      'Yes. The AI Cartoon tool is designed to keep clear facial features and produce sharp, high-resolution images. You can comfortably use them for profile pictures, social posts, lightweight marketing visuals, and brand experiments.'
  },
  {
    id: 'commercial-use',
    question: 'Can I use AI cartoon images commercially?',
    answer:
      'In many cases you can, but always review the latest terms of use and licensing rules for ModernPhotoTools and any platform where you publish. Avoid using trademarked characters or copyrighted likenesses in ways that could infringe on existing rights.'
  }
];

const cartoonFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: cartoonFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface CaricatureFaqItem {
  id: string;
  question: string;
  answer: string;
}

const caricatureFaqItems: CaricatureFaqItem[] = [
  {
    id: 'from-photo',
    question: 'How to create a caricature painting from a photo?',
    answer:
      'Upload a clear portrait to the AI Caricature tool, pick a style preset or upload a reference image, then add a short prompt describing the mood and exaggeration you want. The AI converts your photo into a stylized caricature painting while keeping key facial features intact.'
  },
  {
    id: 'yourself',
    question: 'How to make a caricature of yourself?',
    answer:
      'Use a well-lit, front-facing selfie with your face clearly visible. Upload it to the AI Caricature tool, choose a style, and optionally add a prompt such as “playful, big smile, bright colors.” The AI generates a caricature version of you that you can download and share.'
  },
  {
    id: 'cartoon-caricature',
    question: 'How to make a cartoon caricature from a photo?',
    answer:
      'Start with a portrait photo, then combine a caricature style preset with a prompt that mentions a cartoon look, such as “cartoon caricature, bold outlines, flat colors.” The AI exaggerates proportions and simplifies shapes to create a cartoon-style caricature from your original image.'
  },
  {
    id: 'free-caricature',
    question: 'How to turn a photo into a caricature for free?',
    answer:
      'Open the AI Caricature tool in your browser, upload a photo, and experiment with the free styles and prompts available. You can generate caricatures without installing software, then download results within the limits of your current plan.'
  },
  {
    id: 'online-free',
    question: 'How to make caricatures online for free?',
    answer:
      'Use a browser-based caricature maker like ModernPhotoTools. Upload your image, select a style preset or type a short prompt, and click generate. You can try multiple variations online at no cost before deciding which results you want to keep.'
  },
  {
    id: 'personalized',
    question: 'How to make a personalized caricature?',
    answer:
      'Combine a clear photo with specific prompts about the person’s interests, personality, and look. Mention details like outfit, background, or hobbies (for example “musician caricature on stage, energetic lighting”) so the AI produces a caricature that feels tailored to that individual.'
  }
];

const caricatureFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: caricatureFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface ImageGeneratorFaqItem {
  id: string;
  question: string;
  answer: string;
}

const imageGeneratorFaqItems: ImageGeneratorFaqItem[] = [
  {
    id: 'training-data',
    question: 'What kind of training data is used to train the AI model for generating images?',
    answer:
      'The AI Image Generator is trained on large collections of licensed, synthetic, and publicly available image–text pairs. The goal is to help the model understand how everyday language maps to visual concepts, styles, and compositions so it can create new images from your prompts. It does not train directly on your private uploads.'
  },
  {
    id: 'copyright',
    question: 'Who owns the copyright of images generated on Modern AI?',
    answer:
      'In general, you have broad rights to use the images you generate for personal and commercial projects, as long as your prompts and outputs comply with ModernPhotoTools’ terms of use and applicable laws. Always review the latest licensing and policy pages for details on attribution, restrictions, and prohibited content.'
  },
  {
    id: 'mobile-app',
    question: 'Is there a mobile app for AI text-to-image?',
    answer:
      'You can access the AI Image Generator in a mobile browser, and some ModernPhotoTools experiences may also be available through companion apps or integrations. Check the official website or app store listings for the most current information about dedicated mobile apps and supported platforms.'
  },
  {
    id: 'image-types',
    question: 'What types of images can be generated with text-to-image AI?',
    answer:
      'You can generate a wide range of visuals, including logos, illustrations, product renders, concept art, portraits, landscapes, and abstract designs. Results depend on the prompt you write, the style you choose, and any additional tools you combine with the generator, such as filters or upscaling.'
  },
  {
    id: 'age-restriction',
    question: 'Is there any age restriction to using the AI Image Generator?',
    answer:
      'Yes. Like most AI and creative platforms, ModernPhotoTools is intended for users who meet the minimum age requirements defined in the terms of use and privacy policy. Parents and guardians should supervise younger users and make sure generated content and prompts stay within appropriate guidelines.'
  },
  {
    id: 'commercial-use',
    question: 'Can the generated images be used commercially?',
    answer:
      'Yes, many users rely on AI-generated images for marketing, branding, social media, and client work. You are generally allowed to use your outputs commercially, provided you follow ModernPhotoTools’ policies and do not create content that infringes on trademarks, copyrighted characters, or other protected material.'
  }
];

const imageGeneratorFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: imageGeneratorFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface ImageToImageFaqItem {
  id: string;
  question: string;
  answer: string;
}

const imageToImageFaqItems: ImageToImageFaqItem[] = [
  {
    id: 'more-detail',
    question:
      'Can I use the AI image-to-image tool to make more detailed images than the original photo?',
    answer:
      'Yes. The AI image-to-image tool can add texture, depth, and stylistic detail beyond what is visible in the source photo. It respects the main composition of your image while reimagining surfaces, lighting, and fine elements so the output feels richer and more polished. For best results, start from a clear, well-lit image with enough structure for the model to understand.'
  },
  {
    id: 'creative-uses',
    question: 'What are some creative uses of the image-to-image AI tool?',
    answer:
      'You can restyle existing photos into new art directions, generate moodboard variations, create alternate versions of product shots, or turn sketches and rough renders into refined visuals. Many people use image-to-image to explore different color palettes, materials, and environments while keeping the same base composition for campaigns, thumbnails, and concept art.'
  },
  {
    id: 'safety',
    question: 'Is it safe to use personal photos with image-to-image AI?',
    answer:
      'Images are processed according to ModernPhotoTools privacy and security policies. Uploads are sent over encrypted connections and used to generate your results, not to retrain public models. Avoid sharing highly sensitive or confidential photos and always review the latest privacy policy and terms of use for full details on retention and allowed content.'
  },
  {
    id: 'control',
    question: 'How much control do I have over the output of the image-to-image AI?',
    answer:
      'You control the output through your text prompts, strength settings, and other tool options. Prompts guide what should be emphasized, added, or toned down, while strength controls how strongly the AI is allowed to reinterpret your original image. Lower strength keeps more of the original look; higher strength gives you bolder, more stylized transformations.'
  },
  {
    id: 'photo-quality',
    question: 'Can AI-generated images match the quality of real photographs?',
    answer:
      'In many cases, image-to-image outputs can look similar to high-quality photos, especially for web, social media, and marketing use. The tool can simulate realistic lighting, materials, and depth of field. However, AI results are still synthetic and may not replace carefully controlled studio photography for every use case, so always review outputs before publishing or printing.'
  }
];

const imageToImageFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: imageToImageFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

interface SketchToImageFaqItem {
  id: string;
  question: string;
  answer: string;
}

const sketchToImageFaqItems: SketchToImageFaqItem[] = [
  {
    id: 'upload-limit',
    question: 'How many sketches can I upload at a time?',
    answer:
      'The AI Sketch to Image tool is optimized for one sketch per generation so the model can focus on your lines and details. You can transform multiple sketches by processing them one after another and downloading each result.'
  },
  {
    id: 'generation-time',
    question: 'How long does it take to convert a sketch into an AI image?',
    answer:
      'Most generations complete in a few seconds, depending on server load and the complexity of your settings. Detailed prompts, high strength values, or large images may take slightly longer, but the tool is designed for fast sketch-to-image previews.'
  },
  {
    id: 'strength-control',
    question: 'How should I adjust the strength for sketch-to-image conversion?',
    answer:
      'Use higher sketch strength values when you want the AI to follow your lines closely and preserve the composition. Lower values give the model more freedom to reinterpret shapes and add creative details. You can rerun generations with different strengths until the balance feels right.'
  },
  {
    id: 'three-d-art',
    question: 'Can I generate 3D-style art from a rough sketch with AI?',
    answer:
      'Yes. Add phrases like “3D render,” “cinematic lighting,” or “3D cartoon style” to your text prompt, and optionally upload a style reference image. The AI will keep the structure of your sketch while rendering it with more dimensional lighting and materials.'
  },
  {
    id: 'messy-sketches',
    question: 'What if my sketch is messy or has unclear lines?',
    answer:
      'The tool can still generate results from loose or rough sketches, but clearer outlines usually produce more accurate images. If outputs look off, try darkening key lines, simplifying the drawing, or tightening the areas that matter most before uploading again.'
  }
];

const sketchToImageFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: sketchToImageFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
} as const;

function CleanupUseCasesSection() {
  const useCases = [
    {
      id: 'photography',
      eyebrow: 'Photography',
      title: 'Polish everyday photos',
      description:
        'Edit your portraits, travel shots, event pictures, or family photos. Get rid of distractions and undesired objects to improve the overall image composition and keep attention on the story you want to tell.',
      icon: <Sparkles className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'ecommerce',
      eyebrow: 'eCommerce',
      title: 'Optimize product listings',
      description:
        'Clean up product photos by removing price tags, dust, scratches, and background clutter. Present your items with crisp, distraction-free visuals that convert better on marketplaces and online stores.',
      icon: <ShoppingBag className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'real-estate',
      eyebrow: 'Real Estate',
      title: 'Clarify interiors and exteriors',
      description:
        'Remove small objects, signage, or visual noise from property photos so rooms, facades, and landscapes look brighter, clearer, and easier to browse on listing pages.',
      icon: <Home className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'social-media',
      eyebrow: 'Social Media',
      title: 'Curate a clean feed',
      description:
        'Erase photobombers, messy backgrounds, and random objects before posting. Create scroll-stopping images for Instagram, TikTok, and other platforms without heavy desktop software.',
      icon: <Sparkles className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'graphic-design',
      eyebrow: 'Graphic Designs',
      title: 'Prepare assets for layouts',
      description:
        'Clean up photos before dropping them into posters, presentations, and UI designs. Remove elements that clash with your layout so designers can work with flexible, high-quality assets.',
      icon: <KeyIcon className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'marketing',
      eyebrow: 'Marketing',
      title: 'Refine campaign visuals',
      description:
        'Polish hero images, banners, and ad creatives by removing anything that steals focus from your offer or call-to-action. Produce professional-grade visuals directly in your browser.',
      icon: <Car className="w-5 h-5 text-blue-600" />
    }
  ];

  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Use AI photo cleanup for personal and professional purposes
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Apply ModernPhotoTools’ AI Cleanup across photography, eCommerce, real estate, social media, design, and marketing projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col h-full"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                {item.icon}
                <span>{item.eyebrow}</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RemoveBgZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Designed for real-world photo workflows
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the background remover anywhere you work with visuals: portraits, products, cars, interiors, marketing assets, and more.
          </p>
        </div>
        <div className="space-y-10">
          {removeBgZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WatermarkZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Designed for watermark-heavy photos and assets
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the Watermark Remover whenever logos, proof labels, or overlay text get in the way of your final image. Combine it with other ModernPhotoTools features to clean, enhance, and restyle visuals in one workflow.
          </p>
        </div>
        <div className="space-y-10">
          {watermarkZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-3 list-disc list-inside text-gray-700 text-sm md:text-base space-y-1">
                      {section.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FilterZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Creative AI filters for every style of photo
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the AI Filter tool whenever you want to add mood, texture, or stylization without learning complex editing. Mix preset filters with your own prompts to build unique looks for portraits, artwork, and social content.
          </p>
        </div>
        <div className="space-y-10">
          {filterZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI product photos ready for your store and campaigns
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use AI Product Photoshoot to create studio-style images, lifestyle scenes, and creative
            backgrounds for every type of product—all without reshoots or complex manual editing.
          </p>
        </div>
        <div className="space-y-10">
          {productZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AvatarZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Built for every kind of online avatar
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the AI Avatar generator for gaming, communities, social media, and professional profiles without needing design skills or complex tools.
          </p>
        </div>
        <div className="space-y-10">
          {avatarZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FaceSwapZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI face swaps for fun edits and creative concepts
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the AI Face Swap tool to place faces onto new bodies, characters, and scenes while keeping results
            natural-looking and shareable.
          </p>
        </div>
        <div className="space-y-10">
          {faceSwapZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  {section.bullets && (
                    <ul className="mt-3 space-y-1 text-gray-700 text-sm md:text-base list-disc list-inside">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OutfitZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI outfit ideas for every occasion
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the AI Outfit tool to test casual, festive, and formal looks on your photos before you commit to a style.
          </p>
        </div>
        <div className="space-y-10">
          {outfitZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HairstyleZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
          AI hairstyles for every mood and occasion
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the AI Hairstyle tool to preview cuts, lengths, and colors before you change your real hair.
          </p>
        </div>
        <div className="space-y-10">
          {hairstyleZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  {section.bullets && (
                    <ul className="mt-3 space-y-1 text-gray-700 text-sm md:text-base list-disc list-inside">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ImageUpscalerZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI upscaling for real-world photo workflows
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the AI Image Upscaler whenever you need larger, cleaner versions of your photos for screens, print, or close-up crops.
          </p>
        </div>
        <div className="space-y-10">
          {imageUpscalerZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  {section.bullets && (
                    <ul className="mt-3 space-y-1 text-gray-700 text-sm md:text-base list-disc list-inside">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PortraitZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI portraits for profiles, branding, and creative projects
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the AI Portrait tool to generate professional, brand-ready portraits and creative looks from simple face photos and short prompts.
          </p>
        </div>
        <div className="space-y-10">
          {portraitZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  {section.bullets && (
                    <ul className="mt-3 space-y-1 text-gray-700 text-sm md:text-base list-disc list-inside">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ImageGeneratorZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Built for every image creation need
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the AI Image Generator to create professional visuals without design skills or complex tools.
          </p>
        </div>
        <div className="space-y-10">
          {imageGeneratorZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  {section.bullets && (
                    <ul className="mt-3 space-y-1 text-gray-700 text-sm md:text-base list-disc list-inside">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ImageToImageZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Transform existing photos into new AI images
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the image-to-image tool to restyle, refine, or completely reimagine your images while keeping the core composition in place.
          </p>
        </div>
        <div className="space-y-10">
          {imageToImageZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  {section.bullets && (
                    <ul className="mt-3 space-y-1 text-gray-700 text-sm md:text-base list-disc list-inside">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SketchToImageZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Turn sketches into fully rendered scenes
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use Sketch to Image to move from quick line drawings to rich, production-ready visuals
            for client pitches, creative explorations, and portfolio pieces.
          </p>
        </div>
        <div className="space-y-10">
          {sketchToImageZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  {section.bullets && (
                    <ul className="mt-3 space-y-1 text-gray-700 text-sm md:text-base list-disc list-inside">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExpandZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Expand your canvas realistically with AI
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use AI Expand to uncrop pictures, extend backgrounds, and grow your scene while keeping sharp, natural detail from edge to edge.
          </p>
        </div>
        <div className="space-y-10">
          {expandZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  {section.bullets && (
                    <ul className="mt-3 space-y-1 text-gray-700 text-sm md:text-base list-disc list-inside">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BackgroundZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Build custom AI backgrounds for every photo workflow
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the AI Background Generator to turn plain or cluttered scenes into clean, on-brand
            visuals that work across marketplaces, campaigns, and social channels.
          </p>
        </div>
        <div className="space-y-10">
          {backgroundZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  {section.bullets && (
                    <ul className="mt-3 space-y-1 text-gray-700 text-sm md:text-base list-disc list-inside">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CartoonZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Create AI cartoon characters from photos or text
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the AI Cartoon tool to turn portraits into stylized characters or generate original cartoons from prompts for games, social media, and branding.
          </p>
        </div>
        <div className="space-y-10">
          {cartoonZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  {section.bullets && (
                    <ul className="mt-3 space-y-1 text-gray-700 text-sm md:text-base list-disc list-inside">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CaricatureZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Turn any photo into a playful AI caricature
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the AI Caricature tool to exaggerate expressions, style, and personality while keeping the original person recognizable, perfect for gifts, avatars, and social posts.
          </p>
        </div>
        <div className="space-y-10">
          {caricatureZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  {section.bullets && (
                    <ul className="mt-3 space-y-1 text-gray-700 text-sm md:text-base list-disc list-inside">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ReplaceZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Replace anything in your image with AI-guided edits
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use AI Replace to swap objects, fix distractions, and reimagine parts of a scene while keeping everything else in the photo intact.
          </p>
        </div>
        <div className="space-y-10">
          {replaceZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CleanupZigZagLayout() {
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Clean up anything that gets in the way of a great photo
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Use the AI Cleanup tool to remove people, objects, text, and other distractions while keeping the rest of the image natural and sharp.
          </p>
        </div>
        <div className="space-y-10">
          {cleanupZigZagSections.map((section, index) => {
            const textFirst = index % 2 === 0;
            return (
              <div
                key={section.id}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-3">
                    {section.icon}
                    <span>{section.eyebrow}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  {section.bullets && (
                    <ul className="mt-3 space-y-1 text-gray-700 text-sm md:text-base list-disc list-inside">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div
                  className={`w-full lg:w-1/2 ${
                    textFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RemoveBgFAQ() {
  const [openId, setOpenId] = useState<string | null>(removeBgFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Remove Background: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about how the background remover works and where you can use it.
          </p>
        </div>
        <SchemaJSONLD data={removeBgFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {removeBgFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `remove-bg-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function WatermarkFAQ() {
  const [openId, setOpenId] = useState<string | null>(watermarkFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Watermark Remover: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Learn how the AI Watermark Remover handles different kinds of marks, where it works best, and how to use it responsibly.
          </p>
        </div>
        <SchemaJSONLD data={watermarkFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {watermarkFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `watermark-remover-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function OutfitFAQ() {
  const [openId, setOpenId] = useState<string | null>(outfitFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Outfit: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Learn how the AI Outfit tool works, how to try on virtual clothes, and how your images are handled.
          </p>
        </div>
        <SchemaJSONLD data={outfitFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {outfitFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `ai-outfit-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function HairstyleFAQ() {
  const [openId, setOpenId] = useState<string | null>(hairstyleFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Hairstyle: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Learn how to preview new haircuts, colors, and styles with the AI Hairstyle tool before visiting a salon.
          </p>
        </div>
        <SchemaJSONLD data={hairstyleFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {hairstyleFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `ai-hairstyle-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterFAQ() {
  const [openId, setOpenId] = useState<string | null>(filterFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Filter: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about how AI filters work, how to apply them, and where to use them.
          </p>
        </div>
        <SchemaJSONLD data={filterFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {filterFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `ai-filter-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageUpscalerFAQ() {
  const [openId, setOpenId] = useState<string | null>(upscalerFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Image Upscaler: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about how AI upscaling works, recommended settings, and image limits.
          </p>
        </div>
        <SchemaJSONLD data={upscalerFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {upscalerFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `ai-image-upscaler-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaceSwapFAQ() {
  const [openId, setOpenId] = useState<string | null>(faceSwapFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Face Swap: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about how AI face swaps work, where to use them, and how your photos are handled.
          </p>
        </div>
        <SchemaJSONLD data={faceSwapFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faceSwapFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `face-swap-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductFAQ() {
  const [openId, setOpenId] = useState<string | null>(productFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Product Photoshoot: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about how the AI Product Photoshoot tool works and how to
            use it in your product photo workflows.
          </p>
        </div>
        <SchemaJSONLD data={productFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {productFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `product-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function AvatarFAQ() {
  const [openId, setOpenId] = useState<string | null>(avatarFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Avatar: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about how the AI Avatar generator works and where you can use your avatars.
          </p>
        </div>
        <SchemaJSONLD data={avatarFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {avatarFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `avatar-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PortraitFAQ() {
  const [openId, setOpenId] = useState<string | null>(portraitFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Portrait: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about how the AI Portrait tool works and how to get the best results from your photos.
          </p>
        </div>
        <SchemaJSONLD data={portraitFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {portraitFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `portrait-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpandFAQ() {
  const [openId, setOpenId] = useState<string | null>(expandFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Expand: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about how the AI Expand tool works, what it can generate, and where it fits in your workflow.
          </p>
        </div>
        <SchemaJSONLD data={expandFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {expandFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `expand-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReplaceFAQ() {
  const [openId, setOpenId] = useState<string | null>(replaceFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Replace: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about how AI Replace works, what it can edit, and how to guide results with prompts.
          </p>
        </div>
        <SchemaJSONLD data={replaceFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {replaceFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `replace-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CartoonFAQ() {
  const [openId, setOpenId] = useState<string | null>(cartoonFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Cartoon: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about turning photos into cartoons, guiding styles with prompts, and using the results in your projects.
          </p>
        </div>
        <SchemaJSONLD data={cartoonFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {cartoonFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `cartoon-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundFAQ() {
  const [openId, setOpenId] = useState<string | null>(backgroundFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Background Generator: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about generating new AI backgrounds, using them with
            products and portraits, and understanding limits and usage.
          </p>
        </div>
        <SchemaJSONLD data={backgroundFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {backgroundFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `background-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CaricatureFAQ() {
  const [openId, setOpenId] = useState<string | null>(caricatureFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Caricature: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about turning photos into fun caricatures, choosing styles, and using the results online.
          </p>
        </div>
        <SchemaJSONLD data={caricatureFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {caricatureFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `caricature-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CleanupFAQ() {
  const [openId, setOpenId] = useState<string | null>(cleanupFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Cleanup: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about how the AI photo cleanup tool works and where you can use it.
          </p>
        </div>
        <SchemaJSONLD data={cleanupFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {cleanupFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `cleanup-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageGeneratorFAQ() {
  const [openId, setOpenId] = useState<string | null>(imageGeneratorFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Image Generator: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about how the AI Image Generator works and where you can use the images you create.
          </p>
        </div>
        <SchemaJSONLD data={imageGeneratorFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {imageGeneratorFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `image-generator-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function SketchToImageFAQ() {
  const [openId, setOpenId] = useState<string | null>(sketchToImageFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Sketch to Image: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Learn how to upload sketches, control strength, and shape different sketch-to-image results for your projects.
          </p>
        </div>
        <SchemaJSONLD data={sketchToImageFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {sketchToImageFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `ai-sketch-to-image-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageToImageFAQ() {
  const [openId, setOpenId] = useState<string | null>(imageToImageFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="mb-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Image to Image: frequently asked questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Learn how to control image-to-image generations, work safely with personal photos, and get the most out of prompts and strength settings.
          </p>
        </div>
        <SchemaJSONLD data={imageToImageFaqSchema} />
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {imageToImageFaqItems.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `ai-image-to-image-faq-answer-${item.id}`;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="font-semibold text-gray-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const ToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [selectedImage, setSelectedImage] = useState<ImageFile>({ file: null, preview: null });
  const [processedImage, setProcessedImage] = useState<ProcessedImage>({
    url: null,
    isLoading: false,
    error: null
  });
  
  // Tool feature image state
  const [toolFeatureImage, setToolFeatureImage] = useState<{
    imagePath: string | null;
    altText: string;
    isLoading: boolean;
  }>({
    imagePath: null,
    altText: '',
    isLoading: true
  });
  
  // AI Cleanup specific state
  const imageRef = useRef<HTMLImageElement>(null);
  const visibleCanvasRef = useRef<HTMLCanvasElement>(null);
  const dataMaskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [cleanupBrushSize, setCleanupBrushSize] = useState(20);
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  const [isMaskDrawn, setIsMaskDrawn] = useState(false);
  
  // AI Expand specific state
  const [padding, setPadding] = useState({
    top: 50,
    left: 50,
    bottom: 50,
    right: 50
  });
  
  // AI Replace specific state
  const replaceImageRef = useRef<HTMLImageElement>(null);
  const replaceVisibleCanvasRef = useRef<HTMLCanvasElement>(null);
  const replaceDataMaskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isReplaceDrawing, setIsReplaceDrawing] = useState(false);
  const [replaceBrushSize, setReplaceBrushSize] = useState(20);
  const [replaceCanvasInitialized, setReplaceCanvasInitialized] = useState(false);
  const [textPrompt, setTextPrompt] = useState('');
  
  // AI Cartoon specific state
  const [cartoonTextPrompt, setCartoonTextPrompt] = useState('');
  const [cartoonStyleImage, setCartoonStyleImage] = useState<File | null>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');
  const [selectedPresetUrl, setSelectedPresetUrl] = useState<string | null>(null);
  
  // AI Caricature specific state
  const [caricatureSelectedStyle, setCaricatureSelectedStyle] = useState<Style | null>(null);
  const [caricatureCustomStyleImage, setCaricatureCustomStyleImage] = useState<File | null>(null);
  const [caricatureTextPrompt, setCaricatureTextPrompt] = useState('');
  
  // AI Avatar specific state
  const [avatarSelectedGender, setAvatarSelectedGender] = useState<'male' | 'female'>('male');
  const [avatarSelectedStyle, setAvatarSelectedStyle] = useState<AvatarStyle | null>(null);
  const [avatarCustomStyleImage, setAvatarCustomStyleImage] = useState<File | null>(null);
  const [avatarTextPrompt, setAvatarTextPrompt] = useState('');
  
  // AI Product Photoshoot specific state
  const [selectedProductStyle, setSelectedProductStyle] = useState<ProductStyle | null>(null);
  const [productCustomStyleImage, setProductCustomStyleImage] = useState<File | null>(null);
  const [productTextPrompt, setProductTextPrompt] = useState('');
  
  // AI Background Generator specific state
  const [backgroundTextPrompt, setBackgroundTextPrompt] = useState('');
  
  // AI Image Generator specific state
  const [imageGeneratorTextPrompt, setImageGeneratorTextPrompt] = useState('');
  const [selectedResolution, setSelectedResolution] = useState<ImageResolution>(imageResolutions[0]); // Default to square
  
  // AI Portrait specific state
  const [portraitSelectedGender, setPortraitSelectedGender] = useState<'male' | 'female'>('female');
  const [portraitSelectedStyle, setPortraitSelectedStyle] = useState<PortraitStyle | null>(null);
  const [portraitCustomStyleImage, setPortraitCustomStyleImage] = useState<File | null>(null);
  const [portraitTextPrompt, setPortraitTextPrompt] = useState('');
  
  // AI Face Swap specific state
  const [faceSwapTargetImage, setFaceSwapTargetImage] = useState<ImageFile>({ file: null, preview: null });
  const [faceSwapSourceImage, setFaceSwapSourceImage] = useState<ImageFile>({ file: null, preview: null });
  const [selectedFaceSwapPreset, setSelectedFaceSwapPreset] = useState<FaceSwapStyle | null>(null);
  
  // AI Outfit specific state
  const [outfitTextPrompt, setOutfitTextPrompt] = useState('');

  // AI Image to Image specific state
  const [i2iMainImage, setI2iMainImage] = useState<ImageFile>({ file: null, preview: null });
  const [i2iStyleImage, setI2iStyleImage] = useState<ImageFile>({ file: null, preview: null });
  const [i2iTextPrompt, setI2iTextPrompt] = useState('');

  // AI Hairstyle preset selection state
  const [selectedHairstylePrompt, setSelectedHairstylePrompt] = useState<string>('');
  const [i2iStrength, setI2iStrength] = useState(0.3); // Default value from 0.0 to 1.0
  const [i2iStyleStrength, setI2iStyleStrength] = useState(0.9); // Default value from 0.0 to 1.0
  
  // AI Sketch to Image specific state
  const [s2iInputMode, setS2iInputMode] = useState<'draw' | 'upload'>('upload'); // To switch between drawing and uploading
  const [s2iSketchImage, setS2iSketchImage] = useState<ImageFile>({ file: null, preview: null });
  const [s2iStyleImage, setS2iStyleImage] = useState<ImageFile>({ file: null, preview: null });
  const [s2iTextPrompt, setS2iTextPrompt] = useState('');
  const [s2iStrength, setS2iStrength] = useState(0.8); // Higher default to respect sketch more
  const [s2iStyleStrength, setS2iStyleStrength] = useState(0.5); // Lower default
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null); // For the drawing canvas
  const [isDrawingSketch, setIsDrawingSketch] = useState(false);
  const [s2iBrushSize, setS2iBrushSize] = useState(5);
  const [s2iBrushColor, setS2iBrushColor] = useState('#000000');
  
  // AI Hairstyle state
  const [hairstyleTextPrompt, setHairstyleTextPrompt] = useState('');
  
  // AI Image Upscaler state
  const [upscaleFactor, setUpscaleFactor] = useState<2 | 4>(2);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [availableUpscaleOptions, setAvailableUpscaleOptions] = useState<(2 | 4)[]>([2, 4]);
  
  const ImageComparison = ImageComparisonSlider;

  // AI Filter state
  const [filterSelectedCategory, setFilterSelectedCategory] = useState<string>('Ghibli');
  const [filterSelectedStyle, setFilterSelectedStyle] = useState<AIFilterStyle | null>(null);
  const [filterCustomStyleImage, setFilterCustomStyleImage] = useState<File | null>(null);
  const [filterTextPrompt, setFilterTextPrompt] = useState('');
  const [filterUseCustom, setFilterUseCustom] = useState(false);

  const outfitHeroLooks = [
    {
      id: 'outfit-1',
      imageSrc: '/images/blog/outfit style 1.jpg',
      imageAlt: 'AI outfit preset applied to a portrait'
    },
    {
      id: 'outfit-2',
      imageSrc: '/images/blog/outfit style 2.jpg',
      imageAlt: 'Alternative AI outfit style on a portrait'
    },
    {
      id: 'outfit-3',
      imageSrc: '/images/blog/outfit style 3.jpg',
      imageAlt: 'Gallery of AI-generated outfit looks'
    }
  ];

  const [activeOutfitHeroId, setActiveOutfitHeroId] = useState(outfitHeroLooks[0]?.id ?? '');

  const activeOutfitHero =
    outfitHeroLooks.find((item) => item.id === activeOutfitHeroId) ?? outfitHeroLooks[0];

  const [activeHairstylePresetName, setActiveHairstylePresetName] = useState(
    hairstylePresets[0]?.name ?? ''
  );

  const activeHairstylePreset =
    hairstylePresets.find((style) => style.name === activeHairstylePresetName) ??
    hairstylePresets[0];

  const faceSwapCharacters = [
    {
      id: 'character-1',
      imageSrc: '/images/blog/Swap Face in black suite.jpg',
      imageAlt: 'AI character used as a face swap preset'
    },
    {
      id: 'character-2',
      imageSrc: '/images/blog/Swap Face in brown suite.jpg',
      imageAlt: 'AI character preset for face swapping'
    },
    {
      id: 'character-3',
      imageSrc: '/images/blog/Swap Face in king suite.jpg',
      imageAlt: 'AI character gallery example for face swap'
    }
  ];

  const [activeFaceSwapCharacterId, setActiveFaceSwapCharacterId] = useState(faceSwapCharacters[0]?.id ?? '');

  const activeFaceSwapCharacter =
    faceSwapCharacters.find((item) => item.id === activeFaceSwapCharacterId) ?? faceSwapCharacters[0];

  const removeBgUseCaseTabs: { id: 'people' | 'products' | 'cars' | 'animals' | 'real-estate'; label: string }[] = [
    { id: 'people', label: 'People' },
    { id: 'products', label: 'Products' },
    { id: 'cars', label: 'Cars' },
    { id: 'animals', label: 'Animals' },
    { id: 'real-estate', label: 'Real Estate' }
  ];

  const removeBgUseCases: Record<
    (typeof removeBgUseCaseTabs)[number]['id'],
    { title: string; description: string; beforeSrc: string; afterSrc: string }
  > = {
    people: {
      title: 'Portraits without Distracting Backgrounds',
      description:
        'Remove busy or cluttered backgrounds from profile photos, social media content, and marketing creatives so the focus stays on the person.',
      beforeSrc: '/images/blog/remove-bg-1.jpg',
      afterSrc: '/images/blog/remove-bg.png'
    },
    products: {
      title: 'Clean Product Photos for Stores and Marketplaces',
      description:
        'Cut out products from messy scenes and place them on clean, consistent backgrounds ready for ecommerce, catalogs, and ads.',
      beforeSrc: '/images/blog/Clean Product Photos.jpg',
      afterSrc: '/images/blog/Clean Product Photos-BG removed.jpg'
    },
    cars: {
      title: 'Polished Car Listings and Automotive Ads',
      description:
        'Isolate cars from distracting surroundings to create professional listings, social media posts, and promotional banners.',
      beforeSrc: '/images/blog/Isolate cars from distracting surroundings.jpg',
      afterSrc: '/images/blog/Isolate cars from distracting surroundings-BG removed.jpg'
    },
    animals: {
      title: 'Cute Pets on Clean, Shareable Backgrounds',
      description:
        'Remove backgrounds behind pets for postcards, social posts, adoption listings, and fun custom designs.',
      beforeSrc: '/images/blog/Cute Pets on Clean, Shareable Backgrounds.jpg',
      afterSrc: '/images/blog/Cute Pets on Clean, Shareable Backgrounds-BG removed.jpg'
    },
    'real-estate': {
      title: 'Striking Real Estate and Interior Shots',
      description:
        'Highlight rooms, furniture, and properties by stripping away visual noise so layouts and details stand out.',
      beforeSrc: '/images/blog/Striking Real Estate and Interior Shots.jpg',
      afterSrc: '/images/blog/Striking Real Estate and Interior Shots-BG removed.jpg'
    }
  };

  const [activeRemoveBgUseCase, setActiveRemoveBgUseCase] = useState<(typeof removeBgUseCaseTabs)[number]['id']>('people');

  const productUseCaseTabs: {
    id: 'jewelry' | 'clothing' | 'perfumes' | 'food-beverages' | 'furniture' | 'beauty';
    label: string;
  }[] = [
    { id: 'jewelry', label: 'Jewelry' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'perfumes', label: 'Perfumes' },
    { id: 'food-beverages', label: 'Food and Beverages' },
    { id: 'furniture', label: 'Furniture and Home Decor' },
    { id: 'beauty', label: 'Beauty and Cosmetics' }
  ];

  const productUseCases: Record<
    (typeof productUseCaseTabs)[number]['id'],
    { title: string; description: string; imageSrc: string; imageAlt: string }
  > = {
    jewelry: {
      title: 'Luxury jewelry product shots',
      description:
        'Highlight fine details, shine, and craftsmanship with clean, close-up jewelry photos tailored for online stores and campaigns.',
      imageSrc: '/images/blog/product-jewelry-placeholder.jpg',
      imageAlt: 'AI-generated jewelry product photo on a stylized background'
    },
    clothing: {
      title: 'Fashion and clothing catalog images',
      description:
        'Create professional clothing photos for lookbooks, marketplaces, and social media without booking a physical studio every time.',
      imageSrc: '/images/blog/product-clothing-placeholder.jpg',
      imageAlt: 'AI-styled clothing product photo arranged for ecommerce'
    },
    perfumes: {
      title: 'Premium perfume and fragrance scenes',
      description:
        'Place perfume bottles in atmospheric settings with soft lighting, reflections, and props that feel elegant and on-brand.',
      imageSrc: '/images/blog/product-perfumes-placeholder.jpg',
      imageAlt: 'Perfume bottle product photo in an elegant AI-generated setup'
    },
    'food-beverages': {
      title: 'Food and beverage hero shots',
      description:
        'Generate appetizing food and drink compositions with realistic textures, steam, and table settings tailored to your menu or campaign.',
      imageSrc: '/images/blog/product-food-placeholder.jpg',
      imageAlt: 'Food and beverage product photo styled on a tabletop scene'
    },
    furniture: {
      title: 'Furniture and home decor room sets',
      description:
        'Show furniture and decor inside complete rooms, with lighting and styling that matches your brand’s interior look.',
      imageSrc: '/images/blog/product-furniture-placeholder.jpg',
      imageAlt: 'Furniture product photo in a modern AI-generated room'
    },
    beauty: {
      title: 'Beauty and cosmetics product layouts',
      description:
        'Design polished beauty flatlays and close-ups for skincare, makeup, and haircare that feel editorial and consistent across campaigns.',
      imageSrc: '/images/blog/product-beauty-placeholder.jpg',
      imageAlt: 'Beauty and cosmetics product photo arranged with props'
    }
  };

  const [activeProductUseCase, setActiveProductUseCase] = useState<(typeof productUseCaseTabs)[number]['id']>(
    'jewelry'
  );
  
  // Find the tool based on the toolId param
  const tool = tools.find(t => t.id === toolId);
  
  // If tool not found, redirect to tools page
  if (!tool) {
    return <Navigate to="/tools" replace />;
  }

  const beforeImagePreview = (() => {
    if (tool.id === 'ai-face-swap') {
      return faceSwapTargetImage.preview;
    }
    if (tool.id === 'ai-image-to-image') {
      return i2iMainImage.preview;
    }
    if (tool.id === 'ai-sketch-to-image') {
      if (s2iInputMode === 'upload') {
        return s2iSketchImage.preview;
      }
      return null;
    }
    if (tool.id === 'ai-image-generator') {
      return null;
    }
    return selectedImage.preview;
  })();

  const canShowComparisonSlider = !!beforeImagePreview && !!processedImage.url;

  // Debounced scroll function for outfit style selection
  const debouncedScrollToGenerate = debounce(() => {
    scrollToGenerateButton();
  }, 300);
  
  const handleImageSelect = (imageFile: ImageFile) => {
    setSelectedImage(imageFile);
    // Reset processed image when a new image is selected
    setProcessedImage({
      url: null,
      isLoading: false,
      error: null
    });
    setCanvasInitialized(false);
    setReplaceCanvasInitialized(false);
    setIsMaskDrawn(false);
    setImageDimensions(null); // Reset dimensions on new image select

    if (imageFile.file && imageFile.preview) {
      const img = new Image();
      img.onload = () => {
        // We have the dimensions! Store them in state.
        const dimensions = { width: img.naturalWidth, height: img.naturalHeight };
        console.log("Image dimensions:", dimensions);
        setImageDimensions(dimensions);

        // --- THE VALIDATION LOGIC ---
        const longestSide = Math.max(dimensions.width, dimensions.height);
        if (longestSide > 2048) {
          setAvailableUpscaleOptions([]); // No options available
          setProcessedImage({ url: null, isLoading: false, error: "Image is too large (max 2048px on longest side) and cannot be upscaled." });
        } else if (longestSide > 1024) {
          setAvailableUpscaleOptions([2]); // Only 2x is available
          setUpscaleFactor(2); // Automatically select 2x
        } else {
          setAvailableUpscaleOptions([2, 4]); // Both 2x and 4x are available
          setUpscaleFactor(2); // Default to 2x
        }
      };
      img.src = imageFile.preview;
    }
  };

const handleAIFaceSwapGenerate = async () => {
  // Validate that we have a target image
  if (!faceSwapTargetImage.file) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please upload a target image.' });
    return;
  }
  
  // Validate that we have a source face (either preset or uploaded)
  if (!selectedFaceSwapPreset && !faceSwapSourceImage.file) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please select a preset face or upload a source face image.' });
    return;
  }
  
  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload target image
    const targetImageUrl = await uploadImageAndGetUrl(faceSwapTargetImage.file);

    // 2. Get source face image URL
    let sourceImageUrl: string;
    
    if (selectedFaceSwapPreset) {
      // Use preset face - convert URL to blob and upload
      const sourceImageBlob = await convertUrlToBlob(selectedFaceSwapPreset.imageUrl);
      sourceImageUrl = await uploadImageAndGetUrl(new File([sourceImageBlob], "source-face.jpeg", { type: 'image/jpeg' }));
    } else {
      // Use uploaded source image
      sourceImageUrl = await uploadImageAndGetUrl(faceSwapSourceImage.file!);
    }

    // 3. Start face swap job
    const orderId = await startFaceSwapJob({
      imageUrl: targetImageUrl,
      styleImageUrl: sourceImageUrl,
    });

    // 4. Poll until complete
    const resultUrl = await pollV1JobUntilComplete(orderId);

    // 5. Display the result
    setProcessedImage({ url: resultUrl, isLoading: false, error: null });

  } catch (error) {
    console.error("An error occurred during face swap generation:", error);
    setProcessedImage({ url: null, isLoading: false, error: (error as Error).message });
  }
};
  
  // Handle image load for AI Cleanup - synchronizes canvas with displayed image
  const handleCleanupImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.target as HTMLImageElement;
    const visibleCanvas = visibleCanvasRef.current;
    const dataCanvas = dataMaskCanvasRef.current;
    
    if (!visibleCanvas || !dataCanvas) return;
    
    // Set canvas dimensions to match the displayed image size
    const displayWidth = image.clientWidth;
    const displayHeight = image.clientHeight;
    
    // Set both canvases to match displayed image dimensions
    visibleCanvas.width = displayWidth;
    visibleCanvas.height = displayHeight;
    dataCanvas.width = displayWidth;
    dataCanvas.height = displayHeight;
    
    // Initialize data canvas with black background (unmask area)
    const dataCtx = dataCanvas.getContext('2d');
    if (dataCtx) {
      dataCtx.fillStyle = '#000000';
      dataCtx.fillRect(0, 0, displayWidth, displayHeight);
    }
    
    // Clear visible canvas (transparent background)
    const visibleCtx = visibleCanvas.getContext('2d');
    if (visibleCtx) {
      visibleCtx.clearRect(0, 0, displayWidth, displayHeight);
    }
    
    setCanvasInitialized(true);
  };
  
  // Canvas drawing functions for AI Cleanup
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool?.id !== 'ai-cleanup') return;
    setIsDrawing(true);
    draw(e);
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool?.id !== 'ai-cleanup') return;
    
    const { x, y } = getCoordinatesFromEvent(e.nativeEvent);
    drawAtPoint(x, y);
  };
  
  const clearCanvas = () => {
    const visibleCanvas = visibleCanvasRef.current;
    const dataCanvas = dataMaskCanvasRef.current;
    
    if (visibleCanvas) {
      const visibleCtx = visibleCanvas.getContext('2d');
      if (visibleCtx) {
        visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
      }
    }
    
    if (dataCanvas) {
      const dataCtx = dataCanvas.getContext('2d');
      if (dataCtx) {
        dataCtx.fillStyle = '#000000';
        dataCtx.fillRect(0, 0, dataCanvas.width, dataCanvas.height);
      }
    }
    
    setIsMaskDrawn(false);
  };
  
  // Helper function to get coordinates from mouse or touch events
  const getCoordinatesFromEvent = (event: MouseEvent | Touch): { x: number; y: number } => {
    const canvas = visibleCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };
  
  // Function to draw at a specific point (used by both mouse and touch)
  const drawAtPoint = (x: number, y: number) => {
    if (!visibleCanvasRef.current || !dataMaskCanvasRef.current || tool?.id !== 'ai-cleanup') return;
    
    const visibleCanvas = visibleCanvasRef.current;
    const dataCanvas = dataMaskCanvasRef.current;
    const visibleCtx = visibleCanvas.getContext('2d');
    const dataCtx = dataCanvas.getContext('2d');
    
    if (!visibleCtx || !dataCtx) return;
    
    // Set mask drawn flag on first draw
    if (!isMaskDrawn) {
      setIsMaskDrawn(true);
    }
    
    // Draw semi-transparent red on visible canvas for user feedback
    visibleCtx.globalCompositeOperation = 'source-over';
    visibleCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    visibleCtx.beginPath();
    visibleCtx.arc(x, y, cleanupBrushSize, 0, 2 * Math.PI);
    visibleCtx.fill();
    
    // Draw white on data canvas for API mask
    dataCtx.globalCompositeOperation = 'source-over';
    dataCtx.fillStyle = '#FFFFFF';
    dataCtx.beginPath();
    dataCtx.arc(x, y, cleanupBrushSize, 0, 2 * Math.PI);
    dataCtx.fill();
  };
  
  // Touch event handlers for AI Cleanup
  const handleDrawStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    event.preventDefault(); // Prevent page scrolling
    const touch = event.touches[0];
    const { x, y } = getCoordinatesFromEvent(touch);
    drawAtPoint(x, y);
  };
  
  const handleDrawMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    event.preventDefault();
    const touch = event.touches[0];
    const { x, y } = getCoordinatesFromEvent(touch);
    drawAtPoint(x, y);
  };
  
  const handleDrawEnd = () => {
    setIsDrawing(false);
  };
  
  // Clear selection handler functions
  const handleCartoonClearSelection = () => {
    setSelectedPresetUrl(null);
  };
  
  const handleCaricatureClearSelection = () => {
    setCaricatureSelectedStyle(null);
  };
  
  const handleAvatarClearSelection = () => {
    setAvatarSelectedStyle(null);
  };

  const handleFilterClearSelection = () => {
    setFilterSelectedStyle(null);
  };
  
  const handleProductClearSelection = () => {
    setSelectedProductStyle(null);
  };
  
  // Handle image load for AI Replace - synchronizes canvas with displayed image
  const handleReplaceImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.target as HTMLImageElement;
    const visibleCanvas = replaceVisibleCanvasRef.current;
    const dataCanvas = replaceDataMaskCanvasRef.current;
    
    if (!visibleCanvas || !dataCanvas) return;
    
    // Set canvas dimensions to match the displayed image size
    const displayWidth = image.clientWidth;
    const displayHeight = image.clientHeight;
    
    // Set both canvases to match displayed image dimensions
    visibleCanvas.width = displayWidth;
    visibleCanvas.height = displayHeight;
    dataCanvas.width = displayWidth;
    dataCanvas.height = displayHeight;
    
    // Initialize data canvas with black background (unmask area)
    const dataCtx = dataCanvas.getContext('2d');
    if (dataCtx) {
      dataCtx.fillStyle = '#000000';
      dataCtx.fillRect(0, 0, displayWidth, displayHeight);
    }
    
    // Clear visible canvas (transparent background)
    const visibleCtx = visibleCanvas.getContext('2d');
    if (visibleCtx) {
      visibleCtx.clearRect(0, 0, displayWidth, displayHeight);
    }
    
    setReplaceCanvasInitialized(true);
  };
  
  // Canvas drawing functions for AI Replace
  const startReplaceDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool?.id !== 'ai-replace') return;
    setIsReplaceDrawing(true);
    drawReplace(e);
  };
  
  const stopReplaceDrawing = () => {
    setIsReplaceDrawing(false);
  };
  
  const drawReplace = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isReplaceDrawing || !replaceVisibleCanvasRef.current || !replaceDataMaskCanvasRef.current || tool?.id !== 'ai-replace') return;
    
    const visibleCanvas = replaceVisibleCanvasRef.current;
    const dataCanvas = replaceDataMaskCanvasRef.current;
    const visibleCtx = visibleCanvas.getContext('2d');
    const dataCtx = dataCanvas.getContext('2d');
    
    if (!visibleCtx || !dataCtx) return;
    
    const rect = visibleCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Draw semi-transparent red on visible canvas for user feedback
    visibleCtx.globalCompositeOperation = 'source-over';
    visibleCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    

    
    visibleCtx.beginPath();
    visibleCtx.arc(x, y, replaceBrushSize, 0, 2 * Math.PI);
    visibleCtx.fill();
    
    // Draw white on data canvas for API mask
    dataCtx.globalCompositeOperation = 'source-over';
    dataCtx.fillStyle = '#FFFFFF';
    dataCtx.beginPath();
    dataCtx.arc(x, y, replaceBrushSize, 0, 2 * Math.PI);
    dataCtx.fill();
  };
  
  const clearReplaceCanvas = () => {
    const visibleCanvas = replaceVisibleCanvasRef.current;
    const dataCanvas = replaceDataMaskCanvasRef.current;
    
    if (visibleCanvas) {
      const visibleCtx = visibleCanvas.getContext('2d');
      if (visibleCtx) {
        visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
      }
    }
    
    if (dataCanvas) {
      const dataCtx = dataCanvas.getContext('2d');
      if (dataCtx) {
        dataCtx.fillStyle = '#000000';
        dataCtx.fillRect(0, 0, dataCanvas.width, dataCanvas.height);
      }
    }
  };
  
  // Convert canvas to file for AI Replace
  const replaceCanvasToFile = (): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!replaceDataMaskCanvasRef.current) {
        reject(new Error('Canvas not found'));
        return;
      }
      
      replaceDataMaskCanvasRef.current.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob from canvas'));
          return;
        }
        
        const file = new File([blob], 'mask.png', { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    });
  };
  
  // Convert canvas to File for AI Cleanup
  const canvasToFile = (): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!dataMaskCanvasRef.current) {
        reject(new Error('Canvas not available'));
        return;
      }
      
      dataMaskCanvasRef.current.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to convert canvas to blob'));
          return;
        }
        
        const file = new File([blob], 'mask.png', { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    });
  };
  
  // AI Cleanup specific generate function
  const handleAICleanupGenerate = async () => {
    if (!selectedImage.file) return;
    
    // --- VALIDATION: Check if mask is drawn ---
    if (!isMaskDrawn) {
      setProcessedImage({
        url: null,
        isLoading: false,
        error: 'Error: Please paint over the area you want to clean up before generating.'
      });
      return;
    }
    // --- END OF VALIDATION ---
    
    setProcessedImage({
      url: null,
      isLoading: true,
      error: null
    });
    
    try {
      // Prepare images
      const originalImageFile = selectedImage.file;
      const maskFile = await canvasToFile();
      
      // Upload both images
      const originalFinalUrl = await uploadImageAndGetUrl(originalImageFile);
      const maskFinalUrl = await uploadImageAndGetUrl(maskFile);
      
      // Start the cleanup job
      const orderId = await startCleanupJob({
        originalImageUrl: originalFinalUrl,
        maskedImageUrl: maskFinalUrl
      });
      
      if (!orderId) {
        throw new Error('Failed to start cleanup job');
      }

      const resultUrl = await pollJobUntilComplete(orderId);
      setProcessedImage({
        url: resultUrl,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('AI Cleanup error:', error);
      setProcessedImage({
        url: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };

  // Watermark Remover specific generate function
  const handleAIWatermarkRemoverGenerate = async () => {
    if (!selectedImage.file) return;

    // v2 Watermark Remover DOC compliance: image file must be <= 5MB
    const maxSizeBytes = 5 * 1024 * 1024;
    if (selectedImage.file.size > maxSizeBytes) {
      setProcessedImage({
        url: null,
        isLoading: false,
        error: 'Image exceeds 5MB limit. Please upload a smaller image.'
      });
      return;
    }

    setProcessedImage({ url: null, isLoading: true, error: null });

    try {
      const originalFinalUrl = await uploadImageAndGetUrl(selectedImage.file);

      const orderId = await startWatermarkRemoverJob({ imageUrl: originalFinalUrl });

      if (!orderId) {
        throw new Error('Failed to start watermark remover job');
      }

      const resultUrl = await pollWatermarkJobUntilComplete(orderId);
      setProcessedImage({ url: resultUrl, isLoading: false, error: null });
    } catch (error) {
      console.error('Watermark Remover error:', error);
      setProcessedImage({
        url: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };

  const handleAIExpandGenerate = async () => {
    if (!selectedImage.file) return;
    
    setProcessedImage({
      url: null,
      isLoading: true,
      error: null
    });
    
    try {
      // Upload the image and get the URL
      const imageUrl = await uploadImageAndGetUrl(selectedImage.file);
      
      // Start the expand job
      const orderId = await startExpandJob({
        imageUrl,
        padding
      });
      
      if (!orderId) {
        throw new Error('Failed to start expand job');
      }

      const resultUrl = await pollJobUntilComplete(orderId);
      setProcessedImage({
        url: resultUrl,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('AI Expand error:', error);
      setProcessedImage({
        url: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };

const handleAIReplaceGenerate = async () => {
  if (!selectedImage.file || !textPrompt.trim()) {
    setProcessedImage({
      url: null,
      isLoading: false,
      error: 'Please provide both an image and a text prompt'
    });
    return;
  }
  
  setProcessedImage({
    url: null,
    isLoading: true,
    error: null
  });
  
  try {
    // Upload the original image
    const originalImageUrl = await uploadImageAndGetUrl(selectedImage.file);
    
    // Get the mask from canvas and upload it
    const maskFile = await replaceCanvasToFile();
    const maskedImageUrl = await uploadImageAndGetUrl(maskFile);
    
    console.log('Submitting to API with this prompt:', textPrompt);
    
    // Start the replace job
    const orderId = await startReplaceJob({
      originalImageUrl,
      maskedImageUrl,
      prompt: textPrompt
    });

    if (!orderId) {
      throw new Error('Failed to start replace job');
    }

    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({
      url: resultUrl,
      isLoading: false,
      error: null
    });
    
  } catch (error) {
    console.error('AI Replace error:', error);
    setProcessedImage({
      url: null,
      isLoading: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
};

const handleAICartoonGenerate = async () => {
  if (!selectedImage.file) {
    setProcessedImage({ ...processedImage, error: 'Please select an image first.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload the main user image
    const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);

    // 2. Initialize final parameters
    let finalStyleImageUrl: string | undefined = undefined;
    let finalPrompt: string = "";

    // 3. Handle the two different style sources correctly
    if (selectedPresetUrl) {
      // === PATH A: USER CHOSE A PRESET STYLE ===
      finalPrompt = "cartoon style transformation"; // Default for preset
      console.log(`Processing preset style from URL: ${selectedPresetUrl}`);
      
      // Fetch the preset image and re-upload it
      const styleImageBlob = await convertUrlToBlob(selectedPresetUrl);
      finalStyleImageUrl = await uploadImageAndGetUrl(new File([styleImageBlob], "style.jpg", { type: 'image/jpeg' }));

    } else if (cartoonStyleImage) {
      // === PATH B: USER UPLOADED A CUSTOM STYLE IMAGE (THIS IS THE FIX) ===
      finalPrompt = cartoonTextPrompt; // CRITICAL: Get the prompt from the TEXTAREA state
      console.log("Processing CUSTOM uploaded style image.");

      // CRITICAL: Upload the user's local file directly
      finalStyleImageUrl = await uploadImageAndGetUrl(cartoonStyleImage);
    
    } else {
      // Path C: User is using TEXT-PROMPT ONLY
      finalPrompt = cartoonTextPrompt;
    }

    // 4. Clean debug logging (FIXED: removed problematic template literal)
    console.log('Main URL:', mainImageUrl);
    console.log('Style URL:', finalStyleImageUrl);
    console.log('Text Prompt:', finalPrompt);
    
    // 5. Start the cartoon job with corrected logic
    const orderId = await startCartoonJob({
      imageUrl: mainImageUrl,
      styleImageUrl: finalStyleImageUrl,
      textPrompt: finalPrompt || "cartoon style transformation" // ALWAYS send the prompt, never undefined
    });

    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({ 
      url: resultUrl, 
      isLoading: false, 
      error: null 
    });

    // Scroll to result container with device-adaptive behavior
    setTimeout(() => {
      scrollToResultContainer().catch(console.error);
    }, 100);

    // Scroll to result container with device-adaptive behavior
    setTimeout(() => {
      scrollToResultContainer().catch(console.error);
    }, 100);

  } catch (error) {
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
    });
  }
};

const handleAICaricatureGenerate = async () => {
  if (!selectedImage.file) {
    console.error("No user image provided.");
    return;
  }
  
  // A style source (preset or custom) should be guaranteed by the disabled button logic
  if (!caricatureSelectedStyle && !caricatureCustomStyleImage) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please select a style image before generating.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload the main user image
    const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);

    // 2. Initialize final parameters
    let finalStyleUrl: string | undefined = undefined;
    let finalPrompt: string = "";

    // 3. Handle the two different style sources correctly
    if (caricatureSelectedStyle) {
      // === PATH A: USER CHOSE A PRESET STYLE ===
      finalPrompt = caricatureSelectedStyle.prompt; // Get the prompt from the preset data
      console.log(`Processing PRESET style: ${caricatureSelectedStyle.name}`);
      
      // Fetch the preset image and re-upload it
      const styleImageBlob = await convertUrlToBlob(caricatureSelectedStyle.imageUrl);
      finalStyleUrl = await uploadImageAndGetUrl(new File([styleImageBlob], "style.jpeg", { type: 'image/jpeg' }));

    } else if (caricatureCustomStyleImage) {
      // === PATH B: USER UPLOADED A CUSTOM STYLE IMAGE (THIS IS THE FIX) ===
      finalPrompt = caricatureTextPrompt; // CRITICAL: Get the prompt from the TEXTAREA state
      console.log("Processing CUSTOM uploaded style image.");

      // CRITICAL: Upload the user's local file directly
      finalStyleUrl = await uploadImageAndGetUrl(caricatureCustomStyleImage);
    }

    // 4. Call the job with guaranteed valid data
    const orderId = await startCaricatureJob({
      imageUrl: mainImageUrl,
      styleImageUrl: finalStyleUrl,
      textPrompt: finalPrompt || "humorous artistic caricature"
    });

    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({ 
      url: resultUrl, 
      isLoading: false, 
      error: null 
    });
  } catch (error) {
    console.error("An error occurred during caricature generation:", error);
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
    });
  }
};

const handleAIAvatarGenerate = async () => {
  if (!selectedImage.file) {
    console.error("No user image provided.");
    return;
  }
  
  // A style source (preset or custom) should be guaranteed by the disabled button logic
  if (!avatarSelectedStyle && !avatarCustomStyleImage) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please select a style before generating.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload the main user image
    const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);

    // 2. Initialize final parameters
    let finalStyleUrl: string | undefined = undefined;
    let finalPrompt: string = "";

    // 3. Handle the two different style sources correctly
    if (avatarSelectedStyle) {
      // === PATH A: USER CHOSE A PRESET STYLE ===
      finalPrompt = avatarSelectedStyle.prompt; // Get the prompt from the preset data
      console.log(`Processing PRESET style: ${avatarSelectedStyle.name}`);
      
      // Fetch the preset image and re-upload it
      const styleImageBlob = await convertUrlToBlob(avatarSelectedStyle.imageUrl);
      finalStyleUrl = await uploadImageAndGetUrl(new File([styleImageBlob], "style.jpeg", { type: 'image/jpeg' }));

    } else if (avatarCustomStyleImage) {
      // === PATH B: USER UPLOADED A CUSTOM STYLE IMAGE (THIS IS THE FIX) ===
      finalPrompt = avatarTextPrompt; // CRITICAL: Get the prompt from the TEXTAREA state
      console.log("Processing CUSTOM uploaded style image.");

      // CRITICAL: Upload the user's local file directly
      finalStyleUrl = await uploadImageAndGetUrl(avatarCustomStyleImage);
    }

    // 4. Call the job with guaranteed valid data
    const orderId = await startAvatarJob({
      imageUrl: mainImageUrl,
      styleImageUrl: finalStyleUrl,
      textPrompt: finalPrompt || "A high-quality avatar"
    });

    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({ 
      url: resultUrl, 
      isLoading: false, 
      error: null 
    });
  } catch (error) {
    console.error("An error occurred during avatar generation:", error);
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
    });
  }
};

const handleAIPortraitGenerate = async () => {
  if (!selectedImage.file) {
    console.error("No user image provided.");
    return;
  }
  
  // A style source (preset or custom) should be guaranteed by the disabled button logic
  if (!portraitSelectedStyle && !portraitCustomStyleImage) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please select a style before generating.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload the main user image
    const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);

    // 2. Initialize final parameters
    let finalStyleUrl: string | undefined = undefined;
    let finalPrompt: string = "";

    // 3. Handle the two different style sources correctly
    if (portraitSelectedStyle) {
      // === PATH A: USER CHOSE A PRESET STYLE ===
      finalPrompt = portraitSelectedStyle.prompt; // Get the prompt from the preset data
      console.log(`Processing PRESET style: ${portraitSelectedStyle.name}`);
      
      // Fetch the preset image and re-upload it
      const styleImageBlob = await convertUrlToBlob(portraitSelectedStyle.imageUrl);
      finalStyleUrl = await uploadImageAndGetUrl(new File([styleImageBlob], "style.jpeg", { type: 'image/jpeg' }));

    } else if (portraitCustomStyleImage) {
      // === PATH B: USER UPLOADED A CUSTOM STYLE IMAGE ===
      finalPrompt = portraitTextPrompt; // Get the prompt from the TEXTAREA state
      console.log("Processing CUSTOM uploaded style image.");

      // Upload the user's local file directly
      finalStyleUrl = await uploadImageAndGetUrl(portraitCustomStyleImage);
    }

    // 4. Call the job with guaranteed valid data
    const orderId = await startPortraitJob({
      imageUrl: mainImageUrl,
      styleImageUrl: finalStyleUrl,
      textPrompt: finalPrompt || "A high-quality portrait"
    });

    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({ 
      url: resultUrl, 
      isLoading: false, 
      error: null 
    });
  } catch (error) {
    console.error("An error occurred during portrait generation:", error);
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
    });
  }
};

const handleAIProductPhotoshootGenerate = async () => {
  if (!selectedImage.file) {
    console.error("No user image provided.");
    return;
  }
  
  // A style source (preset, custom image, or text) is needed
  if (!selectedProductStyle && !productCustomStyleImage && !productTextPrompt) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please select a style, upload a style image, or enter a text prompt.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload the main product image
    const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);

    // 2. Initialize final parameters
    let finalStyleUrl: string | undefined = undefined;
    let finalPrompt: string = "";

    // 3. Correctly determine the style source and prepare parameters
    if (selectedProductStyle) {
      // Path A: User chose a PRESET style
      finalPrompt = selectedProductStyle.prompt;
      console.log(`Processing PRESET style: ${selectedProductStyle.name}`);
      
      // Fetch the preset image and re-upload it
      const styleImageBlob = await convertUrlToBlob(selectedProductStyle.imageUrl);
      finalStyleUrl = await uploadImageAndGetUrl(new File([styleImageBlob], "style.jpeg", { type: 'image/jpeg' }));

    } else if (productCustomStyleImage) {
      // Path B: User uploaded a CUSTOM style image
      finalPrompt = productTextPrompt; // Use the text from the textarea
      console.log("Processing CUSTOM uploaded style image.");
      
      // Upload the user's local file directly
      finalStyleUrl = await uploadImageAndGetUrl(productCustomStyleImage);
    } else {
      // Path C: User is using ONLY a text prompt
      finalPrompt = productTextPrompt;
    }

    // 4. Call the API job function with all parameters
    const orderId = await startProductPhotoshootJob({
      imageUrl: mainImageUrl,
      styleImageUrl: finalStyleUrl,
      textPrompt: finalPrompt,
    });

    // 5. Use our robust, unified poller to get the result
    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({ 
      url: resultUrl, 
      isLoading: false, 
      error: null 
    });

  } catch (error) {
    console.error("An error occurred during product photo generation:", error);
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
    });
  }
};

const handleAIBackgroundGeneratorGenerate = async () => {
  if (!selectedImage.file) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please select an image first.' });
    return;
  }

  if (!backgroundTextPrompt.trim()) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please enter a text prompt describing the background you want.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // Upload the main image
    const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);

    // Start the background generator job
    const orderId = await startBackgroundGeneratorJob({
      imageUrl: mainImageUrl,
      textPrompt: backgroundTextPrompt
    });

    // Poll for completion
    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({ 
      url: resultUrl, 
      isLoading: false, 
      error: null 
    });

  } catch (error) {
    console.error('An error occurred during background generation:', error);
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
    });
  }
};

// Add this function to resize images client-side if needed
const resizeImageToResolution = async (imageUrl: string, targetWidth: number, targetHeight: number): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
  });
};

const handleAIImageGeneratorGenerate = async () => {
  if (!imageGeneratorTextPrompt.trim()) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please enter a text prompt describing the image you want to generate.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // Start the image generator job
    const orderId = await startImageGeneratorJob({
      textPrompt: imageGeneratorTextPrompt,
      width: selectedResolution.width,
      height: selectedResolution.height
    });

    // Poll for completion
    const resultUrl = await pollJobUntilComplete(orderId);

    // Optionally resize to match selected resolution
    const resizedUrl = await resizeImageToResolution(
      resultUrl, 
      selectedResolution.width, 
      selectedResolution.height
    );

    setProcessedImage({ 
      url: resizedUrl, 
      isLoading: false, 
      error: null 
    });

    // Scroll to result container with device-adaptive behavior
    setTimeout(() => {
      scrollToResultContainer().catch(console.error);
    }, 100);

  } catch (error) {
    console.error('An error occurred during image generation:', error);
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
    });
  }
};

const handleAIOutfitGenerate = async () => {
  if (!selectedImage.file) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please upload an image.' });
    return;
  }
  
  if (!outfitTextPrompt.trim()) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please enter a text prompt describing the outfit you want.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload the image
    const imageUrl = await uploadImageAndGetUrl(selectedImage.file);

    // 2. Start the outfit job
    const orderId = await startOutfitJob({
      imageUrl: imageUrl,
      textPrompt: outfitTextPrompt,
    });

    // 3. Poll until complete
    const resultUrl = await pollJobUntilComplete(orderId);

    // 4. Display the result
    setProcessedImage({ url: resultUrl, isLoading: false, error: null });

    // 5. Scroll to result container with device-adaptive behavior
    setTimeout(() => {
      scrollToResultContainer().catch(console.error);
    }, 100);

  } catch (error) {
    console.error("An error occurred during outfit generation:", error);
    setProcessedImage({ url: null, isLoading: false, error: (error as Error).message });
  }
};

const handleAIImageToImageGenerate = async () => {
  if (!i2iMainImage.file) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please upload a main image.' });
    return;
  }
  
  if (!i2iTextPrompt.trim()) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please enter a text prompt describing the transformation you want.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload the main image
    const mainImageUrl = await uploadImageAndGetUrl(i2iMainImage.file);
    console.log('DEBUG: mainImageUrl after upload:', mainImageUrl);

    // 2. Upload style image if provided
    let styleImageUrl: string | undefined;
    if (i2iStyleImage.file) {
      styleImageUrl = await uploadImageAndGetUrl(i2iStyleImage.file);
      console.log('DEBUG: styleImageUrl after upload:', styleImageUrl);
    }

    // 3. Start the image-to-image job
    const jobParams = {
      imageUrl: mainImageUrl,
      textPrompt: i2iTextPrompt,
      styleImageUrl: styleImageUrl,
      strength: i2iStrength,
      styleStrength: i2iStyleImage.file ? i2iStyleStrength : undefined,
    };
    console.log('DEBUG: jobParams before API call:', jobParams);
    
    const orderId = await startImageToImageJob(jobParams);

    // 4. Poll until complete
    const resultUrl = await pollJobUntilComplete(orderId);

    // 5. Display the result
    setProcessedImage({ url: resultUrl, isLoading: false, error: null });

  } catch (error) {
     console.error("An error occurred during image-to-image generation:", error);
     setProcessedImage({ url: null, isLoading: false, error: (error as Error).message });
   }
 };

 const handleAISketchToImageGenerate = async () => {
   // Validation
   if (s2iInputMode === 'upload' && !s2iSketchImage.file) {
     setProcessedImage({ url: null, isLoading: false, error: 'Please upload a sketch image.' });
     return;
   }
   
   if (s2iInputMode === 'draw') {
     const canvas = drawingCanvasRef.current;
     if (!canvas) {
       setProcessedImage({ url: null, isLoading: false, error: 'Drawing canvas not available.' });
       return;
     }
     
     // Check if canvas has any drawing (not just white)
     const ctx = canvas.getContext('2d');
     if (!ctx) {
       setProcessedImage({ url: null, isLoading: false, error: 'Cannot access drawing canvas.' });
       return;
     }
     
     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
     const data = imageData.data;
     let hasDrawing = false;
     
     // Check if any pixel is not white (255, 255, 255)
     for (let i = 0; i < data.length; i += 4) {
       if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
         hasDrawing = true;
         break;
       }
     }
     
     if (!hasDrawing) {
       setProcessedImage({ url: null, isLoading: false, error: 'Please draw something on the canvas first.' });
       return;
     }
   }
   
   if (!s2iTextPrompt.trim()) {
     setProcessedImage({ url: null, isLoading: false, error: 'Please enter a text prompt describing the final image you want.' });
     return;
   }

   setProcessedImage({ url: null, isLoading: true, error: null });

   try {
     let sketchImageUrl: string;
     
     if (s2iInputMode === 'upload') {
       // Upload the sketch file
       sketchImageUrl = await uploadImageAndGetUrl(s2iSketchImage.file!);
     } else {
       // Convert canvas to blob and upload
       const canvas = drawingCanvasRef.current!;
       const blob = await new Promise<Blob>((resolve) => {
         canvas.toBlob((blob) => resolve(blob!), 'image/png');
       });
       
       // Convert Blob to File for uploadImageAndGetUrl
       const file = new File([blob], 'sketch.png', { type: 'image/png' });
       sketchImageUrl = await uploadImageAndGetUrl(file);
     }
     
     console.log('DEBUG: sketchImageUrl after upload:', sketchImageUrl);

     // Upload style image if provided
     let styleImageUrl: string | undefined;
     if (s2iStyleImage.file) {
       styleImageUrl = await uploadImageAndGetUrl(s2iStyleImage.file);
       console.log('DEBUG: styleImageUrl after upload:', styleImageUrl);
     }

     // Start the sketch-to-image job
     const jobParams = {
       imageUrl: sketchImageUrl,
       textPrompt: s2iTextPrompt,
       strength: s2iStrength,
       styleImageUrl: styleImageUrl,
       styleStrength: s2iStyleImage.file ? s2iStyleStrength : undefined,
     };
     console.log('DEBUG: sketch-to-image jobParams before API call:', jobParams);
     
     const orderId = await startSketchToImageJob(jobParams);

     // Poll until complete
     const resultUrl = await pollJobUntilComplete(orderId);

     // Display the result
     setProcessedImage({ url: resultUrl, isLoading: false, error: null });

   } catch (error) {
     console.error("An error occurred during sketch-to-image generation:", error);
     setProcessedImage({ url: null, isLoading: false, error: (error as Error).message });
   }
 };

 const handleAIHairstyleGenerate = async () => {
   // Validate that we have an image
   if (!selectedImage.file) {
     setProcessedImage({ url: null, isLoading: false, error: 'Please upload an image.' });
     return;
   }
   
   // Validate that we have a text prompt
   if (!hairstyleTextPrompt.trim()) {
     setProcessedImage({ url: null, isLoading: false, error: 'Please enter a hairstyle description.' });
     return;
   }
   
   setProcessedImage({ url: null, isLoading: true, error: null });
 
   try {
     // Upload the image
     const imageUrl = await uploadImageAndGetUrl(selectedImage.file);
 
     // Start the hairstyle job
     const orderId = await startHairstyleJob({
       imageUrl: imageUrl,
       textPrompt: hairstyleTextPrompt,
     });
 
     // Poll until complete
     const resultUrl = await pollJobUntilComplete(orderId);
 
     // Display the result
     setProcessedImage({ url: resultUrl, isLoading: false, error: null });
 
   } catch (error) {
     console.error("An error occurred during hairstyle generation:", error);
     setProcessedImage({ url: null, isLoading: false, error: (error as Error).message });
   }
 };

 const handleAIUpscalerGenerate = async () => {
   if (!selectedImage.file) { return; }
   
   setProcessedImage({ url: null, isLoading: true, error: null });

   try {
       // 1. Upload the main image.
       const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);
       
       // 2. Call the API job function with the user's selected (and validated) factor.
       const orderId = await startUpscaleJob({
           imageUrl: mainImageUrl,
           quality: upscaleFactor,
       });

       // 3. Use our unified poller to get the result.
       const resultUrl = await pollJobUntilComplete(orderId);

       // 4. Display the upscaled image.
       setProcessedImage({ url: resultUrl, isLoading: false, error: null });

       // Scroll to result container with device-adaptive behavior
       setTimeout(() => {
         scrollToResultContainer().catch(console.error);
       }, 100);

   } catch (error) {
       console.error("An error occurred during image upscaling:", error);
       setProcessedImage({ url: null, isLoading: false, error: (error as Error).message });
   }
 };

 const handleAIFilterGenerate = async () => {
     // 1. Validate inputs and set loading state
     if (!selectedImage.file) {
         setProcessedImage({ url: null, isLoading: false, error: "Please upload an image first." });
         return;
     }
     if (!filterSelectedStyle && !filterCustomStyleImage && !filterTextPrompt) {
         setProcessedImage({ url: null, isLoading: false, error: "Please select a preset style, upload a custom style, or enter a text prompt." });
         return;
     }

     setProcessedImage({ url: null, isLoading: true, error: null });

     try {
         // 2. Upload the main image
         const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);

         // 3. Initialize final parameters
         let finalStyleUrl: string | undefined = undefined;
         let finalPrompt: string = "";

         // 4. Correctly determine the style source
        if (filterSelectedStyle) {
            finalPrompt = filterSelectedStyle.prompt;
            const styleImageBlob = await convertUrlToBlob(filterSelectedStyle.imageUrl);
            finalStyleUrl = await uploadImageAndGetUrl(new File([styleImageBlob], "style.jpeg", { type: 'image/jpeg' }));
        } else if (filterCustomStyleImage) {
            finalPrompt = filterTextPrompt;
            finalStyleUrl = await uploadImageAndGetUrl(filterCustomStyleImage);
        } else {
            finalPrompt = filterTextPrompt;
        }

         // 5. Call the API job function with all parameters
         const orderId = await startAIFilterJob({
             imageUrl: mainImageUrl,
             styleImageUrl: finalStyleUrl,
             textPrompt: finalPrompt,
         });

         // 6. Use our robust, unified poller
         const resultUrl = await pollJobUntilComplete(orderId);

         // 7. Display the result
         setProcessedImage({ url: resultUrl, isLoading: false, error: null });

     } catch (error) {
         console.error("An error occurred during AI filter generation:", error);
         setProcessedImage({ url: null, isLoading: false, error: (error as Error).message });
     }
 };

  // Canvas initialization is now handled by onLoad events on the image elements
  
  const handleProcessImage = async () => {
    if (!selectedImage.file) return;
    
    setProcessedImage({
      url: null,
      isLoading: true,
      error: null
    });
    
    try {
      const resultUrl = await processImage(tool.apiEndpoint, selectedImage.file);
      
      setProcessedImage({
        url: resultUrl,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Processing error:', error);
      setProcessedImage({
        url: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred while processing the image'
      });
    }
  };
  
  const handleDownload = () => {
    if (!processedImage.url) return;
    
    const link = document.createElement('a');
    link.href = processedImage.url;
    link.download = `${tool.id}-result.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Clean up object URLs when component unmounts or when a new image is processed
  useEffect(() => {
    return () => {
      if (processedImage.url) {
        URL.revokeObjectURL(processedImage.url);
      }
    };
  }, [processedImage.url]);

  // Load tool feature image when tool changes
  useEffect(() => {
    const loadToolImage = async () => {
      if (!tool) return;
      
      setToolFeatureImage(prev => ({ ...prev, isLoading: true }));
      
      try {
        const imageFilename = await findToolImage(tool.id, tool.name);
        if (imageFilename) {
          setToolFeatureImage({
            imagePath: `/images/tools images/${imageFilename}`,
            altText: generateAltText(tool.name),
            isLoading: false
          });
          console.log(`✅ Loaded feature image for ${tool.name}: ${imageFilename}`);
        } else {
          setToolFeatureImage({
            imagePath: null,
            altText: '',
            isLoading: false
          });
          console.log(`❌ No feature image found for ${tool.name}`);
        }
      } catch (error) {
        console.error(`💥 Error loading feature image for ${tool.name}:`, error);
        setToolFeatureImage({
          imagePath: null,
          altText: '',
          isLoading: false
        });
      }
    };

    loadToolImage();
  }, [tool]);

  // Initialize canvas with white background when drawing mode is selected
  useEffect(() => {
    if (tool.id === 'ai-sketch-to-image' && s2iInputMode === 'draw' && drawingCanvasRef.current) {
      const canvas = drawingCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size
        canvas.width = 512;
        canvas.height = 512;
        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Set drawing properties
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [tool.id, s2iInputMode]);

  // Add touch event listeners with passive: false to prevent console errors
  useEffect(() => {
    if (tool.id === 'ai-sketch-to-image' && s2iInputMode === 'draw' && drawingCanvasRef.current) {
      const canvas = drawingCanvasRef.current;

      const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault(); // Prevent page scrolling
        setIsDrawingSketch(true);
        if (canvas && e.touches[0]) {
          const touch = e.touches[0];
          const rect = canvas.getBoundingClientRect();
          const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
          const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.beginPath();
            ctx.moveTo(x, y);
          }
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDrawingSketch) return;
        e.preventDefault(); // Prevent page scrolling
        if (canvas && e.touches[0]) {
          const touch = e.touches[0];
          const rect = canvas.getBoundingClientRect();
          const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
          const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.lineTo(x, y);
            ctx.strokeStyle = s2iBrushColor;
            ctx.lineWidth = s2iBrushSize;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }
      };

      const handleTouchEnd = (e: TouchEvent) => {
        e.preventDefault(); // Prevent page scrolling
        setIsDrawingSketch(false);
      };

      // Add event listeners with passive: false
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

      // Cleanup function
      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [tool.id, s2iInputMode, isDrawingSketch, s2iBrushColor, s2iBrushSize]);
  
  return (
    <>
      <SEO 
        title={tool.name} 
        description={`${tool.description}. Free online tool with instant results.`}
        ogImage={toolFeatureImage.imagePath ? generateOgImageUrl(toolFeatureImage.imagePath) : undefined}
        canonicalUrl={generateCanonicalUrl(tool.path)}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: tool.name,
            url: `https://modernphototools.com${tool.path}`,
            description: `Free online ${tool.name.toLowerCase()} tool. ${tool.description || 'Transform your photos instantly with AI.'}`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD"
            },
            featureList: [
              "AI-powered Processing",
              "Instant Results",
              "No Installation Required",
              "No Registration",
              "Completely Free"
            ]
          })}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {tool.name}
            </h1>
            
            {/* Tool Feature Image */}
            <ToolFeatureImage 
              toolId={tool.id}
              toolName={tool.name}
              imagePath={toolFeatureImage.imagePath ?? ''}
              altText={toolFeatureImage.altText}
            />
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {tool.description}
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">How to use {tool.name}</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {tool.id === 'ai-cleanup' ? (
                <>
                  <li>Upload your image using the tool below</li>
                  <li>Use the brush tool to paint over areas you want to remove</li>
                  <li>Adjust brush size as needed for precision</li>
                  <li>Click "Generate" to let AI intelligently fill the painted areas</li>
                  <li>Download your enhanced image when processing is complete</li>
                </>
              ) : tool.id === 'watermark-remover' ? (
                <>
                  <li>Upload your image using the tool below (max 5MB)</li>
                  <li>Click "Generate" — the tool automatically detects and removes watermarks</li>
                  <li>No mask painting is required; results depend on watermark visibility and contrast</li>
                  <li>Review the result and re-try with a clearer image if needed</li>
                  <li>Download your clean image when processing is complete</li>
                </>
              ) : tool.id === 'ai-expand' ? (
                <>
                  <li>Upload your image using the tool below</li>
                  <li>Adjust the padding values to specify how much to expand each side</li>
                  <li>Click "Generate" to let AI expand your image with new content</li>
                  <li>Download your expanded image when processing is complete</li>
                </>
              ) : tool.id === 'ai-replace' ? (
                <>
                  <li>Upload your image using the tool below</li>
                  <li>Use the brush tool to paint over areas you want to replace</li>
                  <li>Enter a text prompt describing what you want in the painted areas</li>
                  <li>Adjust brush size as needed for precision</li>
                  <li>Click "Generate" to let AI replace the painted areas with your prompt</li>
                  <li>Download your enhanced image when processing is complete</li>
                </>
              ) : tool.id === 'ai-cartoon' ? (
                <>
                  <li>Upload your photo using the tool below (works best with human faces)</li>
                  <li>Choose your stylization method: describe a style with text OR upload a style image</li>
                  <li>If using text: describe the cartoon style you want (e.g., "anime style", "Disney cartoon")</li>
                  <li>If using a style image: upload a reference image with the desired artistic style</li>
                  <li>Click "Generate" to transform your photo into cartoon artwork</li>
                  <li>Download your cartoonized image when processing is complete</li>
                </>
              ) : tool.id === 'ai-avatar' ? (
                <>
                  <li>Upload a clear photo of a human face using the tool below</li>
                  <li>Select your gender to see appropriate avatar styles</li>
                  <li>Choose from preset professional avatar styles OR upload your own style image</li>
                  <li>Optionally add a text prompt to customize the avatar further</li>
                  <li>Click "Generate" to create your professional avatar</li>
                  <li>Download your avatar when processing is complete</li>
                </>
              ) : tool.id === 'ai-portrait' ? (
                <>
                  <li>Upload a clear photo of a person's face using the tool below</li>
                  <li>Select your gender to see appropriate portrait styles</li>
                  <li>Choose from preset realistic portrait styles OR upload your own style image</li>
                  <li>Use suggested prompts or add your own text prompt to customize the portrait</li>
                  <li>Click "Generate" to create your realistic portrait</li>
                  <li>Download your portrait when processing is complete</li>
                </>
              ) : tool.id === 'ai-face-swap' ? (
                <>
                  <li>Upload a target image (the photo you want to modify) using the first dropzone</li>
                  <li>Either choose a preset face from the gallery OR upload your own source face image</li>
                  <li>Click "Generate" to swap the faces</li>
                  <li>Download your face-swapped image when processing is complete</li>
                </>
              ) : tool.id === 'ai-product-photoshoot' ? (
                <>
                  <li>Upload a clear photo of your product using the tool below</li>
                  <li>Choose from preset professional photoshoot styles OR upload your own style image</li>
                  <li>Optionally add a text prompt to describe the desired scene or background</li>
                  <li>Click "Generate" to create your professional product photo</li>
                  <li>Download your enhanced product photo when processing is complete</li>
                </>
              ) : tool.id === 'ai-background-generator' ? (
                <>
                  <li>Upload your image using the tool below</li>
                  <li>Enter a text prompt describing the background you want to generate</li>
                  <li>Be specific about scenes, settings, colors, textures, and style preferences</li>
                  <li>Click "Generate" to let AI create a custom background for your image</li>
                  <li>Download your enhanced image when processing is complete</li>
                </>
              ) : tool.id === 'ai-image-generator' ? (
                <>
                  <li>Select your desired image resolution from the available options</li>
                  <li>Enter a detailed text prompt describing the image you want to create</li>
                  <li>Use suggested prompts for inspiration or create your own custom description</li>
                  <li>Be specific about style, colors, composition, and artistic elements</li>
                  <li>Click "Generate" to let AI create your unique image</li>
                  <li>Download your generated image when processing is complete</li>
                </>
              ) : tool.id === 'ai-outfit' ? (
                <>
                  <li>Upload a clear photo of a person using the tool below</li>
                  <li>Choose from preset outfit styles organized by category OR use suggested prompts</li>
                  <li>Enter a detailed text prompt describing the outfit you want to apply</li>
                  <li>Be specific about clothing type, style, colors, and materials</li>
                  <li>Click "Generate" to let AI change the outfit in your photo</li>
                  <li>Download your transformed image when processing is complete</li>
                </>
              ) : tool.id === 'ai-image-to-image' ? (
                <>
                  <li>Upload your main image that you want to transform</li>
                  <li>Optionally upload a style reference image for visual guidance</li>
                  <li>Adjust the Image Strength slider to control how much the result resembles your main image</li>
                  <li>Adjust the Style Strength slider to control how much the result follows your style image</li>
                  <li>Enter a detailed text prompt describing the transformation you want</li>
                  <li>Click "Generate" to let AI transform your image based on your prompt and settings</li>
                  <li>Download your transformed image when processing is complete</li>
                </>
              ) : tool.id === 'ai-sketch-to-image' ? (
                <>
                  <li>Choose to either draw your sketch or upload an existing sketch image</li>
                  <li>If drawing: Use the canvas to create your sketch with the drawing tools</li>
                  <li>If uploading: Select your sketch image file</li>
                  <li>Enter a detailed text prompt describing the final image you want to create</li>
                  <li>Optionally upload a style reference image for visual guidance</li>
                  <li>Adjust the Sketch Adherence slider to control how closely AI follows your sketch</li>
                  <li>Adjust the Style Strength slider if using a style image</li>
                  <li>Click "Generate" to transform your sketch into a rendered image</li>
                  <li>Download your transformed image when processing is complete</li>
                </>
              ) : tool.id === 'ai-hairstyle' ? (
                <>
                  <li>Upload a clear, front-facing photo of yourself or someone else</li>
                  <li>Describe the hairstyle you want to try on in the text box</li>
                  <li>Or click on one of the suggested hairstyle prompts for inspiration</li>
                  <li>Click "Generate" to see the new hairstyle applied to your photo</li>
                  <li>Download your result when processing is complete</li>
                </>
              ) : tool.id === 'ai-image-upscaler' ? (
                <>
                  <li>Upload your image using the tool below (max 2048px on longest side)</li>
                  <li>Select an upscale factor (2x or 4x) based on your image size</li>
                  <li>Click "Generate" to enhance your image with AI upscaling</li>
                  <li>Download your high-resolution result when processing is complete</li>
                </>
              ) : (
                <>
                  <li>Upload your image using the tool below</li>
                  <li>Click the "{tool.name}" button to process your image</li>
                  <li>Wait for the AI to work its magic</li>
                  <li>Download your result when processing is complete</li>
                </>
              )}
            </ol>
          </div>

          {tool.id === 'remove-background' && (
          <section className="mb-10">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    One Tool, Endless Possibilities
                  </h2>
                  <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                    Explore how the background remover fits into different workflows, from portraits and products to cars, pets, and property photos.
                  </p>
                </div>

                <div className="mb-6 -mx-4">
                  <div className="tabs-scroll px-4 flex gap-2 overflow-x-auto">
                    {removeBgUseCaseTabs.map(tab => {
                      const isActive = tab.id === activeRemoveBgUseCase;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          className={[
                            'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                            isActive
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          ].join(' ')}
                          onClick={() => setActiveRemoveBgUseCase(tab.id)}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <ImageComparison
                      beforeSrc={removeBgUseCases[activeRemoveBgUseCase].beforeSrc}
                      afterSrc={removeBgUseCases[activeRemoveBgUseCase].afterSrc}
                      beforeLabel="Before"
                      afterLabel="After"
                      ariaLabel={`Before and after remove background example for ${removeBgUseCases[activeRemoveBgUseCase].title}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                      {removeBgUseCases[activeRemoveBgUseCase].title}
                    </h3>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      {removeBgUseCases[activeRemoveBgUseCase].description}
                    </p>
                  </div>
              </div>
            </div>
          </section>
          )}

          {tool.id === 'ai-image-upscaler' && (
            <section className="mb-10">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    Upscale images up to 4K in seconds
                  </h2>
                  <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                    Use the AI Image Upscaler to sharpen blurry photos, fix blocky pixels, and clean up noise in a few seconds. Boost image resolution by up to 4x while keeping important details clear enough for large screens and prints.
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <ImageComparison
                      beforeSrc="/images/blog/AI upscaler before.jpg"
                      afterSrc="/images/blog/AI upscaler after.jpg"
                      beforeLabel="Original"
                      afterLabel="Upscaled"
                      ariaLabel="Before and after AI image upscaling example"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                      See the difference with AI upscaling
                    </h3>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      Drag the slider to compare the original image with the enhanced version. Fine details become clearer, edges look smoother, and the overall photo holds up better on 4K displays, social media, and high-quality prints.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tool.id === 'ai-filter' && <FilterHeroSection />}

          {tool.id === 'ai-outfit' && (
            <section className="mb-10">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-full max-w-3xl mx-auto">
                      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
                        <img
                          src={activeOutfitHero?.imageSrc}
                          alt={activeOutfitHero?.imageAlt}
                          loading="lazy"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                      Smart dressing with pre-made AI outfit styles
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-gray-700">
                      Dress up your photos with ready-made women&apos;s and men&apos;s outfit styles powered by Modern AI. Explore new looks in a click and cycle through presets to discover outfits that match your vibe without changing clothes in real life.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-4">
                      {outfitHeroLooks.map((item) => {
                        const isActive = item.id === activeOutfitHeroId;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveOutfitHeroId(item.id)}
                            className={`group focus:outline-none ${
                              isActive ? 'ring-2 ring-blue-500 rounded-2xl' : ''
                            }`}
                          >
                            <div
                              className={`overflow-hidden rounded-2xl border transition-all ${
                                isActive
                                  ? 'border-blue-500 shadow-lg'
                                  : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                              }`}
                            >
                              <img
                                src={item.imageSrc}
                                alt={item.imageAlt}
                                loading="lazy"
                                className="w-28 h-28 md:w-32 md:h-32 object-cover transition-transform group-hover:-translate-y-1"
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tool.id === 'ai-hairstyle' && hairstylePresets.length > 0 && (
            <section className="mb-10">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-full max-w-3xl mx-auto">
                      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
                        <img
                          src={activeHairstylePreset?.imageUrl}
                          alt={`${activeHairstylePreset?.name} AI hairstyle preset`}
                          loading="lazy"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                      Dozens of preset AI hairstyles
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-gray-700">
                      Browse a gallery of ready-made hairstyles for every gender, texture, and length. ModernPhotoTools&apos; virtual hairstyle try-on uses AI to show realistic previews so you can explore new looks with confidence.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-4">
                      {hairstylePresets.map((style) => {
                        const isActive = style.name === activeHairstylePresetName;
                        return (
                          <button
                            key={style.name}
                            type="button"
                            onClick={() => {
                              setActiveHairstylePresetName(style.name);
                              setHairstyleTextPrompt(style.prompt);
                            }}
                            className={`group focus:outline-none ${
                              isActive ? 'ring-2 ring-blue-500 rounded-2xl' : ''
                            }`}
                          >
                            <div
                              className={`overflow-hidden rounded-2xl border transition-all ${
                                isActive
                                  ? 'border-blue-500 shadow-lg'
                                  : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                              }`}
                            >
                              <img
                                src={style.imageUrl}
                                alt={style.name}
                                loading="lazy"
                                className="w-24 h-24 md:w-28 md:h-28 object-cover transition-transform group-hover:-translate-y-1"
                              />
                            </div>
                            <div className="mt-1 text-xs md:text-sm text-gray-700 text-center">
                              {style.name}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tool.id === 'ai-face-swap' && (
          <section className="mb-10">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-full max-w-3xl mx-auto">
                      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
                        <img
                          src={activeFaceSwapCharacter?.imageSrc}
                          alt={activeFaceSwapCharacter?.imageAlt}
                          loading="lazy"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                      A vast library of characters
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-gray-700">
                      Browse AI-generated characters and presets designed for face swapping. Pick a look and replace faces in a single click while the AI handles alignment and blending.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-4">
                      {faceSwapCharacters.map((item) => {
                        const isActive = item.id === activeFaceSwapCharacterId;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveFaceSwapCharacterId(item.id)}
                            className={`group focus:outline-none ${
                              isActive ? 'ring-2 ring-blue-500 rounded-2xl' : ''
                            }`}
                          >
                            <div
                              className={`overflow-hidden rounded-2xl border transition-all ${
                                isActive
                                  ? 'border-blue-500 shadow-lg'
                                  : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                              }`}
                            >
                              <img
                                src={item.imageSrc}
                                alt={item.imageAlt}
                                loading="lazy"
                                className="w-28 h-28 md:w-32 md:h-32 object-cover transition-transform group-hover:-translate-y-1"
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tool.id === 'ai-product-photoshoot' && (
            <section className="mb-10">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    AI Product Photoshoot: perfectly capturing every product
                  </h2>
                  <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                    Explore ready-made setups for jewelry, clothing, perfumes, food, decor, and beauty products, then generate matching AI product shots in a click.
                  </p>
                </div>

                <div className="mb-6 -mx-4">
                  <div className="tabs-scroll px-4 flex gap-2 overflow-x-auto">
                    {productUseCaseTabs.map(tab => {
                      const isActive = tab.id === activeProductUseCase;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          className={[
                            'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                            isActive
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          ].join(' ')}
                          onClick={() => setActiveProductUseCase(tab.id)}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-full max-w-3xl mx-auto">
                      <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        <img
                          src={productUseCases[activeProductUseCase].imageSrc}
                          alt={productUseCases[activeProductUseCase].imageAlt}
                          loading="lazy"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                      {productUseCases[activeProductUseCase].title}
                    </h3>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      {productUseCases[activeProductUseCase].description}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tool.id === 'ai-image-generator' && (
            <section className="mb-10">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    AI Image Creator: Transform text into images online
                  </h2>
                  <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                    Transform words into innovative realms, algorithmic portraits, and commercial visuals using the finest AI image generator. Featuring a user-friendly interface and no need for prompting expertise, it is ideal for designers, creators, and businesses.
                  </p>
                </div>
                <div className="max-w-3xl mx-auto">
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-black">
                    <video
                      src="/videos/text-to-image_video-tool-page.mp4"
                      autoPlay
                      loop
                      playsInline
                      muted
                      preload="none"
                      className="w-full h-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tool.id === 'ai-image-to-image' && <ImageToImageHeroSection />}

          {tool.id === 'ai-sketch-to-image' && <SketchToImageHeroSection />}

          {tool.id === 'ai-avatar' && (
            <section className="mb-10">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    One Tool, Endless Avatar Possibilities
                  </h2>
                  <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                    Explore how the AI Avatar generator fits into different workflows, from gaming profiles and social content to professional headshots and creator branding.
                  </p>
                </div>
                <div className="max-w-3xl mx-auto">
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-black">
                    <video
                      src="/videos/AI-avatar_video-tool.mp4"
                      autoPlay
                      loop
                      playsInline
                      muted
                      preload="none"
                      className="w-full h-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
          </div>
        </div>
      </section>
          )}

          {tool.id === 'ai-cartoon' && <CartoonHeroSection />}
          {tool.id === 'ai-caricature' && <CaricatureHeroSection />}
          {tool.id === 'ai-portrait' && <PortraitHeroSection />}

          {tool.id === 'ai-expand' && <ExpandHeroSection />}

          {tool.id === 'ai-replace' && <ReplaceHeroSection />}

          {tool.id === 'ai-cleanup' && <CleanupUseCasesSection />}

          {tool.id === 'ai-background-generator' && <BackgroundHeroSection />}
          {tool.id === 'watermark-remover' && <WatermarkHeroSection />}
          
          {/* Add PromptsGuide for tools that use text prompts */}
          {(tool.id === 'ai-replace' || 
            tool.id === 'ai-cartoon' || 
            tool.id === 'ai-caricature' || 
            tool.id === 'ai-avatar' || 
            tool.id === 'ai-product-photoshoot' || 
            tool.id === 'ai-background-generator' || 
            tool.id === 'ai-image-generator' || 
            tool.id === 'ai-portrait' || 
            tool.id === 'ai-outfit' || 
            tool.id === 'ai-image-to-image' || 
            tool.id === 'ai-sketch-to-image' || 
            tool.id === 'ai-hairstyle' || 
            tool.id === 'ai-filter') && (
            <div className="mb-8">
              <PromptsGuide />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 md:mb-8">
            <div className="space-y-6">
              {/* Show ImageDropzone for all tools except AI Image Generator, AI Face Swap, AI Image to Image, and AI Sketch to Image */}
              {tool.id !== 'ai-image-generator' && tool.id !== 'ai-face-swap' && tool.id !== 'ai-image-to-image' && tool.id !== 'ai-sketch-to-image' && (
                <ImageDropzone 
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                />
              )}
              
              {/* AI Face Swap specific image inputs */}
              {tool.id === 'ai-face-swap' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">1. Upload Target Image</h3>
                    <p className="text-sm text-gray-600 mb-3">The photo you want to modify</p>
                    <ImageDropzone 
                      onImageSelect={(imageFile) => setFaceSwapTargetImage(imageFile)}
                      selectedImage={faceSwapTargetImage}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">2. Upload Source Face Image</h3>
                    <p className="text-sm text-gray-600 mb-3">The face you want to use (disabled if preset selected)</p>
                    <ImageDropzone 
                      onImageSelect={(imageFile) => setFaceSwapSourceImage(imageFile)}
                      selectedImage={faceSwapSourceImage}
                      disabled={!!selectedFaceSwapPreset}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Or Choose a Preset Source Face</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {faceSwapStyles.map((style) => {
                        const isSelected = selectedFaceSwapPreset?.imageUrl === style.imageUrl;
                        return (
                          <div
                            key={style.imageUrl}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                              isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
                            }`}
                            onClick={() => {
                              setSelectedFaceSwapPreset(style);
                              setFaceSwapSourceImage({ file: null, preview: null });
                            }}
                          >
                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setSelectedFaceSwapPreset(null); }}
                                className="absolute top-1 right-1 z-10 p-1 bg-white bg-opacity-70 rounded-full text-red-600 hover:bg-opacity-100 hover:scale-110 transition-transform"
                                aria-label="Clear selection"
                              >
                                <XCircle size={20} />
                              </button>
                            )}
                            <img src={style.imageUrl} alt={style.name} className="w-full h-auto object-cover" />
                            <p className="text-center text-xs p-1 bg-gray-100">{style.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
               
              {/* AI Cleanup specific controls */}
              {tool.id === 'ai-cleanup' && selectedImage.preview && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <Brush className="w-4 h-4" />
                      <span className="text-sm font-medium">Brush Size:</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={cleanupBrushSize}
                      onChange={(e) => setCleanupBrushSize(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-8">{cleanupBrushSize}px</span>
                  </div>
                  
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden" style={{ display: 'inline-block' }}>
                    <img
                      ref={imageRef}
                      src={selectedImage.preview}
                      alt="Selected"
                      className="w-full h-auto"
                      draggable={false}
                      onLoad={handleCleanupImageLoad}
                      style={{ maxWidth: '100%', display: 'block' }}
                    />
                    <canvas
                      ref={visibleCanvasRef}
                      className="absolute top-0 left-0 cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={() => setIsDrawing(false)}
                      onMouseLeave={() => setIsDrawing(false)}
                      onTouchStart={handleDrawStart}
                      onTouchMove={handleDrawMove}
                      onTouchEnd={handleDrawEnd}
                      style={{ zIndex: 10 }}
                    />
                    <canvas
                      ref={dataMaskCanvasRef}
                      style={{ display: 'none' }}
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={clearCanvas}
                    className="w-full"
                  >
                    Clear Mask
                  </Button>
                </div>
              )}

              {/* Watermark Remover specific note (no painting required) */}
              {tool.id === 'watermark-remover' && selectedImage.preview && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tip:</h4>
                    <p className="text-xs text-blue-700">
                      Upload a watermarked image. The tool automatically detects and removes watermarks — no painting needed.
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Maximum file size: 5MB.
                    </p>
                  </div>
                </div>
              )}
              
              {/* AI Expand specific controls */}
              {tool.id === 'ai-expand' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Padding Settings</h3>
                  <p className="text-sm text-gray-600">Specify how many pixels to add to each side of your image.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Top Padding
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={padding.top}
                        onChange={(e) => setPadding(prev => ({ ...prev, top: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bottom Padding
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={padding.bottom}
                        onChange={(e) => setPadding(prev => ({ ...prev, bottom: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Left Padding
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={padding.left}
                        onChange={(e) => setPadding(prev => ({ ...prev, left: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Right Padding
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={padding.right}
                        onChange={(e) => setPadding(prev => ({ ...prev, right: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Background Generator specific controls */}
              {tool.id === 'ai-background-generator' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Description
                    </label>
                    <textarea
                      value={backgroundTextPrompt}
                      onChange={(e) => setBackgroundTextPrompt(e.target.value)}
                      placeholder="Describe the background you want to generate (e.g., 'sunset beach with palm trees', 'modern office interior', 'mountain landscape with snow')..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for better results:</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Be specific about the scene or setting you want</li>
                      <li>• Include details about lighting, colors, and mood</li>
                      <li>• Mention the style (realistic, artistic, vintage, etc.)</li>
                      <li>• Example: "Professional studio with soft lighting and neutral background"</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {/* AI Replace specific controls */}
              {tool.id === 'ai-replace' && selectedImage.preview && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <Brush className="w-4 h-4" />
                      <span className="text-sm font-medium">Brush Size:</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={replaceBrushSize}
                      onChange={(e) => setReplaceBrushSize(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-8">{replaceBrushSize}px</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Prompt
                    </label>
                    <textarea
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      placeholder="Describe what you want to replace the painted areas with..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                    
                    <div className="mt-2">
                      <span className="text-sm text-gray-600 mb-2 block">Try an example:</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setTextPrompt('A beautiful cherry blossom tree')}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          Cherry Blossom Tree
                        </button>
                        <button
                          type="button"
                          onClick={() => setTextPrompt('Sunglasses with a futuristic design, cyberpunk style')}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          Futuristic Sunglasses
                        </button>
                        <button
                          type="button"
                          onClick={() => setTextPrompt('A classic red brick wall')}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          Red Brick Wall
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden" style={{ display: 'inline-block' }}>
                    <img
                      ref={replaceImageRef}
                      src={selectedImage.preview}
                      alt="Selected"
                      className="w-full h-auto"
                      draggable={false}
                      onLoad={handleReplaceImageLoad}
                      style={{ maxWidth: '100%', display: 'block' }}
                    />
                    <canvas
                      ref={replaceVisibleCanvasRef}
                      className="absolute top-0 left-0 cursor-crosshair"
                      onMouseDown={startReplaceDrawing}
                      onMouseMove={drawReplace}
                      onMouseUp={() => setIsReplaceDrawing(false)}
                      onMouseLeave={() => setIsReplaceDrawing(false)}
                      style={{ zIndex: 10, opacity: 0.5 }}
                    />
                    <canvas
                      ref={replaceDataMaskCanvasRef}
                      style={{ display: 'none' }}
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={clearReplaceCanvas}
                    className="w-full"
                  >
                    Clear Mask
                  </Button>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Important Note:</strong> This tool generates a new image from your text. For best results:
                    </p>
                    <ul className="text-sm text-yellow-800 mt-2 ml-4 list-disc space-y-1">
                      <li>Describe what you want to see, don't give commands. (e.g., say "a tall sunflower," not "replace this with a sunflower").</li>
                      <li>The AI works best on images containing human faces. Results on objects or landscapes may vary.</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {/* AI Cartoon specific controls */}
              {tool.id === 'ai-cartoon' && selectedImage.preview && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Persona</label>
                    <div className="flex gap-4">
                      <Button
                        variant={selectedGender === 'female' ? 'primary' : 'outline'}
                        onClick={() => setSelectedGender('female')}
                      >
                        Female
                      </Button>
                      <Button
                        variant={selectedGender === 'male' ? 'primary' : 'outline'}
                        onClick={() => setSelectedGender('male')}
                      >
                        Male
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Preset Style</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {(selectedGender === 'female' ? femaleCartoonStyles : maleCartoonStyles).map((style) => {
                        const isSelected = selectedPresetUrl === style.imageUrl;
                        return (
                          <div
                            key={style.imageUrl}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                              isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedPresetUrl(style.imageUrl)}
                          >
                            {/* The "Clear Selection" button - shows ONLY on the selected item */}
                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleCartoonClearSelection(); }}
                                className="absolute top-1 right-1 z-10 p-1 bg-white bg-opacity-70 rounded-full text-red-600 hover:bg-opacity-100 hover:scale-110 transition-transform"
                                aria-label="Clear selection"
                              >
                                <XCircle size={20} />
                              </button>
                            )}
                            <img src={style.imageUrl} alt={style.name} className="w-full h-auto object-cover" />
                            <p className="text-center text-xs p-1 bg-gray-100">{style.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 text-center">Or Use a Custom Style</p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload a Style Image</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={(e) => setCartoonStyleImage(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!!selectedPresetUrl}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Describe a Style with Text</label>
                      <textarea
                        value={cartoonTextPrompt}
                        onChange={(e) => setCartoonTextPrompt(e.target.value)}
                        placeholder="e.g., 'anime style', 'Disney cartoon'..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        disabled={!!selectedPresetUrl}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Caricature specific controls */}
              {tool.id === 'ai-caricature' && selectedImage.preview && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> This tool works best with clear photos of human faces. Results on other subjects may vary.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Preset Style</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {caricatureStyles.map((style) => {
                        const isSelected = caricatureSelectedStyle?.imageUrl === style.imageUrl;
                        return (
                          <div
                            key={style.imageUrl}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                              isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
                            }`}
                            onClick={() => setCaricatureSelectedStyle(style)}
                          >
                            {/* The "Clear Selection" button - shows ONLY on the selected item */}
                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleCaricatureClearSelection(); }}
                                className="absolute top-1 right-1 z-10 p-1 bg-white bg-opacity-70 rounded-full text-red-600 hover:bg-opacity-100 hover:scale-110 transition-transform"
                                aria-label="Clear selection"
                              >
                                <XCircle size={20} />
                              </button>
                            )}
                            <img src={style.imageUrl} alt={style.name} className="w-full h-auto object-cover" />
                            <p className="text-center text-xs p-1 bg-gray-100">{style.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 text-center">Or Use a Custom Style</p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload a Style Image</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={(e) => setCaricatureCustomStyleImage(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!!caricatureSelectedStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Describe a Style with Text</label>
                      <textarea
                        value={caricatureTextPrompt}
                        onChange={(e) => setCaricatureTextPrompt(e.target.value)}
                        placeholder="Optional: Add descriptive text to modify your chosen style..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        disabled={!!caricatureSelectedStyle}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Avatar specific controls */}
              {tool.id === 'ai-avatar' && selectedImage.preview && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> This tool generates the best avatars from a single, clear photo of a human face.
                    </p>
                  </div>
                  
                  {/* Gender Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Gender</label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setAvatarSelectedGender('male')}
                        className={`px-4 py-2 rounded-md border ${
                          avatarSelectedGender === 'male'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarSelectedGender('female')}
                        className={`px-4 py-2 rounded-md border ${
                          avatarSelectedGender === 'female'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  {/* Preset Style Gallery */}
                  {avatarSelectedGender && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Preset Style</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {avatarStyles
                          .filter(style => style.gender === avatarSelectedGender)
                          .map((style) => {
                            const isSelected = avatarSelectedStyle?.imageUrl === style.imageUrl;
                            return (
                              <div
                                key={style.imageUrl}
                                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                                  isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
                                }`}
                                onClick={() => setAvatarSelectedStyle(style)}
                              >
                                {/* The "Clear Selection" button - shows ONLY on the selected item */}
                                {isSelected && (
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleAvatarClearSelection(); }}
                                    className="absolute top-1 right-1 z-10 p-1 bg-white bg-opacity-70 rounded-full text-red-600 hover:bg-opacity-100 hover:scale-110 transition-transform"
                                    aria-label="Clear selection"
                                  >
                                    <XCircle size={20} />
                                  </button>
                                )}
                                <img src={style.imageUrl} alt={style.name} className="w-full h-auto object-cover" />
                                <p className="text-center text-xs p-1 bg-gray-100">{style.name}</p>
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                  )}

                  {/* Custom Style Section */}
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 text-center">Or Use a Custom Style</p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload a Style Image</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => setAvatarCustomStyleImage(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!!avatarSelectedStyle}
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Text Prompt (Optional)</label>
                      <textarea
                        value={avatarTextPrompt}
                        onChange={(e) => setAvatarTextPrompt(e.target.value)}
                        placeholder="Optional: Describe the avatar style you want..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Portrait specific controls */}
              {tool.id === 'ai-portrait' && selectedImage.preview && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-800">
                      <strong>Note:</strong> For best results, use a clear photo of a person's face.
                    </p>
                  </div>
                  
                  {/* Gender Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Gender</label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setPortraitSelectedGender('female')}
                        className={`px-4 py-2 rounded-md border ${
                          portraitSelectedGender === 'female'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Female
                      </button>
                      <button
                        type="button"
                        onClick={() => setPortraitSelectedGender('male')}
                        className={`px-4 py-2 rounded-md border ${
                          portraitSelectedGender === 'male'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Male
                      </button>
                    </div>
                  </div>

                  {/* Preset Style Gallery */}
                  {portraitSelectedGender && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Preset Style</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {portraitStyles
                          .filter(style => style.gender === portraitSelectedGender)
                          .map((style) => {
                            const isSelected = portraitSelectedStyle?.imageUrl === style.imageUrl;
                            return (
                              <div
                                key={style.imageUrl}
                                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                                  isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
                                }`}
                                onClick={() => setPortraitSelectedStyle(style)}
                              >
                                {/* The "Clear Selection" button - shows ONLY on the selected item */}
                                {isSelected && (
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setPortraitSelectedStyle(null); }}
                                    className="absolute top-1 right-1 z-10 p-1 bg-white bg-opacity-70 rounded-full text-red-600 hover:bg-opacity-100 hover:scale-110 transition-transform"
                                    aria-label="Clear selection"
                                  >
                                    <XCircle size={20} />
                                  </button>
                                )}
                                <img src={style.imageUrl} alt={style.name} className="w-full h-auto object-cover" />
                                <p className="text-center text-xs p-1 bg-gray-100">{style.name}</p>
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                  )}

                  {/* Suggested Prompts */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Prompts</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {suggestedPortraitPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => setPortraitTextPrompt(prompt)}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full border transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Style Section */}
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 text-center">Or Use a Custom Style</p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload a Style Image</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => setPortraitCustomStyleImage(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!!portraitSelectedStyle}
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Text Prompt</label>
                      <textarea
                        value={portraitTextPrompt}
                        onChange={(e) => setPortraitTextPrompt(e.target.value)}
                        placeholder="Describe the portrait style you want..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        disabled={!!portraitSelectedStyle}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Product Photoshoot specific controls */}
              {tool.id === 'ai-product-photoshoot' && selectedImage.preview && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <strong>Note:</strong> This tool works best with clear product photos on neutral backgrounds.
                    </p>
                  </div>
                  
                  {/* Preset Style Gallery */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Choose a Style</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                      {productStyles.map((style) => {
                        const isSelected = selectedProductStyle?.name === style.name;
                        return (
                          <div
                            key={style.name}
                            onClick={() => {
                              setSelectedProductStyle(style);
                              setProductCustomStyleImage(null); // Clear custom image when preset is selected
                            }}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                              isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            {/* The "Clear Selection" button - shows ONLY on the selected item */}
                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleProductClearSelection(); }}
                                className="absolute top-1 right-1 z-10 p-1 bg-white bg-opacity-70 rounded-full text-red-600 hover:bg-opacity-100 hover:scale-110 transition-transform"
                                aria-label="Clear selection"
                              >
                                <XCircle size={20} />
                              </button>
                            )}
                            <img
                              src={style.imageUrl}
                              alt={style.name}
                              className="w-full h-24 object-cover"
                            />
                            <div className="p-2 bg-gray-50">
                              <p className="text-sm font-medium text-center">{style.name}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Style Image Upload */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Or Upload a Custom Style Image</h3>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setProductCustomStyleImage(file);
                        if (file) {
                          setSelectedProductStyle(null); // Clear preset when custom image is uploaded
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {productCustomStyleImage && (
                      <p className="mt-2 text-sm text-green-600">Custom style image selected: {productCustomStyleImage.name}</p>
                    )}
                  </div>

                  {/* Suggested Prompts */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Don't have a style? Try these prompts</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {suggestedPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => setProductTextPrompt(prompt)}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full border transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Prompt Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Prompt (Optional)
                    </label>
                    <textarea
                      value={productTextPrompt}
                      onChange={(e) => setProductTextPrompt(e.target.value)}
                      placeholder="Describe the style or setting you want for your product photo..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>
              )}
              

              
              {/* AI Image Generator specific controls */}
              {tool.id === 'ai-image-generator' && (
                <div className="space-y-6">
                  {/* Resolution Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Image Resolution
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {imageResolutions.map((resolution) => (
                        <div
                          key={`${resolution.width}x${resolution.height}`}
                          className={`cursor-pointer p-3 border-2 rounded-lg transition-colors ${
                            selectedResolution.width === resolution.width && selectedResolution.height === resolution.height
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedResolution(resolution)}
                        >
                          <div className="text-sm font-medium">{resolution.name}</div>
                          <div className="text-xs text-gray-500">{resolution.aspectRatio}</div>
                          <div className="text-xs text-gray-400">{resolution.width}x{resolution.height} px</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Text Prompt Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Description
                    </label>
                    <textarea
                      value={imageGeneratorTextPrompt}
                      onChange={(e) => setImageGeneratorTextPrompt(e.target.value)}
                      placeholder="Describe the image you want to generate in detail (e.g., 'a majestic mountain landscape at sunset', 'portrait of a cat wearing sunglasses', 'abstract digital art with vibrant colors')..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                    />
                    
                    {/* Updated Tips Section to match AI Background Generator */}
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for better results:</h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Be specific about style, colors, composition, and artistic elements</li>
                        <li>• Include details about lighting, mood, and atmosphere</li>
                        <li>• Mention art styles (realistic, cartoon, anime, oil painting, etc.)</li>
                        <li>• Add quality descriptors (high quality, detailed, masterpiece, etc.)</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Suggested Prompts */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Suggested Prompts
                    </label>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {imageGeneratorPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setImageGeneratorTextPrompt(prompt)}
                          className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Outfit specific controls */}
              {tool.id === 'ai-outfit' && selectedImage.preview && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-800">
                      <strong>Note:</strong> This tool works best with clear photos of people wearing clothing.
                    </p>
                  </div>
                  
                  {/* Preset Outfit Styles */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Choose an Outfit Style</h3>
                    {Object.entries(
                      presetOutfitStyles.reduce((acc, style) => {
                        if (!acc[style.category]) acc[style.category] = [];
                        acc[style.category].push(style);
                        return acc;
                      }, {} as Record<string, typeof presetOutfitStyles>)
                    ).map(([category, styles]) => (
                      <div key={category} className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">{category}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {styles.map((style) => (
                            <button
                              key={style.name}
                              onClick={() => {
                                setOutfitTextPrompt(style.prompt);
                                debouncedScrollToGenerate();
                              }}
                              className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors"
                            >
                              <div className="text-sm font-medium">{style.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Suggested Prompts */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Suggested Outfit Ideas</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {suggestedOutfitPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => setOutfitTextPrompt(prompt)}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full border transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Prompt Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Outfit Description
                    </label>
                    <textarea
                      value={outfitTextPrompt}
                      onChange={(e) => setOutfitTextPrompt(e.target.value)}
                      placeholder="Describe the outfit you want to apply (e.g., 'elegant black evening dress', 'casual denim jacket and jeans', 'professional business suit')..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                    />
                    
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for better results:</h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Be specific about clothing type, style, colors, and materials</li>
                        <li>• Include details about fit and silhouette (loose, fitted, flowing, etc.)</li>
                        <li>• Mention specific garments (dress, shirt, pants, jacket, etc.)</li>
                        <li>• Add style descriptors (casual, formal, vintage, modern, etc.)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Image to Image specific controls */}
              {tool.id === 'ai-image-to-image' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Upload a main image to transform and optionally a style reference image for visual guidance.
                    </p>
                  </div>
                  
                  {/* Main Image Upload */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">1. Main Image</h3>
                    <p className="text-sm text-gray-600 mb-3">The image you want to transform</p>
                    <ImageDropzone 
                      onImageSelect={(imageFile) => setI2iMainImage(imageFile)}
                      selectedImage={i2iMainImage}
                    />
                  </div>
                  
                  {/* Style Image Upload */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">2. Style Reference Image (Optional)</h3>
                    <p className="text-sm text-gray-600 mb-3">Upload an image to use as style guidance</p>
                    <ImageDropzone 
                      onImageSelect={(imageFile) => setI2iStyleImage(imageFile)}
                      selectedImage={i2iStyleImage}
                    />
                  </div>
                  
                  {/* Strength Sliders */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Strength: {i2iStrength.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={i2iStrength}
                        onChange={(e) => setI2iStrength(Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Higher strength makes the result look more like your main image
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Style Strength: {i2iStyleStrength.toFixed(1)}
                        </label>
                        <div className="relative group">
                          <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            Slider is disabled if no style image has been uploaded
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={i2iStyleStrength}
                        onChange={(e) => setI2iStyleStrength(Number(e.target.value))}
                        disabled={!i2iStyleImage.file}
                        className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Higher strength makes the result look more like your style image
                        {!i2iStyleImage.file && " (disabled - upload a style image first)"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Text Prompt Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Prompt *
                    </label>
                    <textarea
                      value={i2iTextPrompt}
                      onChange={(e) => setI2iTextPrompt(e.target.value)}
                      placeholder="Describe the final image you want to create (e.g., 'turn this into a watercolor painting', 'make it look like a vintage photograph', 'transform into a cyberpunk scene')..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                      required
                    />
                    
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-green-800 mb-2">💡 Tips for better results:</h4>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Be specific about the style, mood, or transformation you want</li>
                        <li>• Mention artistic styles (watercolor, oil painting, digital art, etc.)</li>
                        <li>• Include lighting and atmosphere details (dramatic, soft, bright, etc.)</li>
                        <li>• Use the Image Strength slider to control how much of the original to keep</li>
                        <li>• Use the Style Strength slider to control style reference influence</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Sketch to Image specific controls */}
              {tool.id === 'ai-sketch-to-image' && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-800">
                      <strong>Note:</strong> Create or upload a sketch, then describe the final image you want to generate.
                    </p>
                  </div>
                  
                  {/* Input Mode Switcher */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">1. Choose Input Method</h3>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setS2iInputMode('upload')}
                        className={`px-4 py-2 rounded-md border ${
                          s2iInputMode === 'upload'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Upload Sketch
                      </button>
                      <button
                        type="button"
                        onClick={() => setS2iInputMode('draw')}
                        className={`px-4 py-2 rounded-md border ${
                          s2iInputMode === 'draw'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Draw Sketch
                      </button>
                    </div>
                  </div>
                  
                  {/* Conditional Input */}
                  {s2iInputMode === 'upload' ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">2. Upload Your Sketch</h3>
                      <p className="text-sm text-gray-600 mb-3">Upload an existing sketch or drawing</p>
                      <ImageDropzone 
                        onImageSelect={(imageFile) => setS2iSketchImage(imageFile)}
                        selectedImage={s2iSketchImage}
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">2. Draw Your Sketch</h3>
                      <p className="text-sm text-gray-600 mb-3">Use the canvas below to draw your sketch</p>
                      
                      {/* Drawing Controls */}
                      <div className="flex items-center gap-4 mb-3">
                        <label className="flex items-center gap-2">
                          <span className="text-sm font-medium">Brush Size:</span>
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={s2iBrushSize}
                          onChange={(e) => setS2iBrushSize(Number(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600 w-8">{s2iBrushSize}px</span>
                        
                        <label className="flex items-center gap-2">
                          <span className="text-sm font-medium">Color:</span>
                          <input
                            type="color"
                            value={s2iBrushColor}
                            onChange={(e) => setS2iBrushColor(e.target.value)}
                            className="w-8 h-8 rounded border"
                          />
                        </label>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const canvas = drawingCanvasRef.current;
                            if (canvas) {
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.fillStyle = 'white';
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                              }
                            }
                          }}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border"
                        >
                          Clear
                        </button>
                      </div>
                      
                      {/* Drawing Canvas */}
                      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                        <canvas
                          ref={drawingCanvasRef}
                          width={400}
                          height={400}
                          className="w-full h-auto cursor-crosshair bg-white"
                          onMouseDown={(e) => {
                            setIsDrawingSketch(true);
                            const canvas = drawingCanvasRef.current;
                            if (canvas) {
                              const rect = canvas.getBoundingClientRect();
                              const x = (e.clientX - rect.left) * (canvas.width / rect.width);
                              const y = (e.clientY - rect.top) * (canvas.height / rect.height);
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.beginPath();
                                ctx.moveTo(x, y);
                              }
                            }
                          }}
                          onMouseMove={(e) => {
                            if (!isDrawingSketch) return;
                            const canvas = drawingCanvasRef.current;
                            if (canvas) {
                              const rect = canvas.getBoundingClientRect();
                              const x = (e.clientX - rect.left) * (canvas.width / rect.width);
                              const y = (e.clientY - rect.top) * (canvas.height / rect.height);
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.lineTo(x, y);
                                ctx.strokeStyle = s2iBrushColor;
                                ctx.lineWidth = s2iBrushSize;
                                ctx.lineCap = 'round';
                                ctx.stroke();
                              }
                            }
                          }}
                          onMouseUp={() => setIsDrawingSketch(false)}
                          onMouseLeave={() => setIsDrawingSketch(false)}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Text Prompt Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      3. Describe the Final Image *
                    </label>
                    <textarea
                      value={s2iTextPrompt}
                      onChange={(e) => setS2iTextPrompt(e.target.value)}
                      placeholder="Describe the final image you want to create from your sketch (e.g., 'a realistic portrait of a woman', 'a fantasy castle in a magical forest', 'a modern car design')..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                      required
                    />
                  </div>
                  
                  {/* Style Image Upload */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">4. Style Reference Image </h3>
                    <p className="text-sm text-gray-600 mb-3">Upload an image to use as style guidance</p>
                    <ImageDropzone 
                      onImageSelect={(imageFile) => setS2iStyleImage(imageFile)}
                      selectedImage={s2iStyleImage}
                    />
                  </div>
                  
                  {/* Strength Sliders */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sketch Adherence: {s2iStrength.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={s2iStrength}
                        onChange={(e) => setS2iStrength(Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Higher values make the result follow your sketch more closely
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Style Strength: {s2iStyleStrength.toFixed(1)}
                        </label>
                        <div className="relative group">
                          <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            This slider is disabled if no style image is present
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={s2iStyleStrength}
                        onChange={(e) => setS2iStyleStrength(Number(e.target.value))}
                        disabled={!s2iStyleImage.file}
                        className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Higher values make the result look more like your style image
                        {!s2iStyleImage.file && " (disabled - upload a style image first)"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-green-800 mb-2">💡 Tips for better results:</h4>
                    <ul className="text-xs text-green-700 space-y-1">
                      <li>• Use clear, simple sketches with defined shapes and lines</li>
                      <li>• Be specific in your text prompt about style, colors, and details</li>
                      <li>• Higher sketch adherence preserves your drawing structure</li>
                      <li>• Style images help guide the artistic direction</li>
                      <li>• Try different combinations of sketch and style strength</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {/* AI Hairstyle specific controls */}
              {tool.id === 'ai-hairstyle' && selectedImage.preview && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe the hairstyle you want to try on
                    </label>
                    <textarea
                      value={hairstyleTextPrompt}
                      onChange={(e) => setHairstyleTextPrompt(e.target.value)}
                      placeholder="Describe the hairstyle you want to try on..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Or choose a preset style:</h3>
                    {/* This is the new JSX for the Hairstyle preset gallery */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                      {hairstylePresets.map((style) => {
                        const isSelected = selectedHairstylePrompt === style.prompt;
                        return (
                          <div
                            key={style.name}
                            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                              isSelected ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-300'
                            }`}
                            // This is the core logic: click sets the prompt in both state variables
                            onClick={() => {
                              setHairstyleTextPrompt(style.prompt);
                              setSelectedHairstylePrompt(style.prompt);
                            }}
                          >
                            <img
                              src={style.imageUrl}
                              alt={style.name}
                              className="w-full h-20 object-cover group-hover:opacity-90"
                            />
                            <p className="text-center text-xs p-1 bg-gray-100 truncate">{style.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tip:</h4>
                    <p className="text-xs text-blue-700">
                      For best results, use a clear, front-facing photo with good lighting.
                    </p>
                  </div>
                </div>
              )}
              
              {/* AI Image Upscaler specific controls */}
              {tool.id === 'ai-image-upscaler' && selectedImage.preview && (
                <div className="space-y-4">
                  {/* Display Image Dimensions */}
                  {imageDimensions && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">Current Image Size:</h4>
                      <p className="text-sm text-gray-600">{imageDimensions.width} x {imageDimensions.height}px</p>
                    </div>
                  )}
                  
                  {/* Upscale Factor Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Upscale Factor
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setUpscaleFactor(2)}
                        disabled={!availableUpscaleOptions.includes(2)}
                        className={`px-4 py-2 rounded-md border transition-colors ${
                          upscaleFactor === 2
                            ? 'bg-blue-500 text-white border-blue-500'
                            : availableUpscaleOptions.includes(2)
                            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        2X
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpscaleFactor(4)}
                        disabled={!availableUpscaleOptions.includes(4)}
                        className={`px-4 py-2 rounded-md border transition-colors ${
                          upscaleFactor === 4
                            ? 'bg-blue-500 text-white border-blue-500'
                            : availableUpscaleOptions.includes(4)
                            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        4X
                      </button>
                    </div>
                    {availableUpscaleOptions.length === 0 && (
                      <p className="text-sm text-red-600 mt-2">
                        Image is too large for upscaling. Maximum size is 2048px on the longest side.
                      </p>
                    )}
                    {availableUpscaleOptions.length === 1 && availableUpscaleOptions[0] === 2 && (
                      <p className="text-sm text-amber-600 mt-2">
                        Only 2X upscaling is available for images larger than 1024px on the longest side.
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tip:</h4>
                    <p className="text-xs text-blue-700">
                      AI upscaling works best on photos and detailed images. The larger the upscale factor, the longer the processing time.
                    </p>
                  </div>
                </div>
              )}
              
              {/* AI Filter specific controls */}
              {tool.id === 'ai-filter' && (
                <div className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Filter Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {filterCategories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setFilterSelectedCategory(category);
                            setFilterSelectedStyle(null); // Reset selected style when category changes
                          }}
                          className={`px-3 py-2 rounded-md border text-sm transition-colors ${
                            filterSelectedCategory === category
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Style Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Choose Style
                      </label>
                      {filterSelectedStyle && (
                        <button
                          type="button"
                          onClick={handleFilterClearSelection}
                          className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <X className="w-3 h-3" />
                          <span>Clear Selection</span>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {aiFilterStyles
                        .filter(style => style.category === filterSelectedCategory)
                        .map((style) => (
                          <div
                            key={style.id}
                            onClick={() => {
                              setFilterSelectedStyle(style);
                              setFilterUseCustom(false);
                            }}
                            className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all relative group ${
                              filterSelectedStyle?.id === style.id
                                ? 'border-blue-500 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={style.imageUrl}
                              alt={style.name}
                              className="w-full h-24 object-cover"
                              onError={(e) => {
                                // Fallback for broken images
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdHlsZTwvdGV4dD48L3N2Zz4=';
                              }}
                            />
                            {filterSelectedStyle?.id === style.id && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFilterClearSelection();
                                }}
                                className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                                title="Clear Selection"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-xcircle text-gray-600">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <path d="m15 9-6 6"></path>
                                  <path d="m9 9 6 6"></path>
                                </svg>
                              </button>
                            )}
                            <div className="p-2">
                              <p className="text-xs font-medium text-gray-800 truncate">{style.name}</p>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  
                  {/* Custom Style Option */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="checkbox"
                        id="use-custom-filter"
                        checked={filterUseCustom}
                        onChange={(e) => {
                          setFilterUseCustom(e.target.checked);
                          if (e.target.checked) {
                            setFilterSelectedStyle(null);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="use-custom-filter" className="text-sm font-medium text-gray-700">
                        Use Custom Style
                      </label>
                    </div>
                    
                    {filterUseCustom && (
                      <div className="space-y-3">
                        {/* Custom Style Image Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Style Image (Optional)
                          </label>
                          <input
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              setFilterCustomStyleImage(file || null);
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                        
                        {/* Text Prompt */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Text Prompt
                          </label>
                          <textarea
                            value={filterTextPrompt}
                            onChange={(e) => setFilterTextPrompt(e.target.value)}
                            placeholder="Describe the style you want to apply..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tip:</h4>
                    <p className="text-xs text-blue-700">
                      Choose from preset styles for quick results, or use custom style with text prompts for unique artistic effects.
                    </p>
                  </div>
                </div>
              )}

              <Button
                data-scroll-target="generate-button"
                onClick={
                  tool.id === 'ai-cleanup' ? handleAICleanupGenerate :
                  tool.id === 'watermark-remover' ? handleAIWatermarkRemoverGenerate :
                  tool.id === 'ai-expand' ? handleAIExpandGenerate :
                  tool.id === 'ai-replace' ? handleAIReplaceGenerate :
                  tool.id === 'ai-cartoon' ? handleAICartoonGenerate :
                  tool.id === 'ai-caricature' ? handleAICaricatureGenerate :
                  tool.id === 'ai-avatar' ? handleAIAvatarGenerate :
                  tool.id === 'ai-portrait' ? handleAIPortraitGenerate :
                  tool.id === 'ai-face-swap' ? handleAIFaceSwapGenerate :
                  tool.id === 'ai-product-photoshoot' ? handleAIProductPhotoshootGenerate :
                  tool.id === 'ai-background-generator' ? handleAIBackgroundGeneratorGenerate :
                  tool.id === 'ai-image-generator' ? handleAIImageGeneratorGenerate :
                  tool.id === 'ai-outfit' ? handleAIOutfitGenerate :
                  tool.id === 'ai-image-to-image' ? handleAIImageToImageGenerate :
                  tool.id === 'ai-sketch-to-image' ? handleAISketchToImageGenerate :
                  tool.id === 'ai-hairstyle' ? handleAIHairstyleGenerate :
                  tool.id === 'ai-image-upscaler' ? handleAIUpscalerGenerate :
                  tool.id === 'ai-filter' ? handleAIFilterGenerate :
                  handleProcessImage
                }
                disabled={
                  processedImage.isLoading ||
                  (tool.id !== 'ai-image-generator' && tool.id !== 'ai-face-swap' && tool.id !== 'ai-image-to-image' && tool.id !== 'ai-sketch-to-image' && !selectedImage.file) ||
                  (tool.id === 'ai-replace' && !textPrompt.trim()) ||
                  (tool.id === 'ai-background-generator' && !backgroundTextPrompt.trim()) ||
                  (tool.id === 'ai-image-generator' && !imageGeneratorTextPrompt.trim()) ||
                  (tool.id === 'ai-cartoon' && !(selectedPresetUrl || cartoonStyleImage?.name)) ||
                  (tool.id === 'ai-caricature' && !caricatureSelectedStyle && !caricatureCustomStyleImage) ||
                  (tool.id === 'ai-avatar' && !avatarSelectedStyle && !avatarCustomStyleImage) ||
                  (tool.id === 'ai-portrait' && !portraitSelectedStyle && !portraitCustomStyleImage) ||
                  (tool.id === 'ai-face-swap' && (!faceSwapTargetImage.file || (!selectedFaceSwapPreset && !faceSwapSourceImage.file))) ||
                  (tool.id === 'ai-product-photoshoot' && !selectedProductStyle && !productCustomStyleImage && !productTextPrompt) ||
                  (tool.id === 'ai-outfit' && (!selectedImage.file || !outfitTextPrompt.trim())) ||
                  (tool.id === 'ai-image-to-image' && (!i2iMainImage.file || !i2iTextPrompt.trim())) ||
                  (tool.id === 'ai-sketch-to-image' && (
                    (s2iInputMode === 'upload' && !s2iSketchImage.file) ||
                    !s2iTextPrompt.trim()
                  )) ||
                  (tool.id === 'ai-hairstyle' && (!selectedImage.file || !hairstyleTextPrompt.trim())) ||
                  (tool.id === 'ai-image-upscaler' && (!selectedImage.file || availableUpscaleOptions.length === 0)) ||
                  (tool.id === 'ai-filter' && (!selectedImage.file || (!filterSelectedStyle && !filterCustomStyleImage && !filterTextPrompt.trim())))
                }
                className="w-full"
              >
                {processedImage.isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  `Generate ${tool.name}`
                )}
              </Button>
            </div>
            
            <div className="space-y-4" data-scroll-target="result-container">
              <h2 className="text-xl font-semibold">Result</h2>
              {processedImage.isLoading ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center">
                  <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-700">Processing your image...</p>
                </div>
              ) : processedImage.url ? (
                <div className="space-y-4">
                  {canShowComparisonSlider ? (
                    <ImageComparisonSlider
                      beforeSrc={beforeImagePreview as string}
                      afterSrc={processedImage.url}
                      beforeLabel="Original"
                      afterLabel="Processed"
                      ariaLabel="Compare original and processed images"
                    />
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={processedImage.url} 
                        alt="Processed result" 
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  <Button 
                    fullWidth 
                    onClick={handleDownload}
                    leftIcon={<Download size={18} />}
                  >
                    Download Result
                  </Button>
                  <SupportBanner />
                </div>
              ) : processedImage.error ? (
                <div className="border-2 border-dashed border-red-300 bg-red-50 rounded-lg p-8 flex flex-col items-center justify-center">
                  <p className="text-red-600 mb-2">Error</p>
                  <p className="text-gray-700 text-center">{processedImage.error}</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center">
                  <p className="text-gray-500">Upload and process an image to see the result here</p>
                </div>
              )}
            </div>
          </div>

          {/* Tool Recommendations Section */}
          <ToolRecommendations 
            currentToolId={tool.id} 
            hasResult={!!processedImage.url} 
          />

          {tool.id === 'ai-caricature' && (
            <SectionErrorBoundary>
              <>
                <CaricatureZigZagLayout />
                <CaricatureFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'ai-cartoon' && (
            <SectionErrorBoundary>
              <>
                <CartoonZigZagLayout />
                <CartoonFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'ai-expand' && (
            <SectionErrorBoundary>
              <>
                <ExpandZigZagLayout />
                <ExpandFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'ai-replace' && (
            <SectionErrorBoundary>
              <>
                <ReplaceZigZagLayout />
                <ReplaceFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'ai-cleanup' && (
            <SectionErrorBoundary>
              <>
                <CleanupZigZagLayout />
                <CleanupFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'ai-background-generator' && (
            <SectionErrorBoundary>
              <>
                <BackgroundZigZagLayout />
                <BackgroundFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'ai-image-generator' && (
            <SectionErrorBoundary>
              <>
                <ImageGeneratorZigZagLayout />
                <ImageGeneratorFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'ai-product-photoshoot' && (
          <SectionErrorBoundary>
            <>
              <ProductZigZagLayout />
              <ProductFAQ />
            </>
          </SectionErrorBoundary>
          )}

          {tool.id === 'ai-outfit' && (
            <SectionErrorBoundary>
              <>
                <OutfitZigZagLayout />
                <OutfitFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'ai-hairstyle' && (
            <SectionErrorBoundary>
              <>
                <HairstyleZigZagLayout />
                <HairstyleFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'ai-image-upscaler' && (
          <SectionErrorBoundary>
            <>
              <ImageUpscalerZigZagLayout />
              <ImageUpscalerFAQ />
            </>
          </SectionErrorBoundary>
          )}

          {tool.id === 'ai-filter' && (
            <SectionErrorBoundary>
              <>
                <FilterZigZagLayout />
                <FilterFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'watermark-remover' && (
            <SectionErrorBoundary>
              <>
                <WatermarkZigZagLayout />
                <WatermarkFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'remove-background' && (
          <SectionErrorBoundary>
            <>
              <RemoveBgZigZagLayout />
              <RemoveBgFAQ />
            </>
          </SectionErrorBoundary>
          )}

          {tool.id === 'ai-face-swap' && (
            <SectionErrorBoundary>
              <>
                <FaceSwapZigZagLayout />
                <FaceSwapFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'ai-image-to-image' && (
            <SectionErrorBoundary>
              <>
                <ImageToImageZigZagLayout />
                <ImageToImageFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'ai-sketch-to-image' && (
            <SectionErrorBoundary>
              <>
                <SketchToImageZigZagLayout />
                <SketchToImageFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'ai-portrait' && (
          <SectionErrorBoundary>
            <>
              <PortraitZigZagLayout />
              <PortraitFAQ />
              </>
            </SectionErrorBoundary>
          )}

          {tool.id === 'ai-avatar' && (
            <SectionErrorBoundary>
              <>
                <AvatarZigZagLayout />
                <AvatarFAQ />
              </>
            </SectionErrorBoundary>
          )}
          
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About {tool.name}</h2>
            <p className="text-gray-700 mb-4">
              Our {tool.name.toLowerCase()} tool uses advanced AI algorithms to {getToolDescription(tool)}. 
              This tool is perfect for photographers, designers, social media managers, and anyone who wants to enhance their images.
            </p>
            <p className="text-gray-700">
              Unlike other tools, ModernPhotoTools offers this service completely free with no watermarks.
              Try it now and see the difference!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to generate more detailed descriptions for each tool
function getToolDescription(tool: Tool): string {
  switch (tool.id) {
    case 'remove-background':
      return 'automatically detect and remove backgrounds from any image, leaving you with a clean subject that can be placed on any new background';
    case 'ai-cleanup':
      return 'automatically detect and fix imperfections, remove unwanted objects, and enhance the overall quality of your photos. Simply paint over the areas you want to remove and let AI intelligently fill in the space';
    case 'watermark-remover':
      return 'automatically detect and remove watermarks, logos, and text overlays from uploaded images — no manual selection needed';
    case 'ai-expand':
      return 'intelligently expand your images beyond their original boundaries, adding realistic content that matches the original image';
    case 'ai-replace':
      return 'replace objects or areas in your images with AI-generated content that seamlessly blends with the rest of the image';
    case 'ai-cartoon':
      return 'transform your photos into cartoon-style artwork with various artistic styles';
    case 'ai-caricature':
      return 'turn regular photos into expressive caricatures using style presets, reference images, or text prompts';
    case 'ai-portrait':
      return 'create realistic portrait transformations with professional styling and artistic effects';
    case 'ai-face-swap':
      return 'seamlessly swap faces between two images, allowing you to replace faces in photos with either preset faces or custom source images';
    case 'ai-product-photoshoot':
      return 'create professional product photography with AI-generated backgrounds and lighting that make your products look stunning';
    case 'ai-background-generator':
      return 'generate stunning new backgrounds for your images using AI, perfect for creating professional-looking photos with custom scenes';
    case 'ai-outfit':
      return 'virtually change clothing on people in photos using AI, allowing you to transform outfits with simple text descriptions';
    case 'ai-image-to-image':
      return 'transform any image based on text prompts and optional style references, with adjustable strength controls for precise artistic control';
    case 'ai-hairstyle':
      return 'virtually try on new hairstyles by uploading a photo and describing the desired look, perfect for experimenting with different hair styles and colors';
    case 'ai-image-upscaler':
      return 'enhance image resolution and quality using advanced AI upscaling technology, supporting 2x and 4x enlargement while preserving fine details and sharpness';
    default:
      return 'transform and enhance your images with professional-quality results';
  }
}

export default ToolPage;
