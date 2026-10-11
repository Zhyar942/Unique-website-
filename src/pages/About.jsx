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

  return (
    <div ref={revealRef} className="about-page" style={{ padding: '3rem 0 6rem 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2.5rem',
            fontSize: '0.86rem'
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              transition: 'color var(--duration-fast) var(--ease-out-smooth)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            {t.nav.home}
          </button>
          <span style={{ color: 'var(--text-muted)' }} aria-hidden="true">/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {t.nav.about}
          </span>
        </nav>

        {/* Hero Section — Editorial Heritage */}
        <header data-reveal style={{ marginBottom: '3.5rem', maxWidth: '880px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--brand-orange)',
              letterSpacing: isRtl ? '0.02em' : '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
              backgroundColor: 'var(--brand-orange-tint)',
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--brand-orange-border)'
            }}
          >
            {about.badge || (lang === 'ku' ? 'ناسنامەی یۆنیک مۆبیلیات' : lang === 'ar' ? 'هوية يونيك للموبيليا' : 'Our Story & Purpose')}
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)',
              fontWeight: 800,
              marginBottom: '1.25rem',
              lineHeight: 1.22,
              color: 'var(--text-primary)'
            }}
          >
            {about.heroTitle || t.brandStory.title}
          </h1>
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
              lineHeight: 1.85,
              color: 'var(--text-secondary)',
              margin: 0
            }}
          >
            {about.heroSubtitle || t.brandStory.p1}
          </p>
        </header>

        {/* Key Metrics / Stats Grid */}
        <section
          data-reveal
          aria-label="Key Milestones & Metrics"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
            gap: '1.25rem',
            marginBottom: 'clamp(3rem, 6vw, 4.5rem)'
          }}
        >
          {stats.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-card)',
                padding: '1.6rem 1.4rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-raised-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform var(--duration-fast) var(--ease-out-smooth), box-shadow var(--duration-fast) var(--ease-out-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-raised)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-raised-sm)';
              }}
            >
              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: 'clamp(2.4rem, 4vw, 3rem)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: 'var(--brand-orange)',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.4rem'
                  }}
                >
                  {item.value}
                </span>
                <strong
                  style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '0.35rem'
                  }}
                >
                  {item.label}
                </strong>
              </div>
              <p
                style={{
                  fontSize: '0.84rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  margin: 0
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Visual Showcase — Asymmetric Architectural Gallery */}
        <section
          data-reveal
          aria-label="Craftsmanship Showcase"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: '1.5rem',
            marginBottom: 'clamp(3rem, 6vw, 4.5rem)',
            alignItems: 'stretch'
          }}
        >
          {/* Main Large Visual */}
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              minHeight: '340px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <img
              src="/images/sofa_cloud_sectional.jpg"
              alt="Unique Furniture living space and sofa craftsmanship"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.6s var(--ease-out-smooth)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(24, 24, 27, 0.72) 0%, rgba(24, 24, 27, 0.05) 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.5rem'
              }}
            >
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {lang === 'ku' ? 'بەشی ماڵ و ژووری میوان' : lang === 'ar' ? 'أثاث الصالونات وغرف المعيشة' : 'Living & Lounge Craft'}
              </span>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.92rem',
                  marginTop: '0.3rem',
                  marginBottom: 0,
                  lineHeight: 1.5
                }}
              >
                {lang === 'ku'
                  ? 'هێمنی، ئاسوودەیی دانیشتن و کەرەستەی دژە پەڵە بۆ ژیانی ڕۆژانەی ماڵەکەت.'
                  : lang === 'ar'
                  ? 'هدوء في التصميم، راحة استثنائية وأقمشة عملية تدوم لأجيال.'
                  : 'Serene aesthetics, deep ergonomic cushioning, and long-wearing textiles.'}
              </p>
            </div>
          </div>

          {/* Secondary Stacked Visuals + Quote Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'space-between' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '1rem',
                flex: 1
              }}
            >
              <div
                style={{
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  minHeight: '160px',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <img
                  src="/images/dining_table_marble.jpg"
                  alt="Italian marble and natural travertine craftsmanship"
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div
                style={{
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  minHeight: '160px',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <img
                  src="/images/executive_desk_walnut.jpg"
                  alt="Solid American walnut executive desk"
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>

            {/* Editorial Curation Quote Card */}
            {about.curationQuote && (
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  position: 'relative'
                }}
              >
                <p
                  style={{
                    fontSize: '1rem',
                    fontStyle: 'italic',
                    lineHeight: 1.7,
                    color: 'var(--text-primary)',
                    margin: 0
                  }}
                >
                  {about.curationQuote.quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '2px',
                      backgroundColor: 'var(--brand-orange)',
                      display: 'inline-block'
                    }}
                  />
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {about.curationQuote.author}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4 Core Pillars of Excellence */}
        <section
          data-reveal
          aria-labelledby="pillars-heading"
          style={{ marginBottom: 'clamp(3.5rem, 6vw, 5rem)' }}
        >
          <div style={{ marginBottom: '2.5rem', maxWidth: '720px' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--brand-orange)',
                letterSpacing: isRtl ? '0.02em' : '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem'
              }}
            >
              {lang === 'ku' ? 'بنەماکانی کارکردنمان' : lang === 'ar' ? 'ركائز الجودة' : 'Our Commitments'}
            </span>
            <h2
              id="pillars-heading"
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
                fontWeight: 800,
                margin: '0 0 0.6rem 0',
                color: 'var(--text-primary)'
              }}
            >
              {about.pillarsTitle || (lang === 'ku' ? 'بۆچی هەڵبژاردنی یۆنیک مۆبیلیات؟' : lang === 'ar' ? 'لماذا تختار يونيك للموبيليا؟' : 'The Pillars of Unique Furniture')}
            </h2>
            <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
              {about.pillarsSubtitle || (lang === 'ku' ? 'چوار بنەمای نەگۆڕ کە جیاوازیمان لە تەواوی بازاڕدا دەسەلمێنن' : lang === 'ar' ? 'أربعة معايير أصيلة تصنع الفارق الحقيقي في كل تفصيل' : 'Four uncompromising commitments that define our standard of excellence')}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: '1.5rem'
            }}
          >
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-raised-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--brand-orange-tint)',
                      color: 'var(--brand-orange)',
                      fontWeight: 800,
                      fontSize: '0.88rem'
                    }}
                  >
                    0{idx + 1}
                  </span>
                  <AppIcon name="star" size={16} color="var(--brand-orange)" />
                </div>
                <h3
                  style={{
                    fontSize: '1.18rem',
                    fontWeight: 700,
                    margin: '0.25rem 0 0 0',
                    color: 'var(--text-primary)'
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.92rem',
                    lineHeight: 1.72,
                    color: 'var(--text-secondary)',
                    margin: 0
                  }}
                >
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The 4-Step Bespoke Journey */}
        <section
          data-reveal
          aria-labelledby="process-heading"
          style={{
            marginBottom: 'clamp(3.5rem, 6vw, 5rem)',
            backgroundColor: 'var(--bg-secondary)',
            padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2.5rem)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ marginBottom: '2.5rem', maxWidth: '720px' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--brand-orange)',
                letterSpacing: isRtl ? '0.02em' : '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem'
              }}
            >
              {lang === 'ku' ? 'قۆناغەکانی کارکردن' : lang === 'ar' ? 'خطوات التنفيذ' : 'How We Work'}
            </span>
            <h2
              id="process-heading"
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
                fontWeight: 800,
                margin: '0 0 0.6rem 0',
                color: 'var(--text-primary)'
              }}
            >
              {about.processTitle || (lang === 'ku' ? 'ڕێچکەی دیزاین و دەستنیشانکردن لەگەڵ یۆنیک' : lang === 'ar' ? 'رحلة اختيار الأثاث والتفصيل معنا' : 'The Bespoke Curation Journey')}
            </h2>
            <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
              {about.processSubtitle || (lang === 'ku' ? 'لە یەکەم سەردانت بۆ پێشانگا تا دابینکردنی لە ماڵەکەتدا' : lang === 'ar' ? 'من أول زيارة لصالة العرض حتى اكتمال الترتيب في منزلك' : 'From your initial showroom visit to final white-glove installation')}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
              gap: '1.25rem'
            }}
          >
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '1.6rem 1.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-raised-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'var(--brand-orange)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1
                    }}
                  >
                    {step.step}
                  </span>
                  <span
                    style={{
                      height: '1px',
                      flex: 1,
                      backgroundColor: 'var(--border-subtle)'
                    }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: '1.08rem',
                    fontWeight: 700,
                    margin: 0,
                    color: 'var(--text-primary)'
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                    margin: 0
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Material Provenance Spotlight */}
        {materialsSpotlight?.items?.length > 0 && (
          <section
            data-reveal
            aria-labelledby="materials-heading"
            style={{ marginBottom: 'clamp(3.5rem, 6vw, 5rem)' }}
          >
            <div style={{ marginBottom: '2.5rem', maxWidth: '720px' }}>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--brand-orange)',
                  letterSpacing: isRtl ? '0.02em' : '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
              >
                {materialsSpotlight.badge}
              </span>
              <h2
                id="materials-heading"
                style={{
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
                  fontWeight: 800,
                  margin: '0 0 0.6rem 0',
                  color: 'var(--text-primary)'
                }}
              >
                {materialsSpotlight.title}
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: '1.25rem'
              }}
            >
              {materialsSpotlight.items.map((mat, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '1.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-raised-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-orange)'
                      }}
                    />
                    <h3
                      style={{
                        fontSize: '1.08rem',
                        fontWeight: 700,
                        margin: 0,
                        color: 'var(--text-primary)'
                      }}
                    >
                      {mat.name}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.68,
                      color: 'var(--text-secondary)',
                      margin: 0
                    }}
                  >
                    {mat.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Flagship Showroom Card & Actions */}
        <section
          data-reveal
          aria-labelledby="showroom-heading"
          style={{
            padding: 'clamp(2rem, 5vw, 3.2rem)',
            backgroundColor: 'var(--bg-dark)',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--accent-sand)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: isRtl ? '0.02em' : '0.06em',
                  display: 'inline-block',
                  marginBottom: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {showroomCard.badge || (lang === 'ku' ? 'پێشانگای سەرەکی لە سلێمانی' : lang === 'ar' ? 'صالة العرض الرئيسية' : 'Sulaymaniyah Flagship')}
              </span>
              <h2
                id="showroom-heading"
                style={{
                  color: '#ffffff',
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  fontWeight: 800,
                  margin: '0 0 0.6rem 0',
                  lineHeight: 1.25
                }}
              >
                {showroomCard.title || (lang === 'ku' ? 'سەردانی پێشانگای یۆنیک مۆبیلیات بکە' : lang === 'ar' ? 'تفضل بزيارة صالة عرض يونيك' : 'Visit the Unique Furniture Showroom')}
              </h2>
              <p
                style={{
                  color: 'var(--text-inverse-muted)',
                  fontSize: '0.98rem',
                  lineHeight: 1.7,
                  margin: 0
                }}
              >
                {showroomCard.text || (lang === 'ku' ? info.showroom.addressKu : lang === 'ar' ? info.showroom.addressAr : info.showroom.addressEn)}
              </p>
            </div>

            {/* Quick Metadata Pill (Hours & City) */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-md)',
                padding: '1.1rem 1.4rem',
                minWidth: '220px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AppIcon name="location" size={16} color="var(--accent-sand)" />
                <span style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 600 }}>
                  {lang === 'ku' ? info.showroom.cityKu : lang === 'ar' ? info.showroom.cityAr : info.showroom.cityEn}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AppIcon name="time" size={16} color="var(--accent-sand)" />
                <span style={{ fontSize: '0.84rem', color: 'var(--text-inverse-muted)' }}>
                  {lang === 'ku' ? info.showroom.hoursKu : lang === 'ar' ? info.showroom.hoursAr : info.showroom.hoursEn}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AppIcon name="call" size={16} color="var(--accent-sand)" />
                <span style={{ fontSize: '0.84rem', color: 'var(--text-inverse-muted)', direction: 'ltr' }}>
                  {info.phoneDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Showroom Actions Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '1.5rem'
            }}
          >
            <button
              type="button"
              onClick={handleWhatsApp}
              className="btn"
              style={{
                backgroundColor: 'var(--whatsapp-green)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.4rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'background-color var(--duration-fast) var(--ease-out-smooth)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--whatsapp-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--whatsapp-green)'; }}
            >
              <AppIcon name="share" size={16} />
              <span>{showroomCard.actionWhatsApp || t.nav.whatsApp}</span>
            </button>

            <button
              type="button"
              onClick={handleCall}
              className="btn"
              style={{
                backgroundColor: '#ffffff',
                color: '#18181b',
                border: 'none',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.4rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'opacity var(--duration-fast) var(--ease-out-smooth)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.92'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <AppIcon name="call" size={16} />
              <span>{showroomCard.actionCall || t.showroom.callUs}</span>
            </button>

            <button
              type="button"
              onClick={handleDirections}
              className="btn"
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.4rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'border-color var(--duration-fast) var(--ease-out-smooth), background-color var(--duration-fast) var(--ease-out-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <AppIcon name="location" size={16} />
              <span>{showroomCard.actionDirections || t.showroom.getDirections}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
