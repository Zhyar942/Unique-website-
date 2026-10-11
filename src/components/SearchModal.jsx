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
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.48)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 350,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'max(1rem, var(--safe-top)) 1rem max(1.5rem, var(--safe-bottom))',
        overflowY: 'auto'
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.search}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          maxWidth: '640px',
          width: '100%',
          maxHeight: 'min(86dvh, 680px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-subtle)',
          animation: 'panelScaleIn 0.26s var(--ease-out-expo) both',
          willChange: 'transform, opacity'
        }}
      >
        {/* Search Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            minHeight: '68px',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          {/* Inset Neumorphic Search Bar */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-pressed-subtle)',
              padding: '0 0.85rem',
              minHeight: '46px',
              transition: 'border-color var(--duration-hover) ease, box-shadow var(--duration-hover) ease'
            }}
          >
            <AppIcon name="search" size={18} color="var(--brand-orange)" />
            <input
              ref={inputRef}
              aria-label={t.nav.search}
              type="search"
              inputMode="search"
              placeholder={t.search.placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.98rem',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                backgroundColor: 'transparent',
                height: '44px'
              }}
            />

            {query && (
              <button
                onClick={() => setQuery('')}
                className="btn btn-secondary"
                style={{
                  padding: '3px 9px',
                  minHeight: '28px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {lang === 'ku' ? 'پاککردنەوە' : lang === 'ar' ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close search"
            className="btn btn-secondary"
            style={{
              width: '42px',
              height: '42px',
              minHeight: '42px',
              padding: 0,
              flexShrink: 0,
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <AppIcon name="close" size={18} />
          </button>
        </div>

        {/* Search Content */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, backgroundColor: 'var(--bg-primary)' }}>
          {query.trim() === '' ? (
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.85rem', fontWeight: 600 }}>
                {t.search.recentPrompt}
              </span>
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  overflowX: 'auto',
                  paddingBottom: '0.5rem',
                  scrollbarWidth: 'none'
                }}
              >
                {quickSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(item.term)}
                    className="btn btn-secondary"
                    style={{
                      padding: '0.45rem 0.95rem',
                      minHeight: '38px',
                      fontSize: '0.84rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ margin: 0, fontSize: '0.98rem' }}>
                {t.search.noResults}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block', fontWeight: 600 }}>
                {filteredProducts.length} {lang === 'ku' ? 'ئەنجام دۆزرایەوە' : lang === 'ar' ? 'نتائج تم العثور عليها' : 'pieces found'}
              </span>
              {filteredProducts.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  style={{
                    display: 'flex',
                    textAlign: 'start',
                    width: '100%',
                    fontFamily: 'inherit',
                    background: 'transparent',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    minHeight: '56px',
                    border: '1px solid var(--border-light)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img
                    src={p.images?.[0] || '/product_placeholder.jpg'}
                    alt=""
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '6px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {p.title?.[lang] || p.title?.ku}
                    </h4>
                    <span style={{ fontSize: '0.76rem', color: 'var(--accent-earth)' }}>
                      {p.category?.[lang] || p.category?.ku}
                    </span>
                  </div>
                  <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={14} color="var(--text-muted)" />
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
