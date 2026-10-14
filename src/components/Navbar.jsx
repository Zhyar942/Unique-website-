import React, { useState, useEffect, useRef } from 'react';
import { AppIcon } from './ui/Icon';
import { InstagramIcon, WhatsAppIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { useRouter, Link } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import { businessInfo, getGeneralWhatsAppUrl } from '../config/businessInfo';

const Navbar = ({ onSearchClick }) => {
  const { lang, setLang, t, isRtl } = useLanguage();
  const { currentPath } = useRouter();
  const { settings } = useCatalog();
  const info = settings || businessInfo;
  const [isScrolled, setIsScrolled] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  // Detect scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  // Handle escape key to close menu/dropdowns
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setLangDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languageOptions = [
    { code: 'ku', label: 'کوردی', nativeName: 'Kurdish Sorani', shortCode: 'KU' },
    { code: 'ar', label: 'العربية', nativeName: 'Arabic', shortCode: 'AR' },
    { code: 'en', label: 'English', nativeName: 'English', shortCode: 'EN' }
  ];

  const currentLangLabel = {
    ku: 'کوردی',
    ar: 'العربية',
    en: 'English'
  }[lang] || 'کوردی';

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products || 'Products' },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.showroom }
  ];

  return (
    <>
      <header className={`header-shell ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="header-inner">
          {/* ================= ZONE 1: OFFICIAL LOGO ================= */}
          <div className="header-logo-zone">
            <Link href="/" className="header-logo-link" aria-label="Unique Furniture Home">
              <picture>
                <source srcSet="/brand/unique-logo.svg" type="image/svg+xml" />
                <source srcSet="/brand/unique-logo-web.webp" type="image/webp" />
                <img
                  src="/brand/unique-logo-web.png"
                  alt="Unique Furniture"
                  className="header-logo-img"
                  width="120"
                  height="38"
                />
              </picture>
              <picture>
                <source srcSet="/brand/unique-symbol.svg" type="image/svg+xml" />
                <source srcSet="/brand/unique-symbol-web.webp" type="image/webp" />
                <img
                  src="/brand/unique-symbol-web.png"
                  alt="Unique Furniture"
                  className="header-symbol-img"
                  width="32"
                  height="30"
                />
              </picture>
            </Link>
          </div>

          {/* ================= ZONE 2: DESKTOP NAVIGATION ================= */}
          <nav className="header-nav-zone hidden-mobile" aria-label="Primary Navigation">
            <ul className="header-nav-list">
              {navLinks.map((link) => {
                const isActive = link.href === '/'
                  ? currentPath === '/'
                  : link.href === '/products'
                    ? currentPath.startsWith('/products') || currentPath.startsWith('/home-furniture') || currentPath.startsWith('/office-furniture') || currentPath.startsWith('/product/')
                    : currentPath.startsWith(link.href);

                return (
                  <li key={link.href} className="header-nav-item">
                    <Link
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`header-nav-link ${isActive ? 'is-active' : ''}`}
                    >
                      {link.label}
                      {isActive && <span className="header-nav-indicator" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ================= ZONE 3: ACTIONS ================= */}
          <div className="header-action-zone">
            {/* Search Trigger Button */}
            <button
              onClick={onSearchClick}
              className="header-icon-btn"
              aria-label={t.nav.search}
              title={t.nav.search}
            >
              <AppIcon name="search" size={18} />
            </button>

            {/* Language Dropdown (Desktop & Mobile) */}
            <div className="header-lang-container" ref={langDropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`header-lang-trigger ${langDropdownOpen ? 'is-active' : ''}`}
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
                aria-label={lang === 'ku' ? 'زمان' : lang === 'ar' ? 'اللغة' : 'Language'}
                title={lang === 'ku' ? 'زمان / Language' : lang === 'ar' ? 'اللغة / Language' : 'Language'}
              >
                <AppIcon name="language" size={17} color="var(--brand-orange, #c86526)" />
                <span className="header-lang-current">{currentLangLabel}</span>
                <span className={`header-lang-arrow ${langDropdownOpen ? 'is-open' : ''}`}>
                  <AppIcon name="chevron-down" size={12} color="currentColor" />
                </span>
              </button>

              {langDropdownOpen && (
                <div className="header-lang-dropdown">
                  <div className="header-lang-dropdown-head">
                    <AppIcon name="language" size={14} color="var(--brand-orange, #c86526)" />
                    <span>{lang === 'ku' ? 'Language · هەڵبژاردنی زمان' : lang === 'ar' ? 'Language · اختيار اللغة' : 'Select Language'}</span>
                  </div>
                  <div className="header-lang-list">
                    {languageOptions.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => {
                          setLang(opt.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`header-lang-item ${lang === opt.code ? 'is-selected' : ''}`}
                      >
                        <div className="header-lang-item-info">
                          <div className="header-lang-item-row">
                            <span className="header-lang-code-pill">{opt.shortCode}</span>
                            <span className="header-lang-item-native">{opt.label}</span>
                          </div>
                          <span className="header-lang-item-sub">{opt.nativeName}</span>
                        </div>
                        {lang === opt.code && (
                          <AppIcon name="check" size={15} color="var(--brand-orange, #c86526)" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button (Touch Target >= 44x44px) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="header-icon-btn mobile-only-flex"
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <AppIcon name="menu" size={20} />
            </button>
          </div>
        </div>

        {/* ================= FULLSCREEN/DRAWER MOBILE NAVIGATION ================= */}
        {mobileMenuOpen && (
          <>
            <div
              className="mobile-nav-backdrop"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <aside
              className="mobile-nav-drawer"
              aria-label="Mobile Navigation"
              role="dialog"
              aria-modal="true"
            >
              {/* Drawer Top Row: Brand & Close */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-light)',
                  marginBottom: '1rem'
                }}
              >
                <img
                  src="/brand/unique-logo.svg"
                  alt="Unique Furniture"
                  style={{ height: '28px', width: 'auto', maxWidth: '135px', objectFit: 'contain' }}
                />

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{
                    width: '42px',
                    height: '42px',
                    minHeight: '42px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  aria-label="Close navigation"
                >
                  <AppIcon name="close" size={18} />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                {navLinks.map((link) => {
                  const isActive = link.href === '/'
                    ? currentPath === '/'
                    : link.href === '/products'
                      ? currentPath.startsWith('/products') || currentPath.startsWith('/home-furniture') || currentPath.startsWith('/office-furniture') || currentPath.startsWith('/product/')
                      : currentPath.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        fontSize: '1.02rem',
                        fontWeight: 400,
                        color: isActive ? 'var(--brand-orange)' : 'var(--text-primary)',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isActive ? 'var(--brand-orange-tint)' : 'transparent',
                        border: isActive ? '1px solid var(--brand-orange-border)' : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: '48px',
                        textDecoration: 'none',
                        transition: 'background-color var(--duration-hover) ease, border-color var(--duration-hover) ease'
                      }}
                    >
                      <span>{link.label}</span>
                      <AppIcon
                        name={isRtl ? 'arrow-left' : 'arrow-right'}
                        size={14}
                        color={isActive ? 'var(--brand-orange)' : 'var(--text-muted)'}
                      />
                    </Link>
                  );
                })}
              </nav>

              {/* Language Switcher Segment Control */}
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1rem',
                  marginTop: '1.25rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                  <AppIcon name="language" size={15} color="var(--brand-orange, #c86526)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    {lang === 'ku' ? 'Language · زمان' : lang === 'ar' ? 'Language · اللغة' : 'Language'}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: 'var(--bg-primary)',
                    boxShadow: 'var(--shadow-pressed-subtle)',
                    border: '1px solid var(--border-subtle)',
                    padding: '4px',
                    borderRadius: '10px',
                    gap: '4px'
                  }}
                >
                  {languageOptions.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setLang(opt.code);
                        setMobileMenuOpen(false);
                      }}
                      style={{
                        flex: 1,
                        minHeight: '38px',
                        fontSize: '0.85rem',
                        fontWeight: 400,
                        color: lang === opt.code ? 'var(--brand-orange)' : 'var(--text-secondary)',
                        backgroundColor: lang === opt.code ? '#ffffff' : 'transparent',
                        borderRadius: '8px',
                        boxShadow: lang === opt.code ? 'var(--shadow-raised-sm)' : 'none',
                        border: lang === opt.code ? '1px solid var(--border-subtle)' : 'none',
                        cursor: 'pointer',
                        transition: 'background-color var(--duration-hover) ease, color var(--duration-hover) ease, box-shadow var(--duration-hover) ease'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Touch Action Buttons */}
              <div
                style={{
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}
              >
                {/* Call Action */}
                <a
                  href={`tel:${info.phoneTechnical}`}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    minHeight: '46px',
                    justifyContent: 'center',
                    gap: '0.55rem',
                    fontSize: '0.9rem'
                  }}
                >
                  <AppIcon name="call" size={17} />
                  <span>{t.nav.callUs || 'Call'} · {info.phoneDisplay}</span>
                </a>

                {/* WhatsApp & Instagram Dual Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <a
                    href={getGeneralWhatsAppUrl(lang, info.whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-product-whatsapp"
                    style={{
                      minHeight: '44px',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      fontSize: '0.86rem',
                      padding: '0.5rem 0.6rem'
                    }}
                  >
                    <WhatsAppIcon size={17} color="#25d366" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={info.instagram?.url || businessInfo.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-product-instagram"
                    style={{
                      minHeight: '44px',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      fontSize: '0.86rem',
                      padding: '0.5rem 0.6rem'
                    }}
                  >
                    <InstagramIcon size={17} color="#e1306c" />
                    <span>Instagram</span>
                  </a>
                </div>

              </div>
            </aside>
          </>
        )}

        {/* Responsive CSS visibility helpers */}
        <style>{`
          @media (max-width: 960px) {
            .hidden-mobile { display: none !important; }
            .mobile-only-flex { display: flex !important; }
          }
          @media (min-width: 961px) {
            .mobile-only-flex { display: none !important; }
          }
          @media (max-width: 480px) {
            .header-logo-img { max-width: 130px !important; height: 28px !important; }
          }
          @media (max-width: 340px) {
            .header-logo-img { display: none !important; }
            .header-symbol-img { display: block !important; }
          }
        `}</style>
      </header>

    </>
  );
};

export default Navbar;
