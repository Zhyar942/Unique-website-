import React from 'react';
import { InstagramIcon, WhatsAppIcon } from './Icons';
import { AppIcon } from './ui/Icon';
import { useLanguage } from '../context/LanguageContext';
import { Link } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import { useMapModal } from '../context/MapModalContext';
import { businessInfo, getGeneralWhatsAppUrl } from '../config/businessInfo';
import { homeCopy } from '../data/homeCopy';

export default function Footer() {
  const { lang, setLang, t, isRtl } = useLanguage();
  const { settings } = useCatalog();
  const { openMapModal } = useMapModal();
  const info = settings || businessInfo;
  const copy = homeCopy[lang] || homeCopy.en;
  const footerCopy = copy.footer || homeCopy.en.footer;
  const currentYear = new Date().getFullYear();

  const arrowIcon = isRtl ? 'arrow-left' : 'arrow-right';
  const showroomAddress = info.showroom[lang === 'ku' ? 'addressKu' : lang === 'ar' ? 'addressAr' : 'addressEn'];

  return (
    <footer className="site-footer" aria-label="Site Footer">
      {/* Top Architectural Heritage Ticker / Marquee Band */}
      <div className="footer-heritage-bar">
        <div className="container footer-heritage-inner">
          <div className="footer-heritage-tag">
            <span className="heritage-badge-pill">SINCE 1978</span>
            <span className="heritage-motto">
              {lang === 'ku'
                ? '٤٨ ساڵ پێشەنگی و متمانە لە سلێمانی · مۆبیلیاتی شاهانەی ماڵ و ئۆفیس'
                : lang === 'ar'
                ? '٤٨ عاماً من التميز والريادة في السليمانية · أثاث راقٍ للمنازل والمكاتب'
                : '48 Years of Craftsmanship in Sulaymaniyah · Bespoke Home & Office Furniture'}
            </span>
          </div>
          <button
            type="button"
            onClick={openMapModal}
            className="footer-heritage-map-link"
            title={lang === 'ku' ? 'نەخشەی پێشانگا' : lang === 'ar' ? 'موقعنا على الخريطة' : 'Showroom on Map'}
          >
            <AppIcon name="location" size={14} />
            <span>{lang === 'ku' ? 'نەخشەی پێشانگا' : lang === 'ar' ? 'موقعنا على الخريطة' : 'Showroom on Map'}</span>
            <AppIcon name={arrowIcon} size={13} />
          </button>
        </div>
      </div>

      {/* Main 4-Column Luxury Architecture */}
      <div className="container footer-main">
        {/* Column 1: Brand & Heritage Authority */}
        <div className="footer-col footer-col-brand">
          <Link href="/" className="footer-brand-link" aria-label={t.brandName}>
            <img
              src="/brand/unique-logo.svg"
              alt={t.brandName}
              width="158"
              height="48"
              className="footer-brand-logo"
            />
          </Link>
          <p className="footer-brand-desc">{footerCopy.aboutText}</p>
          <div className="footer-heritage-stamp">
            <span className="stamp-icon">✦</span>
            <span className="stamp-text">{footerCopy.sinceBadge}</span>
          </div>
        </div>

        {/* Column 2: Curated Collections Navigation */}
        <div className="footer-col">
          <h4 className="footer-col-title">{footerCopy.colCollections}</h4>
          <ul className="footer-links-list">
            <li>
              <Link href="/products">
                {t.nav.products || 'Products'}
              </Link>
            </li>
            <li>
              <Link href="/products?collection=Details">
                {t.catalogFilter?.collections?.Details || 'Details Collection'}
              </Link>
            </li>
            <li>
              <Link href="/products?collection=Urban">
                {t.catalogFilter?.collections?.Urban || 'Urban Collection'}
              </Link>
            </li>
            <li>
              <Link href="/products?collection=Nature">
                {t.catalogFilter?.collections?.Nature || 'Nature Collection'}
              </Link>
            </li>
            <li>
              <Link href="/products?product=Furniture">
                {t.catalogFilter?.productTypes?.Furniture || 'Furniture'}
              </Link>
            </li>
            <li>
              <Link href="/products?sort=newest" className="footer-link-highlight">
                <span>{copy.new}</span>
                <span className="footer-new-dot"></span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Company & Experience */}
        <div className="footer-col">
          <h4 className="footer-col-title">{footerCopy.colCompany}</h4>
          <ul className="footer-links-list">
            <li>
              <Link href="/about">
                {t.nav.about}
              </Link>
            </li>
            <li>
              <Link href="/contact">
                {t.nav.showroom}
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={openMapModal}
                className="footer-link-action-btn"
              >
                {copy.directions}
              </button>
            </li>
            <li>
              <a
                href={getGeneralWhatsAppUrl(lang, info.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.question}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Direct Inquiries & Showroom Visit */}
        <div className="footer-col footer-col-contact">
          <h4 className="footer-col-title">{footerCopy.colContact}</h4>
          <div className="footer-contact-actions">
            {/* Phone Button */}
            <a
              href={`tel:${info.phoneTechnical}`}
              className="footer-action-card"
            >
              <div className="action-card-icon">
                <AppIcon name="call" size={17} />
              </div>
              <div className="action-card-info" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                <span className="action-card-label">
                  {lang === 'ku' ? 'پەیوەندی ڕاستەوخۆ' : lang === 'ar' ? 'اتصال مباشر' : 'Direct Call'}
                </span>
                <strong className="action-card-val" style={{ direction: 'ltr', textAlign: isRtl ? 'right' : 'left' }}>{info.phoneDisplay}</strong>
              </div>
            </a>

            {/* WhatsApp Button */}
            <a
              href={getGeneralWhatsAppUrl(lang, info.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-action-card footer-wa-card"
            >
              <div className="action-card-icon wa-icon">
                <WhatsAppIcon size={18} />
              </div>
              <div className="action-card-info" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                <span className="action-card-label">WhatsApp</span>
                <strong className="action-card-val" style={{ direction: 'ltr', textAlign: isRtl ? 'right' : 'left' }}>{info.whatsappDisplay}</strong>
              </div>
            </a>

            {/* Instagram Link */}
            <a
              href={info.instagram?.url || businessInfo.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-action-card footer-ig-card"
            >
              <div className="action-card-icon ig-icon">
                <InstagramIcon size={17} />
              </div>
              <div className="action-card-info" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                <span className="action-card-label">Instagram</span>
                <strong className="action-card-val" style={{ direction: 'ltr', textAlign: isRtl ? 'right' : 'left' }}>{businessInfo.instagram.handle}</strong>
              </div>
            </a>
          </div>

          {/* Showroom Opening Hours & Quick Address */}
          <div className="footer-showroom-meta">
            <div className="showroom-meta-item">
              <AppIcon name="time" size={14} />
              <span>{footerCopy.showroomHours}</span>
            </div>
            <div className="showroom-meta-item">
              <AppIcon name="location" size={14} />
              <span>{showroomAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Segmented Language Switcher */}
      <div className="footer-bottom-wrap">
        <div className="container footer-bottom">
          <div className="footer-bottom-copy">
            <small>© 1978 – {currentYear} Unique Furniture. {footerCopy.allRights}</small>
            <span className="footer-sep">·</span>
            <small className="footer-city-label">{footerCopy.city}</small>
          </div>

          {/* Elegant Segmented Pill Language Switcher */}
          <div className="footer-languages" role="group" aria-label="Language selection">
            {[
              { code: 'ku', label: 'کوردی' },
              { code: 'ar', label: 'العربية' },
              { code: 'en', label: 'English' }
            ].map((option) => (
              <button
                key={option.code}
                type="button"
                className={`footer-lang-btn ${lang === option.code ? 'is-active' : ''}`}
                aria-pressed={lang === option.code}
                onClick={() => setLang(option.code)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
