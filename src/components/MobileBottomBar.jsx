import React from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { useCatalog } from '../context/CatalogContext';
import { AppIcon } from './ui/Icon';
import { WhatsAppIcon } from './Icons';
import { businessInfo, getGeneralWhatsAppUrl } from '../config/businessInfo';

export default function MobileBottomBar({ onSearchClick }) {
  const { currentPath, route } = useRouter();
  const { lang, t } = useLanguage();
  const { settings } = useCatalog();
  const info = settings || businessInfo;

  // On product detail page, the product-specific sticky bar (WhatsApp + Call) is active
  if (route === 'product' || route === 'admin' || route === 'admin-login') {
    return null;
  }

  const items = [
    {
      id: 'home',
      label: t.nav.home || 'Home',
      href: '/',
      icon: 'home',
      isActive: currentPath === '/'
    },
    {
      id: 'products',
      label: t.nav.products || 'Products',
      href: '/products',
      icon: 'category',
      isActive: currentPath.startsWith('/products') || currentPath.startsWith('/home-furniture') || currentPath.startsWith('/office-furniture')
    },
    {
      id: 'search',
      label: t.nav.search || 'Search',
      onClick: onSearchClick,
      icon: 'search',
      isActive: false
    },
    {
      id: 'showroom',
      label: t.nav.showroom || 'Showroom',
      href: '/contact',
      icon: 'location',
      isActive: currentPath === '/contact'
    },
    {
      id: 'whatsapp',
      label: t.nav.whatsApp || 'WhatsApp',
      href: getGeneralWhatsAppUrl(lang, info.whatsappNumber),
      isExternal: true,
      customIcon: <WhatsAppIcon size={20} color="#25d366" />,
      isActive: false
    }
  ];

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
      <div className="mobile-bottom-bar-inner">
        {items.map((item) => {
          const content = (
            <>
              <div className="mobile-bottom-icon-wrap">
                {item.customIcon || (
                  <AppIcon
                    name={item.icon}
                    size={20}
                    color={item.isActive ? 'var(--brand-orange, #c86526)' : 'currentColor'}
                  />
                )}
                {item.isActive && <span className="mobile-bottom-active-dot" />}
              </div>
              <span className="mobile-bottom-label">{item.label}</span>
            </>
          );

          if (item.onClick) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={`mobile-bottom-btn ${item.isActive ? 'is-active' : ''}`}
                aria-label={item.label}
              >
                {content}
              </button>
            );
          }

          if (item.isExternal) {
            return (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mobile-bottom-btn ${item.isActive ? 'is-active' : ''}`}
                aria-label={item.label}
              >
                {content}
              </a>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`mobile-bottom-btn ${item.isActive ? 'is-active' : ''}`}
              aria-current={item.isActive ? 'page' : undefined}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
