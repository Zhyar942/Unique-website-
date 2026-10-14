import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRouter, Link } from '../context/RouterContext';
import RoomIcon from '../components/ui/RoomIcon';
import AppIcon from '../components/ui/Icon';
import ProductCard from '../components/ProductCard';
import CollectionFilters, { MAIN_CATEGORIES, SUB_CATEGORIES } from '../components/ui/CollectionFilters';
import { products } from '../data/products';
import '../design-system.css';

export default function DesignSystemShowcase() {
  const { lang, setLang, t, isRtl } = useLanguage();
  const { navigate } = useRouter();
  const [copiedToken, setCopiedToken] = useState(null);
  const [demoActiveCategory, setDemoActiveCategory] = useState('home');
  const [demoActiveSubcategory, setDemoActiveSubcategory] = useState('living');
  const [activeSection, setActiveSection] = useState('colors');

  const copyToClipboard = (text, label) => {
    navigator.clipboard?.writeText(text);
    setCopiedToken(`${label}: ${text}`);
    setTimeout(() => setCopiedToken(null), 2400);
  };

  const sampleProduct = products[0] || {
    id: 1,
    title: { ku: 'قەنەفەی مۆدیولاری کلاود', ar: 'كنبة سحابية مقسمة موديولار', en: 'Cloud Modular Sectional Sofa' },
    category: { ku: 'ژووری میوان', ar: 'غرفة المعيشة', en: 'Living Room' },
    images: ['/images/sofa_cloud_sectional.jpg'],
    isNew: true
  };

  const COLOR_PALETTES = [
    {
      group: '60% — Dominant Warm Canvas',
      desc: 'Warm off-white and light stone surfaces. Prevents sterile clinical white while highlighting furniture photography.',
      items: [
        { name: '--bg-primary', hex: '#FAF8F5', text: '#18181b', role: 'Default page body background' },
        { name: '--bg-secondary', hex: '#F4F0EA', text: '#18181b', role: 'Subtle section cards & wrappers' },
        { name: '--floema-stone', hex: '#F2EFEA', text: '#241f21', role: 'Floema category card uniform surface' },
        { name: '--bg-surface', hex: '#FAF8F5', text: '#18181b', role: 'Neumorphic controls & inputs' },
        { name: '--bg-card', hex: '#FFFFFF', text: '#18181b', role: 'Product card base canvas' },
        { name: '--bg-subtle', hex: '#EFEAE2', text: '#18181b', role: 'Dividers & soft hover tones' }
      ]
    },
    {
      group: '30% — Secondary Architectural Charcoal',
      desc: 'Deep warm neutrals providing structural contrast, typography hierarchy, and framing weight.',
      items: [
        { name: '--text-primary', hex: '#18181B', text: '#ffffff', role: 'Headlines, primary titles & emphasis' },
        { name: '--floema-dark', hex: '#241F21', text: '#ffffff', role: 'Floema active 2px border & badge' },
        { name: '--color-charcoal-deep', hex: '#050505', text: '#ffffff', role: 'Deep charcoal contrast elements' },
        { name: '--text-secondary', hex: '#52525B', text: '#ffffff', role: 'Body copy and specifications' },
        { name: '--text-muted', hex: '#71717A', text: '#ffffff', role: 'Captions, kickers & timestamps' },
        { name: '--border-subtle', hex: '#E5E0D5', text: '#18181b', role: 'Structural perimeter border affordance' }
      ]
    },
    {
      group: '10% — Official Brand Orange & Accents',
      desc: 'Extracted directly from the master Unique Furniture logo. Reserved strictly for intentional high-priority interactions.',
      items: [
        { name: '--brand-orange', hex: '#FF6600', text: '#ffffff', role: 'Master Unique logo official orange' },
        { name: '--brand-orange-hover', hex: '#E55C00', text: '#ffffff', role: 'Orange button hover state' },
        { name: '--accent-rust', hex: '#AB480B', text: '#ffffff', role: 'Warm architectural terracotta accent' },
        { name: '--accent-earth', hex: '#8C7355', text: '#ffffff', role: 'Natural walnut wood & earth tone' },
        { name: '--accent-sand', hex: '#C5A880', text: '#18181b', role: 'Roman travertine & sand stone' },
        { name: '--whatsapp-green', hex: '#25D366', text: '#ffffff', role: 'Contextual direct WhatsApp showroom chat' }
      ]
    }
  ];

  const TYPOGRAPHY_SCALES = [
    { label: 'Editorial Headline (Floema)', token: 'clamp(2rem, 3.8vw, 3.35rem)', weight: '500', sample: 'Our products are made to last.' },
    { label: 'H1 Page Title', token: 'clamp(1.85rem, 4.2vw, 3.4rem)', weight: '700', sample: 'Curated Living & Office Collections' },
    { label: 'H2 Section Heading', token: 'clamp(1.4rem, 2.8vw, 2.4rem)', weight: '700', sample: '01 / Living Room Furniture' },
    { label: 'H3 Component Title', token: 'clamp(1.1rem, 1.8vw, 1.45rem)', weight: '600', sample: 'Cloud Modular Sectional Sofa' },
    { label: 'Card Title / Floema Label', token: '13.5px / 0.88rem', weight: '400 (normal)', sample: 'Home Furniture · Living Room' },
    { label: 'Body Regular', token: 'clamp(0.92rem, 0.95vw, 1.02rem)', weight: '400', sample: 'Handcrafted with kiln-dried American walnut and high-resilience French bouclé.' },
    { label: 'Micro Caption / Kicker', token: '0.78rem (uppercase)', weight: '600', sample: 'SULAYMANIYAH SHOWROOM · UNIQUE FURNITURE' }
  ];

  const ROOM_ICONS = [
    { name: 'all', label: 'All Pieces (4-Grid)' },
    { name: 'home', label: 'Home Furniture' },
    { name: 'office', label: 'Office Furniture' },
    { name: 'living', label: 'Living Room' },
    { name: 'dining', label: 'Dining Room' },
    { name: 'bedroom', label: 'Bedroom' },
    { name: 'executive', label: 'Executive Desks' },
    { name: 'meeting', label: 'Meeting Tables' },
    { name: 'chairs', label: 'Chairs & Accents' }
  ];

  const APP_ICONS = [
    'search', 'call', 'location', 'time', 'star', 'shield-done',
    'discovery', 'arrow-right', 'arrow-left', 'chevron-down', 'menu', 'close',
    'check', 'edit', 'delete', 'package', 'settings', 'user'
  ];

  return (
    <div className="ds-page" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Toast Notification */}
      {copiedToken && (
        <aside className="ds-toast" role="status" aria-live="polite">
          <AppIcon name="check" size={16} color="#ffffff" />
          <span>Copied {copiedToken}</span>
        </aside>
      )}

      {/* Top Bar Banner */}
      <header className="ds-hero">
        <div className="container">
          <div className="ds-hero-inner">
            <div className="ds-hero-copy">
              <span className="ds-badge-private">
                <AppIcon name="lock" size={14} color="#ab480b" />
                PRIVATE DEVELOPER LAB · UNLISTED
              </span>
              <h1 className="ds-hero-title">Unique Furniture Design System</h1>
              <p className="ds-hero-desc">
                Architectural token reference, component states, and interactive guidelines powering Unique Furniture (Sulaymaniyah).
              </p>
            </div>

            <div className="ds-hero-actions">
              <div className="ds-lang-picker" role="group" aria-label="Language Preview">
                <span className="ds-lang-label">Preview Language:</span>
                <div className="ds-lang-btns">
                  {['ku', 'ar', 'en'].map((l) => (
                    <button
                      key={l}
                      type="button"
                      className={`ds-lang-btn ${lang === l ? 'is-active' : ''}`}
                      onClick={() => setLang(l)}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <Link href="/products" className="btn btn-secondary ds-back-btn">
                <span>View Live Store</span>
                <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={15} />
              </Link>
            </div>
          </div>

          {/* Sticky Section Navigation */}
          <nav className="ds-nav-tabs" aria-label="Design System Navigation">
            {[
              { id: 'colors', label: '01 / Colors (60/30/10)' },
              { id: 'typography', label: '02 / Typography' },
              { id: 'buttons', label: '03 / Buttons & Controls' },
              { id: 'floema', label: '04 / Floema Filters' },
              { id: 'cards', label: '05 / Product Cards' },
              { id: 'icons', label: '06 / Icon Library' },
              { id: 'surfaces', label: '07 / Neumorphism & Depth' },
              { id: 'micro', label: '08 / Badges & Chips' }
            ].map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className={`ds-tab-link ${activeSection === tab.id ? 'is-active' : ''}`}
                onClick={() => setActiveSection(tab.id)}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="container ds-content">
        {/* ================= 01 / COLOR SYSTEM ================= */}
        <section id="colors" className="ds-section">
          <div className="ds-section-header">
            <span className="section-kicker">01 / COLOR PALETTE</span>
            <h2>The 60 / 30 / 10 Macro Architectural Composition</h2>
            <p>Click any swatch to copy its CSS token or Hex code directly to your clipboard.</p>
          </div>

          <div className="ds-color-groups">
            {COLOR_PALETTES.map((group, idx) => (
              <div key={idx} className="ds-color-group">
                <div className="ds-group-info">
                  <h3>{group.group}</h3>
                  <p>{group.desc}</p>
                </div>
                <div className="ds-swatches-grid">
                  {group.items.map((color) => (
                    <div
                      key={color.name}
                      className="ds-swatch-card"
                      onClick={() => copyToClipboard(color.hex, color.name)}
                      role="button"
                      tabIndex={0}
                      title="Click to copy"
                    >
                      <div
                        className="ds-swatch-preview"
                        style={{ backgroundColor: color.hex, color: color.text }}
                      >
                        <span className="ds-swatch-hex">{color.hex}</span>
                      </div>
                      <div className="ds-swatch-meta">
                        <code className="ds-swatch-token">{color.name}</code>
                        <span className="ds-swatch-role">{color.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 02 / TYPOGRAPHY ================= */}
        <section id="typography" className="ds-section">
          <div className="ds-section-header">
            <span className="section-kicker">02 / TYPOGRAPHY SPEC</span>
            <h2>Zain Font & Plus Jakarta Sans Type Scale</h2>
            <p>
              Rule: <strong>Font weight normal (400)</strong> is enforced for all cards and body text for quiet luxury elegance.
            </p>
          </div>

          <div className="ds-type-table">
            {TYPOGRAPHY_SCALES.map((item, i) => (
              <div key={i} className="ds-type-row">
                <div className="ds-type-meta">
                  <strong>{item.label}</strong>
                  <code>{item.token}</code>
                  <span>Weight: {item.weight}</span>
                </div>
                <div className="ds-type-preview">
                  <div style={{ fontSize: item.token, fontWeight: item.weight.includes('normal') ? 400 : 700 }}>
                    {item.sample}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 03 / BUTTONS & CONTROLS ================= */}
        <section id="buttons" className="ds-section">
          <div className="ds-section-header">
            <span className="section-kicker">03 / INTERACTIVE CONTROLS</span>
            <h2>Physical Tactile Buttons & Press Physics</h2>
            <p>All controls incorporate micro-interaction tactile feedback with scale(0.97) on active press.</p>
          </div>

          <div className="ds-components-grid">
            {/* Primary Charcoal */}
            <div className="ds-comp-box">
              <span className="ds-comp-label">Primary Charcoal (.btn-primary)</span>
              <p className="ds-comp-desc">30% Structural Depth for primary actions</p>
              <div className="ds-comp-demo">
                <button type="button" className="btn btn-primary">
                  <span>Explore Furniture</span>
                  <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={15} />
                </button>
              </div>
            </div>

            {/* Secondary Neumorphic */}
            <div className="ds-comp-box">
              <span className="ds-comp-label">Secondary Neumorphic (.btn-secondary)</span>
              <p className="ds-comp-desc">Raised tactile surface with perimeter affordance</p>
              <div className="ds-comp-demo">
                <button type="button" className="btn btn-secondary">
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>

            {/* Brand Orange */}
            <div className="ds-comp-box">
              <span className="ds-comp-label">Brand Orange (.btn-brand)</span>
              <p className="ds-comp-desc">10% Reserved Priority CTA</p>
              <div className="ds-comp-demo">
                <button type="button" className="btn btn-brand">
                  <span>Showroom Catalog</span>
                </button>
              </div>
            </div>

            {/* WhatsApp Contextual */}
            <div className="ds-comp-box">
              <span className="ds-comp-label">WhatsApp Direct CTA (.btn-whatsapp)</span>
              <p className="ds-comp-desc">Direct customer chat on WhatsApp</p>
              <div className="ds-comp-demo">
                <a href="#demo" className="btn btn-whatsapp" onClick={(e) => e.preventDefault()}>
                  <AppIcon name="call" size={17} color="#ffffff" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>

            {/* Icon Button */}
            <div className="ds-comp-box">
              <span className="ds-comp-label">Tactile Header Icon (.header-icon-btn)</span>
              <p className="ds-comp-desc">44×44px minimum touch target</p>
              <div className="ds-comp-demo" style={{ gap: '12px' }}>
                <button type="button" className="header-icon-btn" aria-label="Search">
                  <AppIcon name="search" size={18} />
                </button>
                <button type="button" className="header-icon-btn" aria-label="Showroom Call">
                  <AppIcon name="call" size={18} />
                </button>
              </div>
            </div>

            {/* Animated Link Arrow */}
            <div className="ds-comp-box">
              <span className="ds-comp-label">Micro-Animated Link (.link-hover-arrow)</span>
              <p className="ds-comp-desc">Hover slides arrow in reading direction</p>
              <div className="ds-comp-demo">
                <span className="link-hover-arrow" style={{ cursor: 'pointer', color: '#18181b', fontWeight: 500 }}>
                  <span>View All Specifications</span>
                  <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={15} />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 04 / CATEGORY CARDS SYSTEM ================= */}
        <section id="floema" className="ds-section">
          <div className="ds-section-header">
            <span className="section-kicker">04 / CATEGORY CARDS SYSTEM</span>
            <h2>Minimalist Outline Category Cards</h2>
            <p>
              Features centered outline SVG furniture icons, clean normal font typography, live item availability counts, and signature architectural charcoal active state (#18181B).
            </p>
          </div>

          <div className="ds-floema-demo-wrapper">
            <CollectionFilters
              activeCategory={demoActiveCategory}
              onSelectCategory={setDemoActiveCategory}
              activeSubcategory={demoActiveSubcategory}
              onSelectSubcategory={setDemoActiveSubcategory}
            />

            <div className="ds-floema-state-summary">
              <strong>Active State:</strong>
              <span>Category: <code>{demoActiveCategory}</code></span>
              <span>Sub-category: <code>{demoActiveSubcategory}</code></span>
            </div>
          </div>
        </section>

        {/* ================= 05 / PRODUCT CARDS ================= */}
        <section id="cards" className="ds-section">
          <div className="ds-section-header">
            <span className="section-kicker">05 / PRODUCT CARDS</span>
            <h2>Product Cards (.furniture-card)</h2>
            <p>Quiet, photography-led with container queries, 4:3 aspect ratio, subtle elevation, and direct actions.</p>
          </div>

          <div className="furniture-grid" style={{ maxWidth: '980px', margin: '0 auto' }}>
            <ProductCard product={products[0]} />
            <ProductCard product={products[1]} />
            <ProductCard product={products[3]} />
          </div>
        </section>

        {/* ================= 06 / ICON SYSTEM ================= */}
        <section id="icons" className="ds-section">
          <div className="ds-section-header">
            <span className="section-kicker">06 / ICON SYSTEM</span>
            <h2>Room & Application SVG Icon Library</h2>
            <p>Clean line strokes matching luxury architectural draft lines.</p>
          </div>

          <h3>Room Icons (Custom SVG Architecture)</h3>
          <div className="ds-icons-grid">
            {ROOM_ICONS.map((icon) => (
              <div key={icon.name} className="ds-icon-card">
                <div className="ds-icon-box">
                  <RoomIcon name={icon.name} size={32} strokeWidth={1.5} />
                </div>
                <code>{icon.name}</code>
                <span>{icon.label}</span>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: '36px' }}>App Icons (Iconly Standard Suite)</h3>
          <div className="ds-icons-grid">
            {APP_ICONS.map((name) => (
              <div key={name} className="ds-icon-card">
                <div className="ds-icon-box">
                  <AppIcon name={name} size={22} color="#18181b" />
                </div>
                <code>{name}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 07 / SURFACES & SHADOWS ================= */}
        <section id="surfaces" className="ds-section">
          <div className="ds-section-header">
            <span className="section-kicker">07 / NEUMORPHISM & DEPTH</span>
            <h2>Single Light Source Virtual Elevation System</h2>
            <p>Virtual light from upper-left (-135°) creating organic tactile depth.</p>
          </div>

          <div className="ds-surfaces-grid">
            <div className="ds-surface-card neu-raised">
              <strong>--shadow-raised-sm</strong>
              <p>Default interactive controls</p>
              <code>2px 2px 5px / -1.5px -1.5px 4px</code>
            </div>

            <div className="ds-surface-card neu-raised" style={{ boxShadow: 'var(--shadow-raised)' }}>
              <strong>--shadow-raised</strong>
              <p>Hover lift on cards & buttons</p>
              <code>3px 3px 7px / -2.5px -2.5px 6px</code>
            </div>

            <div className="ds-surface-card neu-pressed">
              <strong>--shadow-pressed</strong>
              <p>Sunken physical active press</p>
              <code>inset 2px 2px 4.5px / inset -2px -2px 4px</code>
            </div>

            <div className="ds-surface-card" style={{ boxShadow: 'var(--shadow-floating)', background: '#ffffff' }}>
              <strong>--shadow-floating</strong>
              <p>Floating sheets & dropdowns</p>
              <code>6px 10px 22px / -3px -3px 9px</code>
            </div>
          </div>
        </section>

        {/* ================= 08 / BADGES & CHIPS ================= */}
        <section id="micro" className="ds-section">
          <div className="ds-section-header">
            <span className="section-kicker">08 / MICRO-UI</span>
            <h2>Status Chips, Badges & Labels</h2>
            <p>Quiet informational affordance across navigation and filters.</p>
          </div>

          <div className="ds-micro-row">
            <div className="ds-micro-item">
              <span className="ds-micro-tag-label">Kicker Tag (.section-kicker)</span>
              <span className="section-kicker">01 / ROOMS & CATEGORIES</span>
            </div>

            <div className="ds-micro-item">
              <span className="ds-micro-tag-label">Clean Heritage Badge (.badge-clean)</span>
              <span className="badge-clean">
                <AppIcon name="star" size={13} color="#8c7355" />
                <span>Sulaymaniyah Craftsmanship</span>
              </span>
            </div>

            <div className="ds-micro-item">
              <span className="ds-micro-tag-label">New Tag (.product-tag-new)</span>
              <span className="product-tag-new">NEW ARRIVAL</span>
            </div>

            <div className="ds-micro-item">
              <span className="ds-micro-tag-label">Active Filter Chip (.floema-active-chip)</span>
              <span className="floema-active-chip">
                <span>Living Room</span>
                <button type="button" aria-label="Remove filter">×</button>
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Note */}
      <footer className="ds-footer">
        <div className="container">
          <p>
            Unique Furniture Design System · Internal Engineering Reference · Sulaymaniyah, Kurdistan Region
          </p>
        </div>
      </footer>
    </div>
  );
}
