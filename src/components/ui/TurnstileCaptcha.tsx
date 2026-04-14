import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

const ensureTurnstileScript = (): Promise<void> => {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.turnstile) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load CAPTCHA script.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load CAPTCHA script.'));
    document.head.appendChild(script);
  });
};

interface TurnstileCaptchaProps {
  siteKey: string;
  onTokenChange: (token: string) => void;
  resetTrigger?: number;
}

const TurnstileCaptcha: React.FC<TurnstileCaptchaProps> = ({
  siteKey,
  onTokenChange,
  resetTrigger = 0
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const renderWidget = async () => {
      if (!siteKey) {
        setLoadError('CAPTCHA is not configured. Please contact support.');
        return;
      }

      try {
        await ensureTurnstileScript();

        if (!mounted || !window.turnstile || !containerRef.current || widgetIdRef.current) {
          return;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onTokenChange(token);
          },
          'expired-callback': () => {
            onTokenChange('');
          },
          'error-callback': () => {
            onTokenChange('');
            setLoadError('CAPTCHA verification failed. Please try again.');
          }
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to initialize CAPTCHA.';
        if (mounted) {
          setLoadError(message);
        }
      }
    };

    renderWidget();

    return () => {
      mounted = false;
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onTokenChange]);

  useEffect(() => {
    if (window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
      onTokenChange('');
    }
  }, [resetTrigger, onTokenChange]);

  return (
    <div>
      <div ref={containerRef} />
      {loadError && (
        <p className="mt-2 text-sm text-red-700">{loadError}</p>
      )}
    </div>
  );
};

export default TurnstileCaptcha;
