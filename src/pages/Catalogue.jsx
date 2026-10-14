import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRouter, Link } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import ProductCard from '../components/ProductCard';
import CollectionFilters from '../components/ui/CollectionFilters';
import { WhatsAppIcon } from '../components/Icons';
import { getGeneralWhatsAppUrl } from '../config/businessInfo';
import useScrollReveal from '../hooks/useScrollReveal';

const labels = {
  en: {
    introPart1: 'Our products are made to last.',
    introPart2: 'Take your time exploring.',
    intro: 'Our products are made to last. Take your time exploring.',
    sort: 'Sort by',
    featured: 'Featured',
    newest: 'New arrivals first',
    az: 'Name: A–Z',
    count: 'pieces',
    clear: 'Clear filters',
    empty: 'No pieces match these filters.',
    kicker: 'Unique Furniture · Showroom Advisory',
    help: 'Need help choosing?',
    advice: 'Explore materials, finishes, and custom dimensions with our showroom team in Sulaymaniyah.',
    note: 'Contact us directly on WhatsApp for availability and personalized showroom visits.',
    response: 'Quick response · Sulaymaniyah Showroom'
  },
  ar: {
    introPart1: 'منتجاتنا صُنعت لتدوم.',
    introPart2: 'خذ وقتك في الاستكشاف.',
    intro: 'منتجاتنا صُنعت لتدوم. خذ وقتك في الاستكشاف.',
    sort: 'ترتيب حسب',
    featured: 'المميزة',
    newest: 'الجديد أولاً',
    az: 'الاسم: أ–ي',
    count: 'قطع',
    clear: 'مسح الفلاتر',
    empty: 'لا توجد قطع تطابق هذه الفلاتر.',
    kicker: 'أثاث يۆنیک · استشارة صالة العرض',
    help: 'تحتاج مساعدة في الاختيار؟',
    advice: 'اكتشف المواد والتشطيبات والأبعاد المخصصة مع فريق صالة العرض في السليمانية.',
    note: 'تواصل معنا مباشرة عبر واتساب للتحقق من التوفر وترتيب زيارة صالة العرض.',
    response: 'استجابة سريعة · صالة عرض السليمانية'
  },
  ku: {
    introPart1: 'بەرهەمەکانمان بۆ مانەوە دروستکراون.',
    introPart2: 'کاتی خۆت وەربگرە بۆ گەڕان.',
    intro: 'بەرهەمەکانمان بۆ مانەوە دروستکراون. کاتی خۆت وەربگرە بۆ گەڕان.',
    sort: 'ڕیزکردن بەپێی',
    featured: 'هەڵبژێردراوەکان',
    newest: 'نوێترینەکان یەکەم',
    az: 'ناو: ئەلفوبێ',
    count: 'پارچە',
    clear: 'پاککردنەوەی فلتەرەکان',
    empty: 'هیچ پارچەیەک لەگەڵ ئەم فلتەرانە ناگونجێت.',
    kicker: 'یۆنیک مۆبیلیات · ڕاوێژکاری پێشانگا',
    help: 'پێویستت بە یارمەتییە بۆ هەڵبژاردن؟',
    advice: 'لەگەڵ تیمی پێشانگای یۆنیک لە سلێمانی کەرەستە و قەبارە تایبەتەکان ببینە.',
    note: 'بۆ زانیاری زیاتر و سەردانی پێشانگا ڕاستەوخۆ لە واتساپ پەیوەندیمان پێوە بکە.',
    response: 'وەڵامدانەوەی خێرا · پێشانگای سلێمانی'
  }
};

