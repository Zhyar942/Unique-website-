import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCatalog } from '../../context/CatalogContext';
import { products as staticProducts } from '../../data/products';
import RoomIcon from './RoomIcon';

// Level 1: Main Spaces
export const MAIN_CATEGORIES = [
  { id: 'all', icon: 'all' },
  { id: 'home', icon: 'home' },
  { id: 'office', icon: 'office' }
];

// Level 2: Sub-categories by Space
export const SUB_CATEGORIES = {
  home: [
    { id: 'all', icon: 'all', labelKey: 'allHome' },
    { id: 'living', icon: 'sofa', labelKey: 'living', enShort: 'Sofa', kuShort: 'قەنەفە', arShort: 'كنب' },
    { id: 'dining', icon: 'table', labelKey: 'dining', enShort: 'Table', kuShort: 'مێز', arShort: 'طاولة' },
    { id: 'bedroom', icon: 'bed', labelKey: 'bedroom', enShort: 'Bed', kuShort: 'تەخت', arShort: 'سرير' },
    { id: 'chairs', icon: 'chair', labelKey: 'chairs', enShort: 'Chair', kuShort: 'کورسی', arShort: 'كراسي' }
  ],
  office: [
    { id: 'all', icon: 'all', labelKey: 'allOffice' },
    { id: 'executive', icon: 'desk', labelKey: 'executive', enShort: 'Desk', kuShort: 'مێزی ئۆفیس', arShort: 'مكتب' },
    { id: 'meeting', icon: 'meeting', labelKey: 'meeting', enShort: 'Meeting', kuShort: 'کۆبوونەوە', arShort: 'اجتماعات' },
    { id: 'chairs', icon: 'chair', labelKey: 'chairs', enShort: 'Chair', kuShort: 'کورسی ئۆفیس', arShort: 'كراسي' }
  ],
  all: [
    { id: 'all', icon: 'all', labelKey: 'allPieces', enShort: 'All Pieces', kuShort: 'هەموو مۆدێلەکان', arShort: 'كل القطع' },
    { id: 'chairs', icon: 'chair', labelKey: 'chairs', enShort: 'Chair', kuShort: 'کورسی', arShort: 'كراسي' },
    { id: 'living', icon: 'sofa', labelKey: 'living', enShort: 'Sofa', kuShort: 'قەنەفە', arShort: 'كنب' },
    { id: 'dining', icon: 'table', labelKey: 'dining', enShort: 'Table', kuShort: 'مێز', arShort: 'طاولة' },
    { id: 'bedroom', icon: 'bed', labelKey: 'bedroom', enShort: 'Bed', kuShort: 'تەخت', arShort: 'سرير' },
    { id: 'executive', icon: 'desk', labelKey: 'executive', enShort: 'Desk', kuShort: 'مێزی ئۆفیس', arShort: 'مكتب' },
    { id: 'meeting', icon: 'meeting', labelKey: 'meeting', enShort: 'Meeting', kuShort: 'کۆبوونەوە', arShort: 'اجتماعات' }
  ]
};

