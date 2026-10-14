import React from 'react';
import { AppIcon } from '../components/ui/Icon';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import { businessInfo, getGeneralWhatsAppUrl } from '../config/businessInfo';
import useScrollReveal from '../hooks/useScrollReveal';

const About = () => {
  const { lang, t, isRtl } = useLanguage();
  const { navigate } = useRouter();
  const { settings } = useCatalog();
  const info = settings || businessInfo;
  const revealRef = useScrollReveal();

  const about = t.aboutPage || {};
  const stats = about.stats || [];
  const pillars = about.pillars || [];
  const processSteps = about.processSteps || [];
  const materialsSpotlight = about.materialsSpotlight || { items: [] };
  const showroomCard = about.showroomCard || {};

  const handleWhatsApp = () => {
    const url = getGeneralWhatsAppUrl(lang, info?.whatsappNumber);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    window.location.href = `tel:${info?.phoneTechnical || '+9647729754844'}`;
  };

  const handleDirections = () => {
    const mapUrl = info?.showroom?.googleMapsUrl || businessInfo.showroom.googleMapsUrl;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  const pageTitle = about.heroTitle || (lang === 'ku'
    ? 'تێکەڵکردنی ئەندازیاری هاوچەرخ لەگەڵ جوانی کەرەستەی سروشتی'
    : lang === 'ar'
    ? 'حيث تلتقي الهندسة المعمارية بالأصالة الحقيقية للخامات'
    : 'Where Architectural Harmony Meets Enduring Living');

  return (
    <div ref={revealRef} className="about-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="about-breadcrumb">
          <button type="button" onClick={() => navigate('/')}>
            {t.nav.home}
          </button>
          <span className="about-breadcrumb-sep" aria-hidden="true">/</span>
          <span className="about-breadcrumb-current">
            {t.nav.about}
          </span>
        </nav>

        {/* Modern Digital Furniture Hero */}
        <header data-reveal className="about-modern-hero">
          <div className="about-hero-content">
            <span className="about-badge">
              <span className="about-badge-dot" aria-hidden="true" />
              {about.badge || (lang === 'ku' ? 'ناسنامە و ڕەسەنایەتی' : lang === 'ar' ? 'هوية ورسالة يونيك' : 'Our Story & Purpose')}
            </span>
            <h1 className="about-headline">
              {pageTitle}
            </h1>
            <p className="about-subtitle">
              {about.heroSubtitle || t.brandStory?.p1 || (lang === 'ku'
                ? 'لە یۆنیک مۆبیلیات، ئێمە باوەڕمان بە مۆبیلیاتی کاتی و خێرا نییە. هەموو پارچەیەک لە داری سروشتی، مەڕمەڕی ڕەسەن و قوماشی تایبەت دروست دەکرێت بۆ ژیانێکی درێژخایەن.'
                : 'At Unique Furniture, we create timeless pieces crafted from authentic solid wood, marble, and premium textiles.')}
            </p>
            <div className="about-hero-actions">
              <button type="button" onClick={() => navigate('/products')} className="btn btn-primary btn-lift">
                <span>{t.nav.allProducts || (lang === 'ku' ? 'تەماشای بەرهەمەکان' : lang === 'ar' ? 'استكشف التشكيلة' : 'Explore Collection')}</span>
                <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={15} />
              </button>
              <button type="button" onClick={handleDirections} className="btn btn-secondary">
                <AppIcon name="location" size={15} />
                <span>{t.showroom?.getDirections || (lang === 'ku' ? 'سەردانی پێشانگا' : lang === 'ar' ? 'موقع الصالة' : 'Visit Showroom')}</span>
              </button>
            </div>
          </div>

          <div className="about-hero-visual">
            <div className="about-hero-img-wrap">
              <img
                src="/hero_interior.jpg"
                alt="Unique Furniture Showroom Sulaymaniyah"
                loading="eager"
              />
              <div className="about-hero-badge-overlay">
                <AppIcon name="location" size={14} color="var(--brand-orange, #c86526)" />
                <span>{lang === 'ku' ? 'پێشانگای سەرەکی لە سلێمانی · دامەزراوە لە ١٩٧٨' : lang === 'ar' ? 'صالة العرض في السليمانية · منذ 1978' : 'Sulaymaniyah Flagship Showroom · Est. 1978'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Modern Web Trust Metrics Grid */}
        {/* Modern Web Trust Metrics Grid */}
        <section data-reveal aria-label="Key Milestones" className="about-metrics-grid">
          {stats.map((item, idx) => (
            <div key={idx} className="about-metric-card">
              <span className="about-metric-val" dir="ltr">{item.value}</span>
              <h3 className="about-metric-label">{item.label}</h3>
              <p className="about-metric-desc">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Visual Showcase & Brand Philosophy */}
        <section data-reveal aria-label="Craftsmanship Showcase" className="about-showcase-grid">
          {/* Main Showcase Visual */}
          <div className="about-showcase-media">
            <img
              src="/images/sofa_cloud_sectional.jpg"
              alt="Unique Furniture Living Space"
              loading="lazy"
            />
            <div className="about-showcase-overlay">
              <span className="about-showcase-tag">
                {lang === 'ku' ? 'بەشی ماڵ و ژووری میوان' : lang === 'ar' ? 'أثاث الصالونات وغرف المعيشة' : 'Living & Lounge'}
              </span>
              <p className="about-showcase-desc">
                {lang === 'ku'
                  ? 'هێمنی، ئاسوودەیی دانیشتن و کەرەستەی دژە پەڵە بۆ ژیانی ڕۆژانەی ماڵەکەت.'
                  : lang === 'ar'
                  ? 'هدوء في التصميم، راحة استثنائية وأقمشة عملية تدوم لأجيال.'
                  : 'Serene aesthetics, deep ergonomic cushioning, and long-wearing textiles.'}
              </p>
            </div>
          </div>

          {/* Secondary Visuals & Quote */}
          <div className="about-showcase-side">
            <div className="about-showcase-thumbs">
              <div className="about-thumb-card">
                <img
                  src="/images/dari_zani_romani.jpg"
                  alt={lang === 'ku' ? 'داری زانی ڕۆمانی' : lang === 'ar' ? 'خشب الزان الروماني' : 'Roman Beech Wood'}
                  loading="lazy"
                />
                <span className="about-thumb-label">{lang === 'ku' ? 'داری زانی ڕۆمانی' : lang === 'ar' ? 'خشب الزان الروماني' : 'Roman Beech Wood'}</span>
              </div>
              <div className="about-thumb-card">
                <img
                  src="/images/qumashi_quality_barz.jpg"
                  alt={lang === 'ku' ? 'قوماشی کوالێتی بەرز' : lang === 'ar' ? 'أقمشة عالية الجودة' : 'High Quality Fabric'}
                  loading="lazy"
                />
                <span className="about-thumb-label">{lang === 'ku' ? 'قوماشی کوالێتی بەرز' : lang === 'ar' ? 'أقمشة عالية الجودة' : 'High Quality Fabric'}</span>
              </div>
            </div>

            {about.curationQuote && (
              <div className="about-quote-box">
                <p className="about-quote-content">
                  {about.curationQuote.quote}
                </p>
                <div className="about-quote-meta">
                  <span className="about-quote-line" aria-hidden="true" />
                  <span className="about-quote-by">{about.curationQuote.author}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4 Core Pillars of Excellence */}
        <section data-reveal aria-labelledby="pillars-heading" className="about-section">
          <div className="about-header-center">
            <span className="about-section-kicker">
              {lang === 'ku' ? 'بنەماکانی کارکردنمان' : lang === 'ar' ? 'ركائز الجودة' : 'Our Commitments'}
            </span>
            <h2 id="pillars-heading" className="about-section-heading">
              {about.pillarsTitle || (lang === 'ku' ? 'بۆچی هەڵبژاردنی یۆنیک مۆبیلیات؟' : lang === 'ar' ? 'لماذا تختار يونيك للموبيليا؟' : 'The Pillars of Unique Furniture')}
            </h2>
            <p className="about-section-sub">
              {about.pillarsSubtitle || (lang === 'ku' ? 'چوار بنەمای نەگۆڕ کە جیاوازیمان لە تەواوی بازاڕدا دەسەلمێنن' : lang === 'ar' ? 'أربعة معايير أصيلة تصنع الفارق الحقيقي في كل تفصيل' : 'Four uncompromising commitments that define our standard of excellence')}
            </p>
          </div>

          <div className="about-pillars-cards">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="about-card-modern">
                <div className="about-card-header">
                  <span className="about-card-index">0{idx + 1}</span>
                  <AppIcon name="star" size={15} color="var(--brand-orange, #c86526)" />
                </div>
                <h3 className="about-card-title">{pillar.title}</h3>
                <p className="about-card-text">{pillar.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The 4-Step Bespoke Journey */}
        <section data-reveal aria-labelledby="process-heading" className="about-section about-process-box">
          <div className="about-header-center">
            <span className="about-section-kicker">
              {lang === 'ku' ? 'قۆناغەکانی کارکردن' : lang === 'ar' ? 'خطوات التنفيذ' : 'How We Work'}
            </span>
            <h2 id="process-heading" className="about-section-heading">
              {about.processTitle || (lang === 'ku' ? 'ڕێچکەی دیزاین و دەستنیشانکردن لەگەڵ یۆنیک' : lang === 'ar' ? 'رحلة اختيار الأثاث والتفصيل معنا' : 'The Bespoke Curation Journey')}
            </h2>
            <p className="about-section-sub">
              {about.processSubtitle || (lang === 'ku' ? 'لە یەکەم سەردانت بۆ پێشانگا تا دابینکردنی لە ماڵەکەتدا' : lang === 'ar' ? 'من أول زيارة لصالة العرض حتى اكتمال الترتيب في منزلك' : 'From your initial showroom visit to final white-glove installation')}
            </p>
          </div>

          <div className="about-process-cards">
            {processSteps.map((step, idx) => (
              <div key={idx} className="about-step-card">
                <div className="about-step-top">
                  <span className="about-step-number">{step.step}</span>
                  <span className="about-step-divider" aria-hidden="true" />
                </div>
                <h3 className="about-step-title">{step.title}</h3>
                <p className="about-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Material Provenance Spotlight */}
        {materialsSpotlight?.items?.length > 0 && (
          <section data-reveal aria-labelledby="materials-heading" className="about-section">
            <div className="about-header-center">
              <span className="about-section-kicker">{materialsSpotlight.badge}</span>
              <h2 id="materials-heading" className="about-section-heading">{materialsSpotlight.title}</h2>
            </div>

            <div className="about-materials-cards">
              {materialsSpotlight.items.map((mat, idx) => (
                <div key={idx} className="about-mat-card">
                  <div className="about-mat-top">
                    <span className="about-mat-dot" aria-hidden="true" />
                    <h3 className="about-mat-name">{mat.name}</h3>
                  </div>
                  <p className="about-mat-text">{mat.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Flagship Showroom Card & Actions */}
        <section data-reveal aria-labelledby="showroom-heading" className="about-showroom-box">
          <div className="about-showroom-inner">
            <div className="about-showroom-copy">
              <span className="about-showroom-tag">
                {showroomCard.badge || (lang === 'ku' ? 'پێشانگای سەرەکی لە سلێمانی' : lang === 'ar' ? 'صالة العرض الرئيسية' : 'Sulaymaniyah Flagship')}
              </span>
              <h2 id="showroom-heading" className="about-showroom-h2">
                {showroomCard.title || (lang === 'ku' ? 'سەردانی پێشانگای یۆنیک مۆبیلیات بکە' : lang === 'ar' ? 'تفضل بزيارة صالة عرض يونيك' : 'Visit the Unique Furniture Showroom')}
              </h2>
              <p className="about-showroom-p">
                {showroomCard.text || (lang === 'ku' ? info.showroom.addressKu : lang === 'ar' ? info.showroom.addressAr : info.showroom.addressEn)}
              </p>
            </div>

            <div className="about-showroom-details">
              <div className="about-detail-item">
                <AppIcon name="location" size={16} />
                <span>{lang === 'ku' ? info.showroom.cityKu : lang === 'ar' ? info.showroom.cityAr : info.showroom.cityEn}</span>
              </div>
              <div className="about-detail-item">
                <AppIcon name="time" size={16} />
                <span>{lang === 'ku' ? info.showroom.hoursKu : lang === 'ar' ? info.showroom.hoursAr : info.showroom.hoursEn}</span>
              </div>
              <div className="about-detail-item">
                <AppIcon name="call" size={16} />
                <span style={{ direction: 'ltr' }}>{info.phoneDisplay}</span>
              </div>
            </div>
          </div>

          <div className="about-showroom-btns">
            <button type="button" onClick={handleWhatsApp} className="btn-action-whatsapp">
              <AppIcon name="share" size={16} />
              <span>{showroomCard.actionWhatsApp || t.nav.whatsApp}</span>
            </button>
            <button type="button" onClick={handleCall} className="btn-action-call">
              <AppIcon name="call" size={16} />
              <span>{showroomCard.actionCall || t.showroom?.callUs || (lang === 'ku' ? 'پەیوەندی' : 'Call')}</span>
            </button>
            <button type="button" onClick={handleDirections} className="btn-action-directions">
              <AppIcon name="location" size={16} />
              <span>{showroomCard.actionDirections || t.showroom?.getDirections || (lang === 'ku' ? 'نەخشە' : 'Directions')}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