export default function Catalogue({ type: routeType = 'all' }) {
  const { lang, t } = useLanguage();
  const { searchParams, navigate, currentPath } = useRouter();
  const { products, settings } = useCatalog();
  const text = labels[lang] || labels.en;

  // Mapping room subcategories to parent category for smart fallback
  const subcategoryToCategory = {
    living: 'home',
    dining: 'home',
    bedroom: 'home',
    executive: 'office',
    meeting: 'office',
    chairs: 'all'
  };

  const typeParam = searchParams.get('type');
  const catParam = searchParams.get('cat');

  // Determine activeCategory ('all' | 'home' | 'office')
  let activeCategory = 'all';
  if (['home', 'office', 'all'].includes(typeParam)) {
    activeCategory = typeParam;
  } else if (routeType !== 'all') {
    activeCategory = routeType;
  } else if (catParam && subcategoryToCategory[catParam] && subcategoryToCategory[catParam] !== 'all') {
    activeCategory = subcategoryToCategory[catParam];
  }

  // Determine activeSubcategory ('all' | 'living' | 'dining' | 'bedroom' | 'executive' | 'meeting' | 'chairs')
  const validRooms = ['living', 'dining', 'bedroom', 'executive', 'meeting', 'chairs'];
  let activeSubcategory = 'all';
  if (catParam && validRooms.includes(catParam)) {
    activeSubcategory = catParam;
  }

  // Sort parameter
  const sort = ['featured', 'newest', 'az'].includes(searchParams.get('sort'))
    ? searchParams.get('sort')
    : 'featured';

  // Base path for navigation
  const basePath = currentPath.startsWith('/products') ? '/products' : currentPath;

  // Hierarchical category & sub-category filtering
  const filtered = products
    .filter((p) => {
      if (p.published === false) return false;

      // 1. Filter by Main Category (Space: home / office / all)
      if (activeCategory === 'home' && p.type !== 'home') return false;
      if (activeCategory === 'office' && p.type !== 'office') return false;

      // 2. Filter by Subcategory (Room / Furniture type)
      if (activeSubcategory !== 'all' && p.categoryKey !== activeSubcategory) return false;

      return true;
    })
    .sort((a, b) => {
      if (sort === 'az') {
        const titleA = a.title?.[lang] || a.title?.en || '';
        const titleB = b.title?.[lang] || b.title?.en || '';
        return titleA.localeCompare(titleB, lang);
      }
      if (sort === 'newest') return Number(!!b.isNew) - Number(!!a.isNew);
      return Number(!!b.featured) - Number(!!a.featured);
    });

  // URL Query Updater for Main Category
  const handleSelectCategory = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (!catId || catId === 'all') {
      params.delete('type');
      params.delete('cat');
    } else {
      params.set('type', catId);
      // Validate whether current subcategory belongs to new main category
      const homeRooms = ['living', 'dining', 'bedroom', 'chairs'];
      const officeRooms = ['executive', 'meeting', 'chairs'];
      const allowedRooms = catId === 'home' ? homeRooms : officeRooms;
      if (activeSubcategory !== 'all' && !allowedRooms.includes(activeSubcategory)) {
        params.delete('cat');
      }
    }

    const newUrl = basePath + (params.size ? '?' + params.toString() : '');
    navigate(newUrl, { keepScroll: true });
  };

  // URL Query Updater for Sub-category
  const handleSelectSubcategory = (subcatId) => {
    const params = new URLSearchParams(searchParams);
    if (!subcatId || subcatId === 'all') {
      params.delete('cat');
    } else {
      params.set('cat', subcatId);
      // If category is not set, set the matching parent category
      if (activeCategory === 'all' && subcategoryToCategory[subcatId] && subcategoryToCategory[subcatId] !== 'all') {
        params.set('type', subcategoryToCategory[subcatId]);
      }
    }

    const newUrl = basePath + (params.size ? '?' + params.toString() : '');
    navigate(newUrl, { keepScroll: true });
  };

  const handleClearAll = () => {
    navigate(basePath, { keepScroll: true });
  };

  const updateSort = (sortVal) => {
    const params = new URLSearchParams(searchParams);
    if (sortVal === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', sortVal);
    }
    const newUrl = basePath + (params.size ? '?' + params.toString() : '');
    navigate(newUrl, { keepScroll: true });
  };

  const categoryLabels = t?.categories || {};

  const revealRef = useScrollReveal(
    `${activeCategory}:${activeSubcategory}:${sort}:${filtered.length}`
  );

  return (
    <div className="catalogue-page floema-catalog-page container" ref={revealRef}>
      {/* Breadcrumb Navigation with Multi-tier Hierarchy */}
      <nav className="catalogue-breadcrumb" aria-label={t.nav.home}>
        <Link href="/">{t.nav.home}</Link>
        <span aria-hidden="true" className="breadcrumb-separator">/</span>
        <span
          className="breadcrumb-item"
          style={{ cursor: activeCategory !== 'all' || activeSubcategory !== 'all' ? 'pointer' : 'default' }}
          onClick={activeCategory !== 'all' || activeSubcategory !== 'all' ? handleClearAll : undefined}
        >
          {t.nav.products || 'Products'}
        </span>
        {activeCategory !== 'all' && (
          <>
            <span aria-hidden="true" className="breadcrumb-separator">/</span>
            <span
              className="breadcrumb-subtag"
              style={{ cursor: activeSubcategory !== 'all' ? 'pointer' : 'default' }}
              onClick={activeSubcategory !== 'all' ? () => handleSelectSubcategory('all') : undefined}
            >
              {categoryLabels[activeCategory] || activeCategory}
            </span>
          </>
        )}
        {activeSubcategory !== 'all' && (
          <>
            <span aria-hidden="true" className="breadcrumb-separator">/</span>
            <span className="breadcrumb-subtag">
              {categoryLabels[activeSubcategory] || activeSubcategory}
            </span>
          </>
        )}
      </nav>

      {/* Floema Editorial Heading */}
      <header className="floema-page-header">
        <h1 className="floema-page-headline">
          <span className="floema-headline-sentence">{text.introPart1 || text.intro}</span>
          {text.introPart2 && (
            <span className="floema-headline-sentence floema-headline-sub">{text.introPart2}</span>
          )}
        </h1>
      </header>

      {/* Hierarchical Category & Subcategory Filter Bar */}
      <section className="floema-filter-wrapper" aria-label="Filters">
        <CollectionFilters
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          activeSubcategory={activeSubcategory}
          onSelectSubcategory={handleSelectSubcategory}
        />
      </section>

      {/* Product Results Section */}
      <section className="catalogue-results-full" aria-label="Catalog Products">
        {/* Results Toolbar */}
        <div className="catalogue-toolbar floema-toolbar">
          <div className="floema-toolbar-status">
            <p role="status">
              <span className="floema-count-num">{filtered.length}</span> {text.count}
              {activeCategory !== 'all' && (
                <span className="floema-active-chip">
                  <span>{categoryLabels[activeCategory] || activeCategory}</span>
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('all')}
                    aria-label={`Remove ${categoryLabels[activeCategory] || activeCategory} filter`}
                  >
                    ×
                  </button>
                </span>
              )}
              {activeSubcategory !== 'all' && (
                <span className="floema-active-chip">
                  <span>{categoryLabels[activeSubcategory] || activeSubcategory}</span>
                  <button
                    type="button"
                    onClick={() => handleSelectSubcategory('all')}
                    aria-label={`Remove ${categoryLabels[activeSubcategory] || activeSubcategory} filter`}
                  >
                    ×
                  </button>
                </span>
              )}
            </p>
          </div>

          <div className="floema-toolbar-actions">
            {(activeCategory !== 'all' || activeSubcategory !== 'all' || sort !== 'featured') && (
              <button
                type="button"
                className="floema-clear-btn"
                onClick={handleClearAll}
              >
                {text.clear} ×
              </button>
            )}

            <label className="floema-sort-select-label">
              <span>{text.sort}</span>
              <select
                value={sort}
                onChange={(e) => updateSort(e.target.value)}
                className="floema-sort-select"
              >
                <option value="featured">{text.featured}</option>
                <option value="newest">{text.newest}</option>
                <option value="az">{text.az}</option>
              </select>
            </label>
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length ? (
          <div className="furniture-grid floema-products-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="catalogue-empty">
            <p>{text.empty}</p>
            <button className="btn btn-secondary" onClick={handleClearAll}>
              {text.clear}
            </button>
          </div>
        )}
      </section>

      {/* Showroom Advisory Banner */}
      <aside className="catalogue-consultation" aria-labelledby="showroom-help-heading">
        <div className="catalogue-consultation-inner">
          <div className="catalogue-consultation-copy">
            <div className="consultation-kicker-wrap">
              <span className="consultation-kicker-dot" />
              <span className="consultation-kicker">{text.kicker || t.brandName}</span>
            </div>
            <h2 id="showroom-help-heading">{text.help}</h2>
            <p>{text.advice}</p>
            <p className="consultation-note">{text.note}</p>
          </div>
          <div className="catalogue-consultation-action">
            <a
              href={getGeneralWhatsAppUrl(lang, (settings || {}).whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-consultation-whatsapp"
            >
              <WhatsAppIcon size={20} color="#25d366" />
              <span>{t.nav.whatsAppCta || 'WhatsApp Showroom'}</span>
            </a>
            <span className="consultation-status">
              <span>{text.response}</span>
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
