import React, { useState, useEffect, useRef } from 'react';
import { AppIcon } from './ui/Icon';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import { useDialog } from '../hooks/useDialog';

const SearchModal = ({ isOpen, onClose }) => {
  const { lang, t, isRtl } = useLanguage();
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const { products } = useCatalog();
  const dialogRef = useRef(null);
  useDialog(isOpen, onClose, dialogRef);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim() === '' ? [] : products.filter((p) => {
    if (p.published === false) return false;
    const q = query.trim().toLowerCase();
    const titleKu = (p.title?.ku || '').toLowerCase();
    const titleAr = (p.title?.ar || '').toLowerCase();
    const titleEn = (p.title?.en || '').toLowerCase();
    const catKu = (p.category?.ku || '').toLowerCase();
    const catAr = (p.category?.ar || '').toLowerCase();
    const catEn = (p.category?.en || '').toLowerCase();
    const code = (p.code || '').toLowerCase();

    return (
      titleKu.includes(q) ||
      titleAr.includes(q) ||
      titleEn.includes(q) ||
      catKu.includes(q) ||
      catAr.includes(q) ||
      catEn.includes(q) ||
      code.includes(q)
    );
  });

  const handleSelectProduct = (product) => {
    onClose();
    if (product.slug) {
      navigate(`/product/${product.slug}`);
    }
  };

  const quickSuggestions = [
    { label: lang === 'ku' ? 'قەنەفە' : lang === 'ar' ? 'كنبات' : 'Sofas', term: 'sofa' },
    { label: lang === 'ku' ? 'مێزی نانخواردن' : lang === 'ar' ? 'طاولات طعام' : 'Dining', term: 'dining' },
    { label: lang === 'ku' ? 'مێزی کارگێڕی' : lang === 'ar' ? 'مكاتب' : 'Desks', term: 'desk' },
    { label: lang === 'ku' ? 'نووستن' : lang === 'ar' ? 'غرف نوم' : 'Bed', term: 'bed' },
    { label: lang === 'ku' ? 'کورسی' : lang === 'ar' ? 'كراسي' : 'Chairs', term: 'chair' }
  ];

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.search}
        onClick={(e) => e.stopPropagation()}
        className="search-modal-container"
      >
        {/* Search Header */}
        <div className="search-modal-header">
          {/* Curvy Pill Search Bar */}
          <div className="search-modal-input-wrap">
            <AppIcon name="search" size={18} color="var(--brand-orange, #ff6600)" />
            <input
              ref={inputRef}
              aria-label={t.nav.search}
              type="search"
              inputMode="search"
              placeholder={t.search.placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-modal-input"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="search-modal-clear-btn"
                aria-label="Clear query"
              >
                {lang === 'ku' ? 'پاککردنەوە' : lang === 'ar' ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="search-modal-close-btn"
          >
            <AppIcon name="close" size={18} />
          </button>
        </div>

        {/* Search Content */}
        <div className="search-modal-body">
          {query.trim() === '' ? (
            <div>
              <span className="search-suggestions-title">
                {t.search.recentPrompt}
              </span>
              <div className="search-suggestions-track">
                {quickSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuery(item.term)}
                    className="search-suggestion-pill"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ margin: 0, fontSize: '0.98rem', fontWeight: 400 }}>
                {t.search.noResults}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block', fontWeight: 400 }}>
                {filteredProducts.length} {lang === 'ku' ? 'ئەنجام دۆزرایەوە' : lang === 'ar' ? 'نتائج تم العثور عليها' : 'pieces found'}
              </span>
              {filteredProducts.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className="search-result-item"
                >
                  <img
                    src={p.images?.[0] || '/product_placeholder.jpg'}
                    alt=""
                    className="search-result-thumb"
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 className="search-result-title">
                      {p.title?.[lang] || p.title?.ku}
                    </h4>
                    <span className="search-result-cat">
                      {p.category?.[lang] || p.category?.ku}
                    </span>
                  </div>
                  <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={15} color="var(--text-muted)" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
