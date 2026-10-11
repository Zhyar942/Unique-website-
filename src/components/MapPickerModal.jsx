import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCatalog } from '../context/CatalogContext';
import { AppIcon } from './ui/Icon';
import { GoogleMapsIcon } from './Icons';
import { isAppleDevice } from '../utils/mapUtils';

export default function MapPickerModal({ isOpen, onClose }) {
  const { lang, isRtl } = useLanguage();
  const { businessInfo } = useCatalog();
  const [isApple, setIsApple] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsApple(isAppleDevice());
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const showroom = businessInfo?.showroom || {};
  const googleMapsUrl = showroom.googleMapsUrl || 'https://maps.app.goo.gl/TXuuREBi743xUPQh9';
  const appleMapsUrl = showroom.appleMapsUrl || 'https://maps.apple.com/place?address=410-16,%20Iraq&coordinate=35.556753,45.405941&name=Unique%20Furniture&place-id=IE568D5D32F27F630&map=h';

  const address = lang === 'ku' ? showroom.addressKu : lang === 'ar' ? showroom.addressAr : showroom.addressEn;

  const copyAddress = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      }
    } catch {
      // Fallback
    }
  };

  const labels = {
    ku: {
      title: 'شوێنی پێشانگا لەسەر نەخشە',
      subtitle: 'هەڵبژاردنی ئەپڵیکەیشنی نەخشە بۆ گەیشتن بە یۆنیک مۆبیلیات',
      googleTitle: 'Google Maps',
      googleDesc: 'کردنەوە لە نەخشەی گووگڵ',
      appleTitle: 'Apple Maps',
      appleDesc: 'کردنەوە لە نەخشەی ئەپڵ',
      recommendedApple: 'پێشنیارکراو بۆ ئایفۆن و ماک',
      recommendedGoogle: 'پێشنیارکراو بۆ ئەم ئامێرە',
      copyAddress: 'لەبەرگرتنەوەی ناونیشان',
      copied: 'ناونیشان لەبەرگیرایەوە ✓',
      close: 'داخستن'
    },
    ar: {
      title: 'موقع صالة العرض على الخريطة',
      subtitle: 'اختر تطبيق الخرائط المفضل للوصول إلى معرض يونيك',
      googleTitle: 'Google Maps',
      googleDesc: 'فتح في خرائط جوجل',
      appleTitle: 'Apple Maps',
      appleDesc: 'فتح في خرائط آبل',
      recommendedApple: 'موصى به لأجهزة آبل',
      recommendedGoogle: 'موصى به لجهازك الحالي',
      copyAddress: 'نسخ العنوان',
      copied: 'تم نسخ العنوان ✓',
      close: 'إغلاق'
    },
    en: {
      title: 'Showroom Location on Map',
      subtitle: 'Choose your preferred navigation app to visit Unique Furniture',
      googleTitle: 'Google Maps',
      googleDesc: 'Open with Google Maps app or browser',
      appleTitle: 'Apple Maps',
      appleDesc: 'Open natively in Apple Maps',
      recommendedApple: 'Recommended for Apple Devices',
      recommendedGoogle: 'Recommended for Android & PC',
      copyAddress: 'Copy Address',
      copied: 'Address Copied ✓',
      close: 'Close'
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <div
      className="map-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-modal-title"
    >
      <div
        className="map-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="map-modal-header">
          <div className="map-modal-header-text">
            <span className="map-modal-eyebrow">
              <AppIcon name="location" size={13} />
              {showroom.cityKu || 'Sulaymaniyah'} · 60M STREET
            </span>
            <h3 id="map-modal-title" className="map-modal-title">{t.title}</h3>
            <p className="map-modal-subtitle">{t.subtitle}</p>
          </div>
          <button
            type="button"
            className="map-modal-close"
            onClick={onClose}
            aria-label={t.close}
          >
            <AppIcon name="close" size={18} />
          </button>
        </div>

        {/* Address Pill */}
        <div className="map-modal-address-bar">
          <p className="map-modal-address-text">{address}</p>
          <button
            type="button"
            className={`map-copy-address-btn ${copied ? 'is-copied' : ''}`}
            onClick={copyAddress}
          >
            {copied ? t.copied : t.copyAddress}
          </button>
        </div>

        {/* Action Choice Grid */}
        <div className="map-options-grid">
          {/* Google Maps Option */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`map-option-card ${!isApple ? 'is-recommended' : ''}`}
            onClick={onClose}
          >
            <div className="map-option-icon google-map-icon">
              <GoogleMapsIcon size={26} color="#ffffff" />
            </div>
            <div className="map-option-info">
              <div className="map-option-headline">
                <strong>{t.googleTitle}</strong>
                {!isApple && <span className="map-recommended-pill">{t.recommendedGoogle}</span>}
              </div>
              <span>{t.googleDesc}</span>
            </div>
            <div className="map-option-arrow">
              <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={16} />
            </div>
          </a>

          {/* Apple Maps Option */}
          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`map-option-card ${isApple ? 'is-recommended' : ''}`}
            onClick={onClose}
          >
            <div className="map-option-icon apple-map-icon">
              <svg width="22" height="22" viewBox="0 0 170 170" fill="currentColor" aria-hidden="true">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.8-12.01-14.3-5.23-7.85-9.39-16.71-12.49-26.58C9.86 108.95 8.3 98.78 8.3 88.42c0-14.37 3.73-26.68 11.19-36.93 7.46-10.25 17.06-15.54 28.8-15.86 4.9.11 10.37 1.34 16.41 3.7 6.04 2.36 10.02 3.59 11.95 3.69 1.63 0 5.76-1.28 12.38-3.85 6.63-2.57 12.35-3.75 17.17-3.53 13.43.98 23.95 5.71 31.57 14.19-11.95 7.28-17.81 17.17-17.58 29.68.22 9.8 4.07 17.99 11.56 24.57 7.49 6.58 16.35 10.29 26.58 11.13-2.07 6.3-4.73 12.77-7.96 19.42zM119.22 33.15c0-6.9 2.5-13.43 7.5-19.59C131.72 7.4 138.03 2.76 145.65 0c.87 7.39-1.36 14.38-6.68 20.98-5.33 6.6-11.9 10.79-19.75 12.17z" />
              </svg>
            </div>
            <div className="map-option-info">
              <div className="map-option-headline">
                <strong>{t.appleTitle}</strong>
                {isApple && <span className="map-recommended-pill">{t.recommendedApple}</span>}
              </div>
              <span>{t.appleDesc}</span>
            </div>
            <div className="map-option-arrow">
              <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={16} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
