'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

// List of routes where ads should NEVER be displayed
const BLOCKED_ROUTES = [
  '/game',
  '/play',
  '/lobby',
  '/login',
  '/profile',
  '/results',
  '/shop',
  '/api',
];

export default function EzoicScripts() {
  const pathname = usePathname();

  // Determine if the current route is blocked
  const isBlocked = BLOCKED_ROUTES.some((route) => 
    pathname.startsWith(route) || pathname === route
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    if (!isBlocked && typeof window !== 'undefined' && win.ezstandalone && win.ezstandalone.cmd) {
      win.ezstandalone.cmd.push(() => {
        if (typeof win.ezstandalone.showAds === 'function') {
          // By not passing an ID, Ezoic will find and fill all placeholders on the current page
          win.ezstandalone.showAds();
        }
      });
    }
  }, [pathname, isBlocked]);

  if (isBlocked) {
    return null;
  }

  return (
    <>
      {/* Privacy Scripts - MUST load first */}
      <Script 
        id="ezoic-privacy-cmp-min"
        src="https://cmp.gatekeeperconsent.com/min.js"
        data-cfasync="false"
      />
      <Script 
        id="ezoic-privacy-cmp"
        src="https://the.gatekeeperconsent.com/cmp.min.js"
        data-cfasync="false"
      />

      {/* Ezoic Header Scripts */}
      <Script 
        id="ezoic-sa"
        src="//www.ezojs.com/ezoic/sa.min.js"
        async
      />
      <Script id="ezoic-standalone">
        {`
          window.ezstandalone = window.ezstandalone || {};
          ezstandalone.cmd = ezstandalone.cmd || [];
        `}
      </Script>
      <Script 
        id="ezoic-analytics"
        src="//ezoicanalytics.com/analytics.js"
        strategy="afterInteractive"
      />
    </>
  );
}
