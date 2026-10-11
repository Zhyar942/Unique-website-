import React from 'react';
import { Link } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { homeCopy } from '../data/homeCopy';
import { AppIcon } from './ui/Icon';

export default function ShoppingHero() {
  const { lang, t, isRtl } = useLanguage();
  const copy = homeCopy[lang] || homeCopy.en;
  return (
    <section className="shopping-hero container">
      <div className="shopping-hero-copy">
        <span className="hero-eyebrow hero-stagger-1">{copy.eyebrow}</span>
        <h1 className="hero-title hero-stagger-2">
          {copy.title} <em>{copy.accent}</em>
        </h1>
        <p className="hero-intro hero-stagger-3">{copy.intro}</p>
        <div className="shopping-hero-actions hero-stagger-4">
          <Link href="/products" className="btn btn-primary btn-lift">
            {copy.explore}
            <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={17} />
          </Link>
          <Link href="/products?collection=Details" className="hero-office-link">
            {t.catalogFilter?.collections?.Details || 'Details Collection'}
          </Link>
        </div>
        <Link href="/contact" className="hero-location hero-stagger-5">
          <AppIcon name="location" size={16} />
          {copy.location}
        </Link>
      </div>

      <div className="shopping-hero-image">
        <div className="hero-badge font-heading" aria-label="Established 1978">
          <span>{copy.badge}</span>
        </div>
        <img
          src="/hero_interior.jpg"
          alt={t.categories.living}
          fetchPriority="high"
          className="parallax-layer"
        />
        <span className="hero-photo-note">
          {t.nav.homeFurniture}
          <span>UNIQUE / SULAYMANIYAH</span>
        </span>
      </div>

    </section>
  );
}
