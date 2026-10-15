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
          <Link href="/products?department=office" className="hero-office-link">
            {copy.office || (lang === 'ku' ? 'بۆ شوێنی کارت' : lang === 'ar' ? 'لمساحة عملك' : 'For your workspace')}
          </Link>
        </div>
        <Link href="/contact" className="hero-location hero-stagger-5">
          <AppIcon name="location" size={16} />
          {copy.location}
        </Link>
        {/* Butter-Smooth Scroll Down Indicator */}
        <div
          className="hero-scroll-cue hero-stagger-5"
          onClick={() => {
            const next = document.querySelector('.service-strip') || document.querySelector('.home-section');
            if (next) next.scrollIntoView({ behavior: 'smooth' });
          }}
          role="button"
          tabIndex={0}
          aria-label={copy.scrollHint || 'Scroll to explore'}
        >
          <div className="scroll-cue-mouse">
            <span className="scroll-cue-wheel" />
          </div>
          <span className="scroll-cue-text">{copy.scrollHint}</span>
        </div>
      </div>

      <div className="shopping-hero-image">
        {/* Architectural Rectangular Heritage Badge (Horizontal Layout) */}
        <div className="hero-heritage-badge" aria-label={copy.badgeLabel || 'Since 1978 · Sulaymaniyah'}>
          <span className="heritage-badge-est">{isRtl ? 'لە ساڵی' : 'SINCE'}</span>
          <span className="heritage-badge-year">1978</span>
          <span className="heritage-badge-sep" aria-hidden="true">·</span>
          <span className="heritage-badge-city">{isRtl ? 'سلێمانی' : 'SULAYMANIYAH'}</span>
        </div>
        <img
          src="/hero_interior.jpg"
          alt={t.categories.living}
          fetchPriority="high"
          className="parallax-layer"
        />
        <span className="hero-photo-note">
          {t.nav.homeFurniture}
          <span>{isRtl ? 'یۆنیک · سلێمانی · لە ١٩٧٨ەوە' : 'UNIQUE · SULAYMANIYAH · SINCE 1978'}</span>
        </span>
      </div>

    </section>
  );
}
