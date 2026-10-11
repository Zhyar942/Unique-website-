import React, { useEffect, useRef } from 'react';

/**
 * Lightweight, hardware-accelerated Page Transition component.
 * Provides a subtle, native-feeling crossfade + micro-translate
 * without dropping frames or blocking interaction.
 */
export default function PageTransition({ transitionKey, children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !el.animate) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Play smooth GPU-accelerated entrance
    const animation = el.animate(
      [
        { opacity: 0, transform: 'translate3d(0, 10px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ],
      {
        duration: 240,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both',
      }
    );

    return () => {
      animation.cancel();
    };
  }, [transitionKey]);

  return (
    <div
      ref={containerRef}
      className="page-transition-wrapper"
      style={{
        width: '100%',
        minHeight: '60vh',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
