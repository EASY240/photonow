import React, { useEffect } from 'react';

declare global {
  interface Window {
    ezstandalone: any;
  }
}

interface EzoicAdProps {
  placeholderId: number;
  className?: string;
}

export default function EzoicAd({ placeholderId, className = "" }: EzoicAdProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.ezstandalone = window.ezstandalone || {};
      window.ezstandalone.cmd = window.ezstandalone.cmd || [];

      window.ezstandalone.cmd.push(function () {
        try {
          window.ezstandalone.showAds(placeholderId);
        } catch (error) {
          console.error(`Ezoic showAds error for ${placeholderId}:`, error);
        }
      });
    }

    return () => {
      if (typeof window !== 'undefined' && window.ezstandalone) {
        window.ezstandalone.cmd.push(function () {
          try {
            window.ezstandalone.destroyPlaceholders(placeholderId);
          } catch (error) {
            console.error(`Ezoic destroy error for ${placeholderId}:`, error);
          }
        });
      }
    };
  }, [placeholderId]);

  return (
    <div className={`ezoic-ad-wrapper ${className}`} style={{ minHeight: '1px' }}>
      <div id={`ezoic-pub-ad-placeholder-${placeholderId}`}></div>
    </div>
  );
}
