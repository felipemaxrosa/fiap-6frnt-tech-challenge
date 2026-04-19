'use client';

import { useEffect } from 'react';

// iOS Safari doesn't recalculate layout after the soft keyboard closes,
// leaving a blank space where the keyboard was. visualViewport fires correctly.
export function ViewportFix() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      document.documentElement.style.height = `${viewport.height + viewport.offsetTop}px`;
    };

    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);

    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  return null;
}
