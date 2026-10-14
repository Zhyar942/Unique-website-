import React, { useState, useEffect } from 'react';
import { AppIcon } from '../components/ui/Icon';
import { InstagramIcon, WhatsAppIcon, GoogleMapsIcon } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import { useMapModal } from '../context/MapModalContext';
import { businessInfo, getGeneralWhatsAppUrl } from '../config/businessInfo';
import useScrollReveal from '../hooks/useScrollReveal';

const ContactShowroom = () => {
  const { lang, t, isRtl } = useLanguage();
  const { navigate } = useRouter();
  const { settings } = useCatalog();
  const { openMapModal } = useMapModal();
  const info = settings || businessInfo;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const revealRef = useScrollReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    // Direct WhatsApp handoff with pre-filled message
    const msg = lang === 'ku'
      ? `سڵاو یۆنیک مۆبیلیات،\nناوی کڕیار: ${formData.name}\nتەلەفۆن: ${formData.phone}\nپەیام: ${formData.message}`
      : `Hello Unique Furniture,\nCustomer Name: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`;

    const waNum = info.whatsappNumber || businessInfo.whatsappNumber;
    const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setFormSubmitted(true);
  };


  return (
    <div ref={revealRef} className="contact-page" style={{ padding: '3.5rem 0 6rem 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.86rem' }}>
          <span
            onClick={() => navigate('/')}
            style={{ color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            {t.nav.home}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 'normal' }}>{t.nav.showroom}</span>
        </div>

        {/* Page Title — Clean typography, no decorative badge chip */}
        <div data-reveal style={{ maxWidth: '640px', marginBottom: '3.5rem' }}>
          <span
            style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 'normal',
              color: 'var(--brand-orange)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            {lang === 'ku' ? 'سلێمانی · پێشانگای فەرمی' : lang === 'ar' ? 'السليمانية · صالة العرض الرئيسية' : 'Sulaymaniyah Flagship Showroom'}
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 'normal', marginBottom: '1rem' }}>
            {t.showroom.title}
          </h1>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
            {t.showroom.subtitle}
          </p>
        </div>

        {/* Main Grid: Showroom Info + Clean Contact Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(1.5rem, 3.5vw, 3rem)',
            alignItems: 'start',
            marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          {/* Left: Showroom Verified Details */}
          <div
            data-reveal
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: 'clamp(1.25rem, 3.5vw, 2.5rem)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-raised-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: 'normal', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ku' ? 'پێشانگای سەرەکی لە سلێمانی' : lang === 'ar' ? 'صالة العرض الرئيسية بالسليمانية' : 'Sulaymaniyah Flagship Gallery'}
            </h3>

            {/* Address */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-earth)',
                  flexShrink: 0,
                  border: '1px solid var(--border-light)'
                }}
              >
                <AppIcon name="location" size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                  {t.showroom.addressLabel}
                </span>
                <span style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.5, display: 'block', fontWeight: 'normal' }}>
                  {lang === 'ku' ? info.showroom.addressKu : lang === 'ar' ? info.showroom.addressAr : info.showroom.addressEn}
                </span>
              </div>
            </div>

            {/* Hours */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-earth)',
                  flexShrink: 0,
                  border: '1px solid var(--border-light)'
                }}
              >
                <AppIcon name="time" size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                  {t.showroom.hoursLabel}
                </span>
                <span style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.5, display: 'block', fontWeight: 'normal' }}>
                  {lang === 'ku' ? info.showroom.hoursKu : lang === 'ar' ? info.showroom.hoursAr : info.showroom.hoursEn}
                </span>
              </div>
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-earth)',
                  flexShrink: 0,
                  border: '1px solid var(--border-light)'
                }}
              >
                <AppIcon name="call" size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                  {t.showroom.phoneLabel}
                </span>
                <a
                  href={`tel:${info.phoneTechnical}`}
                  style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 'normal', display: 'block', direction: 'ltr', textAlign: lang === 'en' ? 'left' : 'right' }}
                >
                  {info.phoneDisplay}
                </a>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {lang === 'ku' ? 'تەلەفۆن و واتساپ' : lang === 'ar' ? 'هاتف وواتساب' : 'Phone & WhatsApp'}
                </span>
              </div>
            </div>

            {/* Curated Luxury Action Suite */}
            <div
              className="showroom-actions-suite"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '20px',
                borderTop: '1px solid var(--border-light, #f0eae1)',
                paddingTop: '20px'
              }}
            >
              {/* Primary Location / Maps Trigger */}
              <button
                type="button"
                onClick={openMapModal}
                className="luxury-action-card-btn btn-showroom-map"
              >
                <div className="action-card-main-group">
                  <div className="action-card-squircle is-map">
                    <AppIcon name="location" size={22} color="#ffffff" />
                  </div>
                  <div className="action-card-text-block">
                    <span className="action-card-kicker">
                      {lang === 'ku' ? 'گووگڵ ماپ · سلێمانی' : lang === 'ar' ? 'خرائط جوجل · السليمانية' : 'GOOGLE MAPS · LOCATION'}
                    </span>
                    <span className="action-card-title">
                      {t.showroom.getDirections}
                    </span>
                  </div>
                </div>
                <div className="action-card-trailing-arrow">
                  <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={18} />
                </div>
              </button>

              {/* Luxury WhatsApp Concierge (Exact Match to Image 2 Reference) */}
              <a
                href={getGeneralWhatsAppUrl(lang, info.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-action-card-btn btn-showroom-whatsapp"
              >
                <div className="action-card-main-group">
                  <div className="action-card-squircle is-whatsapp">
                    <WhatsAppIcon size={24} color="#ffffff" />
                  </div>
                  <div className="action-card-text-block">
                    <span className="action-card-kicker">
                      WHATSAPP
                    </span>
                    <span className="action-card-title" dir="ltr" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      {info.whatsappDisplay || '0772 975 4844'}
                    </span>
                  </div>
                </div>
                <div className="action-card-trailing-arrow">
                  <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={18} />
                </div>
              </a>

              {/* Editorial Instagram Atelier Link */}
              <a
                href={info.instagram?.url || businessInfo.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-action-card-btn btn-showroom-instagram"
              >
                <div className="action-card-main-group">
                  <div className="action-card-squircle is-instagram">
                    <InstagramIcon size={22} color="#ffffff" />
                  </div>
                  <div className="action-card-text-block">
                    <span className="action-card-kicker">
                      INSTAGRAM
                    </span>
                    <span className="action-card-title" dir="ltr" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      {info.instagram?.handle || businessInfo.instagram.handle || '@unique.furniture.iq'}
                    </span>
                  </div>
                </div>
                <div className="action-card-trailing-arrow">
                  <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={18} />
                </div>
              </a>
            </div>

          </div>

          {/* Right: Direct Inquiry Form */}
          <div
            data-reveal
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: 'clamp(1.25rem, 3.5vw, 2.5rem)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-raised-sm)',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: 'normal', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {lang === 'ku' ? 'نامەی خێرا بۆ پێشانگا' : lang === 'ar' ? 'استفسار مباشر لمعرضنا' : 'Showroom Direct Inquiry'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '2rem' }}>
              {lang === 'ku'
                ? 'پەیامەکەت بنووسە تا ڕاستەوخۆ لە ڕێگەی واتساپەوە تیمەکەمان وەڵامت بدەنەوە.'
                : lang === 'ar'
                ? 'شاركنا استفسارك لنقوم بالتواصل معك مباشرة عبر واتساب.'
                : 'Share your message and connect directly with our showroom team on WhatsApp.'}
            </p>

            {formSubmitted ? (
              <div
                style={{
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-pressed-subtle)'
                }}
              >
                <div style={{ margin: '0 auto 1rem auto' }}>
                  <AppIcon name="check" size={32} color="var(--brand-orange)" />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 'normal', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {lang === 'ku' ? 'پەیامەکەت ئامادەکرا لە واتساپ' : lang === 'ar' ? 'تم تجهيز المحادثة في واتساب' : 'Inquiry Ready on WhatsApp'}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  {lang === 'ku' ? 'تکایە پەنجە بنێ بە ناردن لەناو واتساپ تا پەیامەکەت بگاتە دەستمان.' : lang === 'ar' ? 'يرجى الضغط على إرسال داخل تطبيق واتساب.' : 'Please click send inside WhatsApp to complete your message.'}
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  {lang === 'ku' ? 'ناردنی پەیامێکی تر' : lang === 'ar' ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.86rem',
                      fontWeight: 'normal',
                      color: 'var(--text-primary)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {lang === 'ku' ? 'ناوی تەواو *' : lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={lang === 'ku' ? 'نموونە: هێمن کەرکوکی' : lang === 'ar' ? 'مثال: أحمد علي' : 'e.g. John Doe'}
                    className="neu-input"
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.86rem',
                      fontWeight: 'normal',
                      color: 'var(--text-primary)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {lang === 'ku' ? 'ژمارەی مۆبایل (واتساپ) *' : lang === 'ar' ? 'رقم الهاتف (واتساب) *' : 'Phone Number (WhatsApp) *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0770 000 0000"
                    className="neu-input"
                    style={{
                      direction: 'ltr',
                      textAlign: isRtl ? 'right' : 'left'
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.86rem',
                      fontWeight: 'normal',
                      color: 'var(--text-primary)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {lang === 'ku' ? 'پەیام یان داواکاری مۆدێل' : lang === 'ar' ? 'الرسالة أو الاستفسار' : 'Message or Model Inquiry'}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={lang === 'ku' ? 'سڵاو، دەمەوێت بپرسم لەسەر بەردەستبوونی قەنەفەی مۆدیولار...' : lang === 'ar' ? 'مرحبا، أود الاستفسار عن كنب موديولار...' : 'Hello, I would like to ask about availability of...'}
                    className="neu-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="luxury-action-card-btn btn-form-submit"
                  style={{
                    width: '100%',
                    marginTop: '14px',
                  }}
                >
                  <div className="action-card-main-group">
                    <div className="action-card-squircle is-whatsapp">
                      <WhatsAppIcon size={24} color="#ffffff" />
                    </div>
                    <div className="action-card-text-block">
                      <span className="action-card-kicker">
                        {lang === 'ku' ? 'واتساپ · ناردنی خێرا' : lang === 'ar' ? 'واتساب · إرسال فوري' : 'WHATSAPP INQUIRY'}
                      </span>
                      <span className="action-card-title">
                        {lang === 'ku'
                          ? 'ناردنی داواکاری لە ڕێگەی واتساپەوە'
                          : lang === 'ar'
                          ? 'إرسال الاستفسار عبر واتساب'
                          : 'Send Inquiry via WhatsApp'}
                      </span>
                    </div>
                  </div>
                  <div className="action-card-trailing-arrow">
                    <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={18} />
                  </div>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Showroom Interactive Map Embed */}
        <div
          style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'normal' }}>
              {lang === 'ku' ? 'نەخشەی شوێنی پێشانگا' : lang === 'ar' ? 'موقع المعرض على الخريطة' : 'Showroom Map Location'}
            </h4>
            <button
              type="button"
              onClick={openMapModal}
              style={{
                background: 'transparent',
                border: 0,
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '0.86rem',
                color: 'var(--accent-earth)',
                fontWeight: 'normal',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{t.showroom.getDirections}</span>
              <span>→</span>
            </button>
          </div>
          <iframe
            src="https://maps.google.com/maps?q=35.556753,45.405941&hl=en&z=17&output=embed"
            width="100%"
            style={{
              border: 0,
              display: 'block',
              aspectRatio: '16 / 9',
              maxHeight: '440px'
            }}
            allowFullScreen=""
            loading="lazy"
            title="Unique Furniture Showroom Location"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactShowroom;
