import React, { useState, useRef } from 'react';
import { AppIcon } from './ui/Icon';
import { WhatsAppIcon, InstagramIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { businessInfo, getWhatsAppInquiryUrl } from '../config/businessInfo';

import { useDialog } from '../hooks/useDialog';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { lang, t, isRtl } = useLanguage();
  const { navigate } = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const dialogRef = useRef(null);
  useDialog(isOpen, onClose, dialogRef);

  if (!isOpen || !product) return null;

  const title = product.title?.[lang] || product.title?.ku || '';
  const category = product.category?.[lang] || product.category?.ku || '';
  const shortDesc = product.shortDesc?.[lang] || product.shortDesc?.ku || '';
  const images = product.images && product.images.length > 0 ? product.images : ['/product_placeholder.jpg'];
  const specs = product.specs || {};

  const handleWhatsAppInquiry = () => {
    const url = getWhatsAppInquiryUrl(title, product.code, lang);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInstagramInquiry = () => {
    window.open(businessInfo.instagram.url, '_blank', 'noopener,noreferrer');
  };

  const handleViewFullDetails = () => {
    onClose();
    if (product.slug) {
      navigate(`/product/${product.slug}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="quick-view-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="quick-view-controls">
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            marginInlineStart: 'auto',
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            border: '1px solid var(--border-light)',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
        >
          <AppIcon name="close" size={18} />
        </button>
        </div>

        <div className="quick-view-grid">
          {/* Gallery View */}
          <div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-secondary)',
                marginBottom: '1rem',
              }}
            >
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Previous / Next (< and >) Image Navigation Controls */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
                    }}
                    aria-label={lang === 'ku' ? 'وێنەی پێشوو' : lang === 'ar' ? 'الصورة السابقة' : 'Previous image'}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '10px',
                      transform: 'translateY(-50%)',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.88)',
                      color: 'var(--text-primary)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 3,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      transition: 'transform var(--duration-fast) var(--ease-out-smooth), background-color var(--duration-fast) var(--ease-out-smooth), box-shadow var(--duration-fast) var(--ease-out-smooth)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.88)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    <AppIcon name="chevron-left" size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) => (prev + 1) % images.length);
                    }}
                    aria-label={lang === 'ku' ? 'وێنەی داهاتوو' : lang === 'ar' ? 'الصورة التالية' : 'Next image'}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '10px',
                      transform: 'translateY(-50%)',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.88)',
                      color: 'var(--text-primary)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 3,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      transition: 'transform var(--duration-fast) var(--ease-out-smooth), background-color var(--duration-fast) var(--ease-out-smooth), box-shadow var(--duration-fast) var(--ease-out-smooth)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.88)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    <AppIcon name="chevron-right" size={18} />
                  </button>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: isRtl ? 'auto' : '10px',
                      left: isRtl ? '10px' : 'auto',
                      backgroundColor: 'rgba(24, 24, 27, 0.75)',
                      color: '#ffffff',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      backdropFilter: 'blur(4px)',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    aria-label={`${title} — ${idx + 1}`}
                    aria-pressed={selectedImageIndex === idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedImageIndex === idx ? '2px solid var(--text-primary)' : '1px solid var(--border-light)',
                      opacity: selectedImageIndex === idx ? 1 : 0.65,
                      transition: 'opacity 0.18s ease, border-color 0.18s ease, transform var(--duration-press) var(--ease-natural)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Direct Actions */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--accent-earth)',
                textTransform: 'uppercase',
                marginBottom: '0.4rem',
              }}
            >
              {category}
            </span>

            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
                lineHeight: 1.3,
              }}
            >
              {title}
            </h2>

            {product.code && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t.productDetail.code} <strong style={{ color: 'var(--text-primary)' }}>{product.code}</strong>
              </span>
            )}

            <p style={{ fontSize: '0.94rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {shortDesc}
            </p>

            {/* Specifications Summary */}
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                fontSize: '0.86rem',
              }}
            >
              {specs.dimensions && (
                <div className="quick-view-spec">
                  <span style={{ color: 'var(--text-muted)' }}>{t.productDetail.dimensions}</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{specs.dimensions}</strong>
                </div>
              )}
              {specs.materials && (
                <div className="quick-view-spec">
                  <span style={{ color: 'var(--text-muted)' }}>{t.productDetail.materials}</span>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {specs.materials[lang] || specs.materials.ku}
                  </strong>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
              <button
                onClick={handleWhatsAppInquiry}
                className="btn btn-product-whatsapp"
                style={{ width: '100%', minHeight: '48px', fontSize: '0.95rem' }}
              >
                <WhatsAppIcon size={20} color="#25d366" />
                <span>{t.productDetail.askWhatsAppButton}</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  onClick={handleInstagramInquiry}
                  className="btn btn-product-instagram"
                  style={{ minHeight: '44px', fontSize: '0.88rem' }}
                >
                  <InstagramIcon size={18} color="#e1306c" />
                  <span>Instagram</span>
                </button>

                <button
                  onClick={handleViewFullDetails}
                  className="btn btn-product-call"
                  style={{ minHeight: '44px', fontSize: '0.88rem' }}
                >
                  <span>{t.productCard.viewDetails}</span>
                  <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={14} color="#ab480b" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
