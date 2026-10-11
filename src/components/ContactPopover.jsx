import React, { useEffect } from 'react';
import { AppIcon } from './ui/Icon';
import { InstagramIcon, WhatsAppIcon, GoogleMapsIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { useCatalog } from '../context/CatalogContext';
import { businessInfo, getGeneralWhatsAppUrl } from '../config/businessInfo';

const ContactPopover = ({ isOpen, onClose }) => {
  const { lang, t, isRtl } = useLanguage();
  const { settings } = useCatalog();
  const info = settings || businessInfo;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = t.contactSheet || {
    title: 'Contact Unique Furniture',
    subtitle: '60m Street, Sulaymaniyah — At your service',
    phoneTitle: 'Direct Phone Call',
    phoneDesc: '0772 975 4844 — Direct line to showroom',
    whatsAppTitle: 'WhatsApp Inquiry',
    whatsAppDesc: 'Fast direct chat for model availability and viewing',
    instagramTitle: 'Official Instagram',
    instagramDesc: '@unique.furniture.iq — Explore stories, video tours & new arrivals',
    showroomTitle: 'Visit Showroom',
    showroomDesc: '60m Street, Rzgari Taza - Opposite New Chwarchra, Sulaymaniyah',
    viewLocation: 'Open in Google Maps',
    close: 'Close'
  };

  const actions = [
    {
      id: 'whatsapp',
      title: content.whatsAppTitle,
      subtitle: content.whatsAppDesc,
      value: info.whatsappDisplay || businessInfo.whatsappDisplay,
      href: getGeneralWhatsAppUrl(lang, info.whatsappNumber),
      icon: <WhatsAppIcon size={20} color="#25d366" />,
      highlight: true,
      tag: lang === 'ku' ? 'خێراترین وەڵام' : lang === 'ar' ? 'رد سريع' : 'Direct Chat'
    },
    {
      id: 'phone',
      title: content.phoneTitle,
      subtitle: content.phoneDesc,
      value: info.phoneDisplay || businessInfo.phoneDisplay,
      href: `tel:${info.phoneTechnical || businessInfo.phoneTechnical}`,
      icon: <AppIcon name="call" size={20} color="var(--brand-orange)" />,
      highlight: false
    },
    {
      id: 'instagram',
      title: content.instagramTitle,
      subtitle: content.instagramDesc,
      value: info.instagram?.handle || businessInfo.instagram.handle,
      href: info.instagram?.url || businessInfo.instagram.url,
      icon: <InstagramIcon size={20} color="#e1306c" />,
      highlight: false
    },
    {
      id: 'showroom',
      title: content.showroomTitle,
      subtitle: lang === 'ku' ? info.showroom.addressKu : lang === 'ar' ? info.showroom.addressAr : info.showroom.addressEn,
      value: content.viewLocation,
      href: info.showroom.googleMapsUrl || businessInfo.showroom.googleMapsUrl,
      icon: <GoogleMapsIcon size={20} color="var(--accent-earth)" />,
      highlight: false
    }
  ];


  return (
    <div
      className="contact-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-popover-title"
    >
      <div
        className="contact-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem 1rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--brand-orange)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.25rem'
              }}
            >
              UNIQUE FURNITURE
            </span>
            <h3
              id="contact-popover-title"
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0
              }}
            >
              {content.title}
            </h3>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginTop: '0.25rem',
                marginBottom: 0
              }}
            >
              {content.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label={content.close}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-primary)',
              transition: 'background-color 0.15s ease, color 0.15s ease, transform var(--duration-press) var(--ease-natural)'
            }}
          >
            <AppIcon name="close" size={18} />
          </button>
        </div>

        {/* Action Items List */}
        <div
          style={{
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          {actions.map((act) => (
            <a
              key={act.id}
              href={act.href}
              target={act.id === 'phone' ? undefined : '_blank'}
              rel={act.id === 'phone' ? undefined : 'noopener noreferrer'}
              className={`contact-action-row ${act.highlight ? 'is-highlight' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                backgroundColor: act.highlight ? 'rgba(37, 211, 102, 0.05)' : 'var(--bg-primary)',
                border: act.highlight ? '1px solid rgba(37, 211, 102, 0.25)' : '1px solid var(--border-light)',
                transition: 'background-color 0.15s ease, border-color 0.15s ease, transform 0.18s var(--ease-out-expo)'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {act.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {act.title}
                  </span>
                  {act.tag && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(37, 211, 102, 0.12)',
                        color: '#15803d'
                      }}
                    >
                      {act.tag}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {act.subtitle}
                </div>
              </div>

              <div
                style={{
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0
                }}
              >
                <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={16} />
              </div>
            </a>
          ))}
        </div>

        {/* Footer info note with safe-area padding */}
        <div
          style={{
            padding: '0.85rem 1.75rem calc(1rem + var(--safe-bottom))',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-light)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <span>{lang === 'ku' ? 'سلێمانی · شەقامی (60 مەتری) ڕزگاری تازە' : lang === 'ar' ? 'السليمانية · شارع (60 متري) رزكاري تازة' : 'Sulaymaniyah · 60m Street (Rzgari Taza)'}</span>
          <span>{lang === 'ku' ? 'کات: ٩:٠٠ بەیانی — ٩:٠٠ شەو' : lang === 'ar' ? '٩:٠٠ ص — ٩:٠٠ م' : '9:00 AM — 9:00 PM'}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactPopover;
