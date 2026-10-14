import { useEffect, useRef } from 'react';

/**
 * Ultra-smooth, hardware-accelerated scroll and viewport reveal hook.
 * Inspired by DecorHome and Emil Kowalski design engineering principles:
 * - Multi-level editorial stagger (kickers -> headings -> content -> cards)
 * - Card image un-scale lens focus (scale(1.08) -> scale(1))
 * - Zero layout thrashing: composite-only transforms (translate3d, scale, opacity)
 * - Generous IntersectionObserver rootMargin (120px) so content renders smoothly before viewport center
 * - Passive RAF scroll parallax for showcase images with immediate GPU layer cleanup
 * - Strict prefers-reduced-motion compliance
 */
export default function useScrollReveal(content) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window) || !root.animate) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const activeAnimations = new Set();
    let observer;
    let rafId = null;

    const play = (element, frames, options) => {
      if (!element || preference.matches) return null;
      element.style.willChange = 'transform, opacity';
      const animation = element.animate(frames, options);
      activeAnimations.add(animation);
      animation.onfinish = () => {
        activeAnimations.delete(animation);
        element.style.willChange = '';
      };
      animation.oncancel = () => {
        activeAnimations.delete(animation);
        element.style.willChange = '';
      };
      return animation;
    };

    const configure = () => {
      observer?.disconnect();
      activeAnimations.forEach((anim) => anim.cancel());
      activeAnimations.clear();

      if (preference.matches || document.body.classList.contains('is-loading')) return;

      // Single IntersectionObserver for all reveal targets
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ target, isIntersecting }) => {
            if (!isIntersecting) return;
            observer.unobserve(target);
            if (target.dataset.revealed === 'true') return;
            target.dataset.revealed = 'true';

            // 1. Specialized: Product & Showcase Cards
            if (target.classList.contains('furniture-card') || target.classList.contains('category-showcase-card')) {
              const siblings = target.parentElement ? [...target.parentElement.children] : [target];
              const index = siblings.indexOf(target);
              const staggerDelay = index >= 0 ? (index % 4) * 65 : 0;

              // Card envelope lift
              play(
                target,
                [
                  { opacity: 0, transform: 'translate3d(0, 18px, 0) scale(0.985)' },
                  { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
                ],
                {
                  duration: 820,
                  delay: staggerDelay,
                  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  fill: 'backwards',
                }
              );

              // Inner Image Lens Un-scale (Physical Camera Arrival Focus)
              const innerImg = target.querySelector('.furniture-card-img-wrap img, .category-card-img');
              if (innerImg) {
                play(
                  innerImg,
                  [
                    { transform: 'scale(1.05)' },
                    { transform: 'scale(1)' },
                  ],
                  {
                    duration: 980,
                    delay: staggerDelay + 30,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    fill: 'backwards',
                  }
                );
              }
              return;
            }

            // 2. Specialized: Section Headings (Staggered Kicker -> Title -> Subtitle)
            if (target.classList.contains('section-heading')) {
              const kicker = target.querySelector('.section-kicker');
              const title = target.querySelector('h2');
              const textOrLink = target.querySelector('p, .editorial-link');

              if (kicker) {
                play(
                  kicker,
                  [
                    { opacity: 0, transform: 'translate3d(0, 10px, 0)' },
                    { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                  ],
                  {
                    duration: 650,
                    delay: 0,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    fill: 'backwards',
                  }
                );
              }

              if (title) {
                play(
                  title,
                  [
                    { opacity: 0, transform: 'translate3d(0, 16px, 0)' },
                    { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                  ],
                  {
                    duration: 780,
                    delay: 60,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    fill: 'backwards',
                  }
                );
              }

              if (textOrLink) {
                play(
                  textOrLink,
                  [
                    { opacity: 0, transform: 'translate3d(0, 12px, 0)' },
                    { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                  ],
                  {
                    duration: 750,
                    delay: 130,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    fill: 'backwards',
                  }
                );
              }
              return;
            }

            // 3. Specialized: Service Strip Items
            if (target.classList.contains('service-item')) {
              const siblings = target.parentElement ? [...target.parentElement.children] : [target];
              const index = siblings.indexOf(target);
              const delay = Math.max(0, index) * 60;

              play(
                target,
                [
                  { opacity: 0, transform: 'translate3d(0, 16px, 0)' },
                  { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                ],
                {
                  duration: 720,
                  delay,
                  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  fill: 'backwards',
                }
              );

              const icon = target.querySelector('svg');
              if (icon) {
                play(
                  icon,
                  [
                    { transform: 'scale(0.92)' },
                    { transform: 'scale(1)' },
                  ],
                  {
                    duration: 600,
                    delay: delay + 40,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    fill: 'backwards',
                  }
                );
              }
              return;
            }

            // 4. Specialized: Room Category Links
            if (target.classList.contains('room-link')) {
              const siblings = target.parentElement ? [...target.parentElement.children] : [target];
              const index = siblings.indexOf(target);
              const delay = Math.max(0, index) * 50;

              play(
                target,
                [
                  { opacity: 0, transform: 'translate3d(0, 14px, 0)' },
                  { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                ],
                {
                  duration: 700,
                  delay,
                  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  fill: 'backwards',
                }
              );
              return;
            }

            // 5. Specialized: Visit Showroom Panel
            if (target.classList.contains('visit-image')) {
              play(
                target,
                [
                  { opacity: 0, transform: 'translate3d(0, 20px, 0) scale(0.99)' },
                  { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
                ],
                {
                  duration: 900,
                  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  fill: 'backwards',
                }
              );
              return;
            }

            if (target.classList.contains('visit-copy')) {
              const parts = target.querySelectorAll('.section-kicker, h2, p, .visit-details, .visit-actions');
              parts.forEach((el, idx) => {
                play(
                  el,
                  [
                    { opacity: 0, transform: 'translate3d(0, 14px, 0)' },
                    { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                  ],
                  {
                    duration: 750,
                    delay: idx * 60,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    fill: 'backwards',
                  }
                );
              });
              return;
            }

            // 6. Generic targets with clean smooth slide
            const siblings = target.parentElement ? [...target.parentElement.children] : [target];
            const siblingIndex = siblings.indexOf(target);
            const staggerDelay = siblingIndex >= 0 ? Math.min(siblingIndex % 4, 3) * 40 : 0;

            play(
              target,
              [
                { opacity: 0, transform: 'translate3d(0, 16px, 0)' },
                { opacity: 1, transform: 'translate3d(0, 0, 0)' },
              ],
              {
                duration: 760,
                delay: staggerDelay,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                fill: 'backwards',
              }
            );
          });
        },
        {
          threshold: 0.02,
          rootMargin: '0px 0px 200px 0px',
        }
      );

      // Select targets across pages
      const selectors = [
        '[data-reveal]',
        '.section-heading',
        '.service-item',
        '.room-link',
        '.furniture-card',
        '.category-showcase-card',
        '.visit-image',
        '.visit-copy',
        '.catalogue-filters',
        '.catalogue-toolbar',
        '.product-detail-page h1',
        '.about-feature-box',
      ].join(',');

      root.querySelectorAll(selectors).forEach((el) => {
        if (!el.dataset.revealed) {
          observer.observe(el);
        }
      });
    };

    // Passive Scroll Loop for Subtle Hero Cue Fade & Parallax (Zero Layout Reflow)
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const scrollY = window.scrollY || window.pageYOffset || 0;

        // Auto-fade scroll prompt
        const scrollCue = root.querySelector('.hero-scroll-cue');
        if (scrollCue) {
          if (scrollY > 20) {
            scrollCue.classList.add('is-hidden');
          } else {
            scrollCue.classList.remove('is-hidden');
          }
        }

        // Lightweight Parallax on Hero and Visit Images (Only if in viewport)
        if (!preference.matches && scrollY < window.innerHeight * 2) {
          const parallaxImgs = root.querySelectorAll('.parallax-layer');
          parallaxImgs.forEach((img) => {
            const rect = img.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              const offset = Math.max(-24, Math.min(24, (rect.top / window.innerHeight) * -20));
              img.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
            }
          });
        }
      });
    };

    configure();
    window.addEventListener('scroll', handleScroll, { passive: true });
    preference.addEventListener('change', configure);
    window.addEventListener('site-ready', configure);

    return () => {
      observer?.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      preference.removeEventListener('change', configure);
      window.removeEventListener('site-ready', configure);
      activeAnimations.forEach((anim) => anim.cancel());
    };
  }, [content]);

  return rootRef;
}
