import { useEffect } from 'react';

// Critical device assets to warm up in cache & decode into GPU memory while animating
const CRITICAL_DEVICE_ASSETS = [
  '/hero_interior.jpg',
  '/brand/unique-logo.svg',
  '/brand/unique-symbol.svg',
  '/images/sofa_cloud_sectional.jpg',
  '/images/dining_table_marble.jpg',
];

function preloadAndDecode(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    if (typeof img.decode === 'function') {
      img.decode().then(resolve).catch(resolve);
    } else {
      img.onload = resolve;
      img.onerror = resolve;
    }
  });
}

export default function useStartupLoader() {
  useEffect(() => {
    const loader = document.getElementById('startup-loader');
    if (!loader) return;

    let active = true;
    let dockingAnimation;
    const handleResize = () => dockingAnimation?.finish();
    const timers = [];
    const wait = (duration) => new Promise((resolve) => {
      timers.push(setTimeout(resolve, duration));
    });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Actively load and GPU-decode assets into device memory while the animation plays
    const liveImages = [...document.querySelectorAll('img.startup-logo, .shopping-hero-image > img')];
    const resourcesPromise = Promise.allSettled([
      document.fonts.ready,
      ...CRITICAL_DEVICE_ASSETS.map(preloadAndDecode),
      ...liveImages.map((image) => (typeof image.decode === 'function' ? image.decode() : Promise.resolve())),
    ]);

    const reveal = async () => {
      if (reducedMotion) {
        loader.remove();
        document.body.classList.remove('is-loading', 'is-docking');
        document.getElementById('root')?.removeAttribute('inert');
        window.dispatchEvent(new Event('site-ready'));
        return;
      }

      // Phase 1: "give the logo" — Present full logo in the center for a clear viewing pause
      await wait(850);
      if (!active) return;

      // Phase 2: "then go in to the u" — Text slides into the 'U' emblem in the center
      loader.classList.add('is-packing');
      await wait(500);
      if (!active) return;

      // Concurrently wait for background asset preloading, capped at 2600ms
      await Promise.race([
        resourcesPromise,
        wait(2600),
      ]);
      if (!active) return;

      // Phase 3: "and continue to the top" — The 'U' emblem travels to the header
      const logo = loader.querySelector('.startup-logo');
      const destination = [...document.querySelectorAll('.header-logo-img, .header-symbol-img')]
        .find((image) => image.getBoundingClientRect().width > 0);

      if (logo && destination && logo.animate) {
        const start = logo.getBoundingClientRect();
        const end = destination.getBoundingClientRect();
        const dx = end.left - start.left;
        const dy = end.top - start.top;
        const sx = end.width / start.width;
        const sy = end.height / start.height;

        logo.style.animation = 'none';
        logo.style.transformOrigin = 'top left';
        loader.classList.add('is-docking');
        document.body.classList.replace('is-loading', 'is-docking');

        // Phase 4: "and come out of the u in top" — Trigger text emergence as 'U' reaches top dock
        timers.push(setTimeout(() => {
          if (active && loader) {
            loader.classList.add('is-settling');
          }
        }, 620));

        // Calm, luxurious flight of the 'U' to the header
        dockingAnimation = logo.animate([
          {
            transform: 'translate3d(0px, 0px, 0) scale(1)'
          },
          {
            transform: `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})`
          }
        ], {
          duration: 1050,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards'
        });
        window.addEventListener('resize', handleResize, { once: true });
      } else {
        loader.classList.add('is-leaving');
        document.body.classList.replace('is-loading', 'is-docking');
      }

      window.dispatchEvent(new Event('site-ready'));

      if (dockingAnimation) {
        await dockingAnimation.finished.catch(() => {});
        // Allow text-out-of-u (starts at 620ms, takes 480ms -> 1100ms) to settle seamlessly
        await wait(180);
      } else {
        await wait(600);
      }

      if (!active) return;
      loader.remove();
      document.body.classList.remove('is-docking');
      window.removeEventListener('resize', handleResize);
      document.getElementById('root')?.removeAttribute('inert');
    };
    reveal();
    return () => {
      active = false;
      dockingAnimation?.cancel();
      window.removeEventListener('resize', handleResize);
      timers.forEach(clearTimeout);
    };
  }, []);
}
