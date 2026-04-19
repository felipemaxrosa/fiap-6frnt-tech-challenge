'use client';

import { useEffect } from 'react';

// iOS Safari doesn't recalculate layout after the soft keyboard closes,
// leaving a blank space. dvh units don't update reliably — we use a CSS
// variable driven by visualViewport instead.
export function ViewportFix() {
  useEffect(() => {
    const update = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${vh}px`);
    };

    update();
    window.visualViewport?.addEventListener('resize', update);
    window.addEventListener('resize', update);

    return () => {
      window.visualViewport?.removeEventListener('resize', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return null;
}
