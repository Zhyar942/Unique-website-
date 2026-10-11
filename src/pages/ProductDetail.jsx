import React, { useState, useRef, useEffect } from 'react';
import { AppIcon } from '../components/ui/Icon';
import { InstagramIcon, WhatsAppIcon } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';
import { Link } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import { getProductBySlug, products as fallbackProducts } from '../data/products';
import { businessInfo, getWhatsAppInquiryUrl } from '../config/businessInfo';
import ProductCard from '../components/ProductCard';
import useScrollReveal from '../hooks/useScrollReveal';

const ProductDetail = ({ slug }) => {
  const { lang, t, isRtl } = useLanguage();
  const { products: catalogProducts, settings } = useCatalog();
  const info = settings || businessInfo;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const touchStartX = useRef(null);
  const revealRef = useScrollReveal(slug);

  const allProducts = catalogProducts && catalogProducts.length > 0 ? catalogProducts : fallbackProducts;
  const product = allProducts.find((p) => p.slug === slug || String(p.id) === slug) || getProductBySlug(slug) || allProducts[0];

  const title = product.title?.[lang] || product.title?.ku || '';
  const category = product.category?.[lang] || product.category?.ku || '';
  const shortDesc = product.shortDesc?.[lang] || product.shortDesc?.ku || '';
  const fullDesc = product.fullDesc?.[lang] || product.fullDesc?.ku || '';
  const images = product.images && product.images.length > 0 ? product.images : ['/product_placeholder.jpg'];
  const specs = product.specs || {};

  const relatedProducts = allProducts
    .filter((p) => p.type === product.type && p.id !== product.id && p.published !== false)
    .slice(0, 4);

  const handleWhatsApp = () => {
    const url = getWhatsAppInquiryUrl(title, product.code, lang, info.whatsappNumber);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInstagram = () => {
    window.open(info.instagram?.url || businessInfo.instagram.url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Unique Furniture`,
          url: window.location.href,
        });
      } catch {
        // user cancelled or share dismissed
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert(lang === 'ku' ? 'لینکی بەرهەم کۆپیکرا' : lang === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard');
    }
  };

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  // Keyboard navigation for image gallery
  useEffect(() => {
    if (images.length <= 1) return;
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  // Touch Swipe Handlers for Gallery
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe left
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
      } else {
        // Swipe right
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      ref={revealRef}
      className="product-detail-page"
      style={{
        padding: 'clamp(1.5rem, 4vw, 3.5rem) 0 clamp(4rem, 6vw, 6rem) 0',
        backgroundColor: 'var(--bg-primary)',
        paddingBottom: 'calc(5.5rem + var(--safe-bottom))'
      }}
    >
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '0.84rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap'
          }}
        >
          <Link
            href="/"
            style={{ cursor: 'pointer', transition: 'color 0.2s' }}
          >
            {t.nav.home}
          </Link>
          <span>/</span>
          <Link
            href={`/${product.type}-furniture`}
            style={{ cursor: 'pointer', transition: 'color 0.2s' }}
          >
            {product.type === 'office' ? t.nav.officeFurniture : t.nav.homeFurniture}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{title}</span>
        </div>

        {/* Product Showcase Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(1.75rem, 4vw, 3.5rem)',
            alignItems: 'start',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
          }}
        >
          {/* Gallery View */}
          <div>
            {/* Primary Large Image Container with Swipe */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-secondary)',
                marginBottom: '0.75rem',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                touchAction: 'pan-y'
              }}
            >
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'opacity 0.2s ease'
                }}
              />

              {/* Previous / Next (< and >) Image Navigation Controls */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label={lang === 'ku' ? 'وێنەی پێشوو' : lang === 'ar' ? 'الصورة السابقة' : 'Previous image'}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '12px',
                      transform: 'translateY(-50%)',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.88)',
                      color: 'var(--text-primary)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 4,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      transition: 'transform var(--duration-fast) var(--ease-out-smooth), background-color var(--duration-fast) var(--ease-out-smooth), box-shadow var(--duration-fast) var(--ease-out-smooth)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.88)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.14)';
                    }}
                  >
                    <AppIcon name="chevron-left" size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label={lang === 'ku' ? 'وێنەی داهاتوو' : lang === 'ar' ? 'الصورة التالية' : 'Next image'}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '12px',
                      transform: 'translateY(-50%)',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.88)',
                      color: 'var(--text-primary)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 4,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      transition: 'transform var(--duration-fast) var(--ease-out-smooth), background-color var(--duration-fast) var(--ease-out-smooth), box-shadow var(--duration-fast) var(--ease-out-smooth)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.88)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.14)';
                    }}
                  >
                    <AppIcon name="chevron-right" size={20} />
                  </button>
                </>
              )}

              {/* Gallery Image Counter Badge */}
              {images.length > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: isRtl ? 'auto' : '12px',
                    left: isRtl ? '12px' : 'auto',
                    backgroundColor: 'rgba(24, 24, 27, 0.75)',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)',
                    letterSpacing: '0.04em'
                  }}
                >
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Selection Strip */}
            {images.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.6rem',
                  overflowX: 'auto',
                  paddingBottom: '0.5rem',
                  scrollbarWidth: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: 'clamp(54px, 15vw, 72px)',
                      height: 'clamp(54px, 15vw, 72px)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedImageIndex === idx ? '2px solid var(--brand-orange)' : '1px solid var(--border-subtle)',
                      boxShadow: selectedImageIndex === idx ? 'var(--shadow-raised-sm)' : 'none',
                      opacity: selectedImageIndex === idx ? 1 : 0.65,
                      transition: 'border-color var(--duration-hover) ease, opacity var(--duration-hover) ease, transform var(--duration-press) var(--ease-natural)',
                      flexShrink: 0,
                      cursor: 'pointer',
                      padding: 0,
                      backgroundColor: 'transparent'
                    }}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Editorial & Showroom Inquiry */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Category & Share Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--accent-earth)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {category}
              </span>

              <button
                onClick={handleShare}
                aria-label="Share"
                className="btn btn-secondary"
                style={{
                  minHeight: '34px',
                  padding: '4px 10px',
                  fontSize: '0.8rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <AppIcon name="share" size={14} />
                <span>Share</span>
              </button>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.65rem, 3.2vw, 2.5rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '0.6rem',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>

            {product.code && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                <span>{t.productDetail.code} </span>
                <strong style={{ color: 'var(--text-primary)' }}>{product.code}</strong>
              </div>
            )}

            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {fullDesc || shortDesc}
            </p>

            {/* Finish Swatches */}
            {product.swatches && product.swatches.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                  {t.productCard.swatches}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {product.swatches.map((swatch, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      <span className="swatch-dot" style={{ backgroundColor: swatch.color }} />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {swatch.name?.[lang] || ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                padding: 'clamp(1.25rem, 3vw, 1.5rem)',
                border: '1px solid var(--border-light)',
                marginBottom: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {t.productDetail.specsTitle}
              </h4>
              {specs.dimensions && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t.productDetail.dimensions}</span>
                  <strong style={{ color: 'var(--text-primary)', direction: 'ltr' }}>{specs.dimensions}</strong>
                </div>
              )}
              {specs.materials && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t.productDetail.materials}</span>
                  <strong style={{ color: 'var(--text-primary)', textAlign: isRtl ? 'left' : 'right' }}>
                    {specs.materials[lang] || specs.materials.ku}
                  </strong>
                </div>
              )}
              {specs.warranty && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t.productDetail.warranty}</span>
                  <strong style={{ color: 'var(--accent-earth)' }}>
                    {specs.warranty[lang] || specs.warranty.ku}
                  </strong>
                </div>
              )}
            </div>

            {/* Primary Action Buttons (Desktop & Tablet) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <button
                onClick={handleWhatsApp}
                className="btn btn-product-whatsapp"
                style={{
                  minHeight: '48px',
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  width: '100%',
                }}
              >
                <WhatsAppIcon size={20} color="#25d366" />
                <span>{t.productDetail.askWhatsAppButton}</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  onClick={handleInstagram}
                  className="btn btn-product-instagram"
                  style={{ minHeight: '44px', fontSize: '0.86rem' }}
                >
                  <InstagramIcon size={17} color="#e1306c" />
                  <span>{t.productDetail.instagramButton}</span>
                </button>

                <a
                  href={`tel:${info.phoneTechnical}`}
                  className="btn btn-product-call"
                  style={{ minHeight: '44px', fontSize: '0.86rem' }}
                >
                  <AppIcon name="call" size={17} color="#ab480b" />
                  <span>{t.productDetail.callButton}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Furniture */}
        {relatedProducts.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 800, marginBottom: '1.75rem' }}>
              {t.productDetail.relatedTitle}
            </h2>
            <div className="furniture-grid">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Product Action Bar */}
      <div
        className="product-sticky-bar"
        style={{
          display: undefined // Controlled via CSS media query .product-sticky-bar
        }}
      >
        <a
          href={`tel:${info.phoneTechnical}`}
          className="btn btn-product-call"
          style={{
            width: '48px',
            height: '48px',
            minHeight: '48px',
            padding: 0,
            flexShrink: 0,
            borderRadius: 'var(--radius-sm)'
          }}
          aria-label="Call Unique Furniture"

        >
          <AppIcon name="call" size={18} color="#ab480b" />
        </a>

        <button
          onClick={handleWhatsApp}
          className="btn btn-product-whatsapp"
          style={{
            flex: 1,
            minHeight: '48px',
            fontSize: '0.92rem',
            gap: '0.5rem',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <WhatsAppIcon size={18} color="#25d366" />
          <span>{t.productDetail.askWhatsAppButton}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
