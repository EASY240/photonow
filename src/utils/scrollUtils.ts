/**
 * Scroll utility functions for enhanced user experience
 * Provides device-adaptive scrolling with smooth animations
 */

/**
 * Device detection utility
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  
  if (width < 768) {
    return 'mobile';
  } else if (width < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

/**
 * Check if device supports smooth scrolling
 */
export const supportsSmoothScrolling = (): boolean => {
  return 'scrollBehavior' in document.documentElement.style;
};

/**
 * Scroll to element with device-adaptive behavior
 */
export interface ScrollToElementOptions {
  element: HTMLElement | null;
  behavior?: 'smooth' | 'auto';
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
  offset?: number;
  duration?: number;
}

export const scrollToElement = (options: ScrollToElementOptions): Promise<void> => {
  return new Promise((resolve) => {
    const {
      element,
      behavior = 'smooth',
      block = 'start',
      inline = 'nearest',
      offset = 0,
      duration = 400
    } = options;

    if (!element) {
      resolve();
      return;
    }

    const deviceType = getDeviceType();
    const supportsSmooth = supportsSmoothScrolling();

    // Calculate target position
    const elementRect = element.getBoundingClientRect();
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    let targetScrollTop = currentScrollTop + elementRect.top + offset;

    // Device-specific adjustments
    if (deviceType === 'mobile') {
      // On mobile, add some padding to account for virtual keyboards and mobile UI
      targetScrollTop -= 20;
    } else if (deviceType === 'desktop') {
      // On desktop, center the element better in viewport
      targetScrollTop -= window.innerHeight * 0.1;
    }

    // Ensure we don't scroll past the document bounds
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScrollTop = Math.max(0, Math.min(targetScrollTop, maxScroll));

    if (supportsSmooth && behavior === 'smooth') {
      // Use native smooth scrolling if supported
      element.scrollIntoView({
        behavior: 'smooth',
        block,
        inline
      });
      
      // Estimate completion time for native smooth scrolling
      setTimeout(() => resolve(), duration);
    } else {
      // Fallback: manual smooth scrolling animation
      const startTime = performance.now();
      const startScrollTop = currentScrollTop;
      const distance = targetScrollTop - startScrollTop;

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentScrollTop = startScrollTop + (distance * easeOut);
        window.scrollTo(0, currentScrollTop);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animateScroll);
    }
  });
};

/**
 * Scroll to result container with device-adaptive behavior
 */
export const scrollToResultContainer = async (): Promise<void> => {
  const resultContainer = document.querySelector('[data-scroll-target="result-container"]') as HTMLElement;
  
  if (!resultContainer) {
    // Fallback: look for result section by class or text content
    const fallbackContainer = document.querySelector('.space-y-4 h2')?.parentElement as HTMLElement;
    if (fallbackContainer) {
      await scrollToElement({
        element: fallbackContainer,
        behavior: 'smooth',
        block: 'start',
        offset: -20,
        duration: 400
      });
    }
    return;
  }

  const deviceType = getDeviceType();
  
  await scrollToElement({
    element: resultContainer,
    behavior: 'smooth',
    block: deviceType === 'mobile' ? 'start' : 'center',
    offset: deviceType === 'mobile' ? -10 : -50,
    duration: 400
  });
};

/**
 * Scroll to Generate button with consistent behavior
 */
export const scrollToGenerateButton = async (): Promise<void> => {
  const generateButton = document.querySelector('[data-scroll-target="generate-button"]') as HTMLElement;
  
  if (!generateButton) {
    // Fallback: look for button with "Generate" text
    const buttons = Array.from(document.querySelectorAll('button'));
    const fallbackButton = buttons.find(btn => 
      btn.textContent?.includes('Generate') || 
      btn.textContent?.includes('Generating')
    ) as HTMLElement;
    
    if (fallbackButton) {
      await scrollToElement({
        element: fallbackButton,
        behavior: 'smooth',
        block: 'center',
        offset: -30,
        duration: 300
      });
    }
    return;
  }

  await scrollToElement({
    element: generateButton,
    behavior: 'smooth',
    block: 'center',
    offset: -30,
    duration: 300
  });
};

/**
 * Debounce function to prevent excessive scroll calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Check if element is in viewport
 */
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Get optimal scroll position for element visibility
 */
export const getOptimalScrollPosition = (element: HTMLElement): number => {
  const elementRect = element.getBoundingClientRect();
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const viewportHeight = window.innerHeight;
  const deviceType = getDeviceType();
  
  // Calculate position to center element in viewport with device-specific adjustments
  let targetPosition = currentScrollTop + elementRect.top - (viewportHeight / 2) + (elementRect.height / 2);
  
  if (deviceType === 'mobile') {
    // On mobile, position slightly higher to account for virtual keyboard
    targetPosition -= viewportHeight * 0.1;
  }
  
  // Ensure we don't scroll past document bounds
  const maxScroll = document.documentElement.scrollHeight - viewportHeight;
  return Math.max(0, Math.min(targetPosition, maxScroll));
};