export default function CollectionFilters({
  activeCategory = 'all',
  onSelectCategory,
  activeSubcategory = 'all',
  onSelectSubcategory,
  // Backward compatibility props (e.g. used in Home.jsx)
  options,
  value,
  onChange,
  label
}) {
  const { lang, t } = useLanguage();
  let liveProducts = staticProducts;
  try {
    const catalog = useCatalog();
    if (catalog?.products) liveProducts = catalog.products;
  } catch {
    // fallback to staticProducts
  }

  // Backward compatibility for simple pill options (e.g. Home.jsx)
  if (options) {
    return (
      <div className="collection-filters-styled" role="group" aria-label={label}>
        <div className="clean-category-track" role="tablist">
          {options.map((option) => {
            const isSelected = value === option.id;
            const count = liveProducts.filter((p) => {
              if (p.published === false) return false;
              if (option.id === 'new') return !!p.isNew;
              if (option.id === 'all') return true;
              return p.type === option.id;
            }).length;

            const iconName = option.id === 'home' ? 'home' : option.id === 'office' ? 'office' : 'all';

            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onChange(option.id)}
                className={`clean-category-card ${isSelected ? 'is-active' : ''}`}
              >
                <div className="clean-category-icon-box">
                  <RoomIcon name={iconName} size={34} strokeWidth={1.75} />
                </div>
                <span className="clean-category-title">{option.label}</span>
                <span className="clean-category-count">
                  {lang === 'ku'
                    ? `${count} دانە بەردەستە`
                    : lang === 'ar'
                    ? `${count} قطعة متوفرة`
                    : `${count} Item Available`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const categoryLabels = t?.categories || {};
  const currentCategory = activeCategory || 'all';
  const currentSubcategory = activeSubcategory || 'all';

  const cardsList = SUB_CATEGORIES[currentCategory] || SUB_CATEGORIES.all;

  // Calculate live item count for each card
  const getItemCount = (item) => {
    if (item.id === 'all') {
      if (currentCategory === 'home') {
        return liveProducts.filter((p) => p.published !== false && p.type === 'home').length;
      }
      if (currentCategory === 'office') {
        return liveProducts.filter((p) => p.published !== false && p.type === 'office').length;
      }
      return liveProducts.filter((p) => p.published !== false).length;
    }

    return liveProducts.filter((p) => {
      if (p.published === false) return false;
      if (currentCategory === 'home' && p.type !== 'home') return false;
      if (currentCategory === 'office' && p.type !== 'office') return false;
      return p.categoryKey === item.id;
    }).length;
  };

  const formatCount = (count) => {
    if (lang === 'ku') {
      return `${count} دانە بەردەستە`;
    }
    if (lang === 'ar') {
      return `${count} قطعة متوفرة`;
    }
    return `${count} Item Available`;
  };

  const getLabel = (item) => {
    if (lang === 'ku' && item.kuShort) return item.kuShort;
    if (lang === 'ar' && item.arShort) return item.arShort;
    if (lang === 'en' && item.enShort) return item.enShort;
    if (item.labelKey && categoryLabels[item.labelKey]) {
      return categoryLabels[item.labelKey];
    }
    return categoryLabels[item.id] || item.id;
  };

  const sectionTitle =
    lang === 'ku' ? 'دابەشکردنی بەرهەمەکان' : lang === 'ar' ? 'فئات الأثاث' : 'Category';

  const handleCardClick = (cardId) => {
    if (!onSelectSubcategory) return;
    if (cardId === 'all') {
      onSelectSubcategory('all');
    } else if (cardId === currentSubcategory) {
      onSelectSubcategory('all');
    } else {
      onSelectSubcategory(cardId);
    }
  };

  return (
    <div className="category-filter-wrapper" role="region" aria-label="Category Filters">
      {/* 1. Centered Section Title like in uploaded reference image */}
      <h2 className="category-filter-heading">{sectionTitle}</h2>

      {/* 2. Space Selector (All / Home / Office) */}
      <div className="category-space-selector" role="group" aria-label="Space Type">
        {[
          { id: 'all', label: lang === 'ku' ? 'هەموو بەرهەمەکان' : lang === 'ar' ? 'كل القطع' : 'All Pieces' },
          { id: 'home', label: lang === 'ku' ? 'مۆبیلیاتی ماڵ' : lang === 'ar' ? 'أثاث منزلي' : 'Home Furniture' },
          { id: 'office', label: lang === 'ku' ? 'مۆبیلیاتی ئۆفیس' : lang === 'ar' ? 'أثاث مكتبي' : 'Office Furniture' }
        ].map((space) => {
          const isSpaceActive = currentCategory === space.id;
          return (
            <button
              key={space.id}
              type="button"
              className={`category-space-btn ${isSpaceActive ? 'is-active' : ''}`}
              onClick={() => onSelectCategory && onSelectCategory(space.id)}
              aria-pressed={isSpaceActive}
            >
              {space.label}
            </button>
          );
        })}
      </div>

      {/* 3. Horizontal Row of Category Cards (Exact style from screenshot) */}
      <div className="clean-category-track" role="tablist" aria-label="Categories">
        {cardsList.map((item) => {
          const isSelected =
            item.id === 'all'
              ? currentSubcategory === 'all'
              : currentSubcategory === item.id;
          const labelText = getLabel(item);
          const count = getItemCount(item);

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`clean-category-card ${isSelected ? 'is-active' : ''}`}
              onClick={() => handleCardClick(item.id)}
            >
              {/* Outline SVG Icon */}
              <div className="clean-category-icon-box">
                <RoomIcon name={item.icon} size={34} strokeWidth={1.75} />
              </div>

              {/* Title (Normal Font) */}
              <span className="clean-category-title">{labelText}</span>

              {/* Item Count (e.g. "200 Item Available" / "٨ دانە بەردەستە") */}
              <span className="clean-category-count">{formatCount(count)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
