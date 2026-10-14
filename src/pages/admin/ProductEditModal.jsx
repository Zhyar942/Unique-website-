import React, { useState, useRef, useEffect } from 'react';
import { AppIcon } from '../../components/ui/Icon';
import { optimizeImageFile } from '../../utils/imageOptimizer';

const AVAILABLE_SHOWROOM_IMAGES = [
  '/images/sofa_cloud_sectional.jpg',
  '/images/dining_table_marble.jpg',
  '/images/executive_desk_walnut.jpg',
  '/images/bedroom_king_bed.jpg',
  '/images/meeting_conference_table.jpg',
  '/hero_interior.jpg',
  '/banner_interior.jpg'
];

const CATEGORY_PRESETS = {
  home: [
    { key: 'living', en: 'Living Room', ku: 'ژووری میوان و دانیشتن', ar: 'غرفة المعيشة' },
    { key: 'dining', en: 'Dining Room', ku: 'ژووری نانخواردن', ar: 'غرفة الطعام' },
    { key: 'bedroom', en: 'Bedroom', ku: 'ژووری نووستن', ar: 'غرفة النوم' },
    { key: 'coffeeTables', en: 'Coffee Tables', ku: 'مێزی ناوەڕاست', ar: 'طاولات الوسط' },
    { key: 'tvUnits', en: 'TV Units', ku: 'مێزی تەلەفزیۆن', ar: 'طاولات التلفزيون' },
    { key: 'consoles', en: 'Consoles & Mirrors', ku: 'کۆنسۆڵ و ئاوێنە', ar: 'كونسول ومرايا' },
    { key: 'outdoor', en: 'Outdoor Furniture', ku: 'مۆبیلیاتی باخچە', ar: 'أثاث الحدائق' }
  ],
  office: [
    { key: 'executive', en: 'Executive Desks', ku: 'مێزی بەڕێوەبەرایەتی', ar: 'المكاتب التنفيذية' },
    { key: 'workstations', en: 'Workstations', ku: 'مێزی کارمەندان', ar: 'محطات العمل' },
    { key: 'ergonomic', en: 'Ergonomic Chairs', ku: 'کورسی ئەرگۆنۆمی', ar: 'كراسي طبية' },
    { key: 'conference', en: 'Conference Tables', ku: 'مێزی کۆبوونەوە', ar: 'طاولات الاجتماعات' },
    { key: 'lounge', en: 'Office Sofas & Reception', ku: 'قەنەفەی ئۆفیس و پێشوازی', ar: 'أطقم الاستقبال' },
    { key: 'storage', en: 'Filing & Storage', ku: 'کەنتۆری ئۆفیس', ar: 'خزائن المكاتب' }
  ]
};

const COMMON_COLLECTIONS = [
  'Living Room',
  'Dining',
  'Bedroom',
  'Office',
  'Urban',
  'Details',
  'Nature',
  'Bespoke',
  'Executive',
  'Minimalist'
];

export default function ProductEditModal({
  isOpen,
  product,
  onClose,
  onSave
}) {
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'text', 'media', 'specs'
  const [customCategoryMode, setCustomCategoryMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [newCollectionTag, setNewCollectionTag] = useState('');

  // Swatch draft
  const [newSwatchColor, setNewSwatchColor] = useState('#2b2621');
  const [newSwatchEn, setNewSwatchEn] = useState('');
  const [newSwatchKu, setNewSwatchKu] = useState('');

  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Initial Form State
  const [form, setForm] = useState({
    code: '',
    slug: '',
    type: 'home',
    categoryKey: 'living',
    categoryEn: 'Living Room',
    categoryKu: 'ژووری میوان و دانیشتن',
    categoryAr: 'غرفة المعيشة',
    productType: 'Furniture',
    collections: [],
    titleEn: '',
    titleKu: '',
    titleAr: '',
    shortDescEn: '',
    shortDescKu: '',
    shortDescAr: '',
    fullDescEn: '',
    fullDescKu: '',
    fullDescAr: '',
    images: ['/images/sofa_cloud_sectional.jpg'],
    dimensions: '',
    materialsEn: '',
    materialsKu: '',
    materialsAr: '',
    warrantyEn: '',
    warrantyKu: '',
    warrantyAr: '',
    customizationEn: '',
    customizationKu: '',
    customizationAr: '',
    swatches: [],
    featured: false,
    isNew: true,
    isBestseller: false,
    published: true
  });

  // Populate form on product load
  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      const prodType = product.type || 'home';
      const isPreset = (CATEGORY_PRESETS[prodType] || []).some((c) => c.key === product.categoryKey);
      setCustomCategoryMode(!isPreset && Boolean(product.categoryKey));

      setForm({
        code: product.code || '',
        slug: product.slug || '',
        type: prodType,
        categoryKey: product.categoryKey || (prodType === 'office' ? 'executive' : 'living'),
        categoryEn: product.category?.en || (prodType === 'office' ? 'Executive Desks' : 'Living Room'),
        categoryKu: product.category?.ku || (prodType === 'office' ? 'مێزی بەڕێوەبەرایەتی' : 'ژووری میوان و دانیشتن'),
        categoryAr: product.category?.ar || (prodType === 'office' ? 'المكاتب التنفيذية' : 'غرفة المعيشة'),
        productType: product.productType || 'Furniture',
        collections: Array.isArray(product.collections) ? [...product.collections] : [],
        titleEn: product.title?.en || '',
        titleKu: product.title?.ku || '',
        titleAr: product.title?.ar || '',
        shortDescEn: product.shortDesc?.en || '',
        shortDescKu: product.shortDesc?.ku || '',
        shortDescAr: product.shortDesc?.ar || '',
        fullDescEn: product.fullDesc?.en || '',
        fullDescKu: product.fullDesc?.ku || '',
        fullDescAr: product.fullDesc?.ar || '',
        images: Array.isArray(product.images) && product.images.length > 0 ? [...product.images] : ['/images/sofa_cloud_sectional.jpg'],
        dimensions: product.specs?.dimensions || '',
        materialsEn: product.specs?.materials?.en || '',
        materialsKu: product.specs?.materials?.ku || '',
        materialsAr: product.specs?.materials?.ar || '',
        warrantyEn: product.specs?.warranty?.en || '',
        warrantyKu: product.specs?.warranty?.ku || '',
        warrantyAr: product.specs?.warranty?.ar || '',
        customizationEn: product.specs?.customization?.en || '',
        customizationKu: product.specs?.customization?.ku || '',
        customizationAr: product.specs?.customization?.ar || '',
        swatches: Array.isArray(product.swatches) ? [...product.swatches] : [],
        featured: Boolean(product.featured),
        isNew: Boolean(product.isNew),
        isBestseller: Boolean(product.isBestseller),
        published: product.published !== false
      });
    } else {
      // New product defaults
      setCustomCategoryMode(false);
      setForm({
        code: `UF-${Date.now().toString().slice(-4)}`,
        slug: '',
        type: 'home',
        categoryKey: 'living',
        categoryEn: 'Living Room',
        categoryKu: 'ژووری میوان و دانیشتن',
        categoryAr: 'غرفة المعيشة',
        productType: 'Furniture',
        collections: ['Urban'],
        titleEn: '',
        titleKu: '',
        titleAr: '',
        shortDescEn: '',
        shortDescKu: '',
        shortDescAr: '',
        fullDescEn: '',
        fullDescKu: '',
        fullDescAr: '',
        images: ['/images/sofa_cloud_sectional.jpg'],
        dimensions: '',
        materialsEn: '',
        materialsKu: '',
        materialsAr: '',
        warrantyEn: '',
        warrantyKu: '',
        warrantyAr: '',
        customizationEn: '',
        customizationKu: '',
        customizationAr: '',
        swatches: [],
        featured: false,
        isNew: true,
        isBestseller: false,
        published: true
      });
    }
    setActiveTab('basic');
  }, [isOpen, product]);

  if (!isOpen) return null;

  // Type change handler
  const handleTypeChange = (newType) => {
    const defaultPreset = CATEGORY_PRESETS[newType]?.[0] || CATEGORY_PRESETS.home[0];
    setCustomCategoryMode(false);
    setForm((prev) => ({
      ...prev,
      type: newType,
      categoryKey: defaultPreset.key,
      categoryEn: defaultPreset.en,
      categoryKu: defaultPreset.ku,
      categoryAr: defaultPreset.ar
    }));
  };

  // Category select change
  const handleCategorySelectChange = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setCustomCategoryMode(true);
      setForm((prev) => ({
        ...prev,
        categoryKey: '',
        categoryEn: '',
        categoryKu: '',
        categoryAr: ''
      }));
    } else {
      const preset = (CATEGORY_PRESETS[form.type] || []).find((c) => c.key === val);
      if (preset) {
        setCustomCategoryMode(false);
        setForm((prev) => ({
          ...prev,
          categoryKey: preset.key,
          categoryEn: preset.en,
          categoryKu: preset.ku,
          categoryAr: preset.ar
        }));
      }
    }
  };

  // Collections tags
  const handleToggleCollection = (colName) => {
    setForm((prev) => {
      const exists = prev.collections.includes(colName);
      return {
        ...prev,
        collections: exists ? prev.collections.filter((c) => c !== colName) : [...prev.collections, colName]
      };
    });
  };

  const handleAddCustomCollection = (e) => {
    e.preventDefault();
    const trimmed = newCollectionTag.trim();
    if (trimmed && !form.collections.includes(trimmed)) {
      setForm((prev) => ({ ...prev, collections: [...prev.collections, trimmed] }));
      setNewCollectionTag('');
    }
  };

  // Image Upload Handlers
  const processAndSetCoverImage = async (file) => {
    try {
      setUploadingImage(true);
      setImageUploadError('');
      const result = await optimizeImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 });
      const currentImgs = [...(form.images || [])];
      currentImgs[0] = result.dataUrl;
      setForm((prev) => ({ ...prev, images: currentImgs }));
    } catch (err) {
      console.error('Image upload failed:', err);
      setImageUploadError(err.message || 'Failed to process image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processAndSetCoverImage(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setUploadingImage(true);
      setImageUploadError('');
      const processed = await Promise.all(
        files.map((file) => optimizeImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 }))
      );
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...processed.map((p) => p.dataUrl)]
      }));
    } catch (err) {
      console.error('Gallery upload failed:', err);
      setImageUploadError(err.message || 'Failed to process gallery photos');
    } finally {
      setUploadingImage(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleDropImage = async (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processAndSetCoverImage(file);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleMakeCoverImage = (index) => {
    if (index === 0) return;
    setForm((prev) => {
      const copy = [...prev.images];
      const [selected] = copy.splice(index, 1);
      return { ...prev, images: [selected, ...copy] };
    });
  };

  // Swatch Handlers
  const handleAddSwatch = (e) => {
    e.preventDefault();
    if (!newSwatchColor) return;
    const swatchObj = {
      color: newSwatchColor,
      name: {
        en: newSwatchEn.trim() || 'Custom Tone',
        ku: newSwatchKu.trim() || newSwatchEn.trim() || 'ڕەنگی تایبەت',
        ar: newSwatchEn.trim() || 'لون مخصص'
      }
    };
    setForm((prev) => ({
      ...prev,
      swatches: [...prev.swatches, swatchObj]
    }));
    setNewSwatchEn('');
    setNewSwatchKu('');
  };

  const handleRemoveSwatch = (idx) => {
    setForm((prev) => ({
      ...prev,
      swatches: prev.swatches.filter((_, i) => i !== idx)
    }));
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalProduct = {
      code: form.code.trim(),
      slug: form.slug.trim() || (form.titleEn || form.code).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      type: form.type,
      categoryKey: form.categoryKey || 'general',
      category: {
        en: form.categoryEn.trim() || 'General',
        ku: form.categoryKu.trim() || form.categoryEn.trim() || 'گشتی',
        ar: form.categoryAr.trim() || form.categoryEn.trim() || 'عام'
      },
      productType: form.productType.trim() || 'Furniture',
      collections: form.collections.length > 0 ? form.collections : ['Urban'],
      title: {
        en: form.titleEn.trim() || 'Bespoke Furniture',
        ku: form.titleKu.trim() || form.titleEn.trim(),
        ar: form.titleAr.trim() || form.titleEn.trim()
      },
      shortDesc: {
        en: form.shortDescEn.trim(),
        ku: form.shortDescKu.trim(),
        ar: form.shortDescAr.trim()
      },
      fullDesc: {
        en: form.fullDescEn.trim(),
        ku: form.fullDescKu.trim(),
        ar: form.fullDescAr.trim()
      },
      images: form.images.length > 0 ? form.images : ['/images/sofa_cloud_sectional.jpg'],
      specs: {
        dimensions: form.dimensions.trim(),
        materials: {
          en: form.materialsEn.trim(),
          ku: form.materialsKu.trim(),
          ar: form.materialsAr.trim()
        },
        warranty: {
          en: form.warrantyEn.trim(),
          ku: form.warrantyKu.trim(),
          ar: form.warrantyAr.trim()
        },
        customization: {
          en: form.customizationEn.trim(),
          ku: form.customizationKu.trim(),
          ar: form.customizationAr.trim()
        }
      },
      swatches: form.swatches,
      featured: Boolean(form.featured),
      isNew: Boolean(form.isNew),
      isBestseller: Boolean(form.isBestseller),
      published: Boolean(form.published)
    };

    onSave(finalProduct);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-modal-header">
          <div>
            <h3 className="admin-modal-title">
              {product ? `Edit: ${form.titleEn || form.code}` : 'Add New Furniture Piece'}
            </h3>
            <span className="admin-modal-subtitle">
              Showroom Catalog CMS · All changes sync directly to the live website
            </span>
          </div>
          <button type="button" onClick={onClose} className="admin-modal-close" aria-label="Close modal">
            <AppIcon name="close" size={16} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="admin-modal-nav">
          <button
            type="button"
            className={`admin-modal-tab-btn ${activeTab === 'basic' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            1. Identity & Categories
          </button>
          <button
            type="button"
            className={`admin-modal-tab-btn ${activeTab === 'text' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('text')}
          >
            2. Titles & Descriptions (3 Languages)
          </button>
          <button
            type="button"
            className={`admin-modal-tab-btn ${activeTab === 'media' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            3. Photography & Media ({form.images.length})
          </button>
          <button
            type="button"
            className={`admin-modal-tab-btn ${activeTab === 'specs' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            4. Specifications & Swatches ({form.swatches.length})
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="admin-modal-body">
            {/* ================= TAB 1: BASIC ================= */}
            {activeTab === 'basic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Model SKU / Code</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      required
                      placeholder="e.g. UF-H101"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Showroom Type</label>
                    <select
                      className="admin-form-select"
                      value={form.type}
                      onChange={(e) => handleTypeChange(e.target.value)}
                    >
                      <option value="home">Home Furniture (مۆبیلیاتی ماڵ)</option>
                      <option value="office">Office Furniture (مۆبیلیاتی ئۆفیس)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Product Type / Family</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={form.productType}
                      onChange={(e) => setForm({ ...form, productType: e.target.value })}
                      placeholder="e.g. Sofa, Dining Table, Bed"
                    />
                  </div>
                </div>

                {/* Category Selector */}
                <div style={{ backgroundColor: '#fafaf9', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <label className="admin-form-label" style={{ margin: 0 }}>Category / بەش</label>
                    <button
                      type="button"
                      onClick={() => setCustomCategoryMode((prev) => !prev)}
                      style={{ fontSize: '0.78rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {customCategoryMode ? '✓ Use Presets' : '✏️ Custom Category Names'}
                    </button>
                  </div>

                  <select
                    className="admin-form-select"
                    value={customCategoryMode ? '__custom__' : form.categoryKey}
                    onChange={handleCategorySelectChange}
                  >
                    <optgroup label={form.type === 'home' ? 'Home Categories (بەشەکانی ماڵ)' : 'Office Categories (بەشەکانی ئۆفیس)'}>
                      {(CATEGORY_PRESETS[form.type] || []).map((preset) => (
                        <option key={preset.key} value={preset.key}>
                          {preset.ku} — {preset.en}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Custom">
                      <option value="__custom__">➕ Custom Category / بەشێکی تر...</option>
                    </optgroup>
                  </select>

                  {customCategoryMode && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginTop: '0.85rem' }}>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Kurdish Name</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          style={{ direction: 'rtl', fontFamily: 'Zain' }}
                          value={form.categoryKu}
                          onChange={(e) => setForm({ ...form, categoryKu: e.target.value })}
                          placeholder="ناوی بەش"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">English Name</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={form.categoryEn}
                          onChange={(e) => setForm({ ...form, categoryEn: e.target.value })}
                          placeholder="Category name"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Arabic Name</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          style={{ direction: 'rtl' }}
                          value={form.categoryAr}
                          onChange={(e) => setForm({ ...form, categoryAr: e.target.value })}
                          placeholder="اسم الفئة"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Category Slug Key</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={form.categoryKey}
                          onChange={(e) => setForm({ ...form, categoryKey: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                          placeholder="e.g. custom-living"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Collections / Filter Tags */}
                <div>
                  <label className="admin-form-label">Collections & Room Tags (Used in Homepage and Catalogue Filters)</label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                    {COMMON_COLLECTIONS.map((col) => {
                      const isSelected = form.collections.includes(col);
                      return (
                        <button
                          type="button"
                          key={col}
                          onClick={() => handleToggleCollection(col)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            border: isSelected ? '1px solid #18181b' : '1px solid #e4e4e7',
                            backgroundColor: isSelected ? '#18181b' : '#ffffff',
                            color: isSelected ? '#ffffff' : '#52525b',
                            cursor: 'pointer'
                          }}
                        >
                          {isSelected ? `✓ ${col}` : `+ ${col}`}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem' }}>
                    <input
                      type="text"
                      className="admin-form-input"
                      style={{ height: '36px', maxWidth: '240px', fontSize: '0.8rem' }}
                      value={newCollectionTag}
                      onChange={(e) => setNewCollectionTag(e.target.value)}
                      placeholder="Add custom collection tag..."
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomCollection}
                      style={{
                        padding: '0 0.85rem',
                        height: '36px',
                        borderRadius: '6px',
                        border: '1px solid #e4e4e7',
                        backgroundColor: '#f4f4f5',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Add Tag
                    </button>
                  </div>
                </div>

                {/* Visibility & Badges Flags */}
                <div style={{ backgroundColor: '#fafaf9', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '1rem' }}>
                  <label className="admin-form-label" style={{ marginBottom: '0.75rem' }}>Visibility & Showcase Flags</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={form.published}
                        onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      />
                      <span>Published (Live on website)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      />
                      <span>Featured (Homepage Showcase)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={form.isNew}
                        onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                      />
                      <span>Mark as New Arrival (NEW badge)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={form.isBestseller}
                        onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })}
                      />
                      <span>Mark as Bestseller</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: TITLES & DESCRIPTIONS ================= */}
            {activeTab === 'text' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* English */}
                <div style={{ border: '1px solid #e4e4e7', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.84rem', color: '#18181b', marginBottom: '0.65rem' }}>English Content</div>
                  <div className="admin-form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="admin-form-label">Title (English)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={form.titleEn}
                      onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                      required
                      placeholder="e.g. Cloud Modular Sectional Sofa"
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="admin-form-label">Short Summary (English)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={form.shortDescEn}
                      onChange={(e) => setForm({ ...form, shortDescEn: e.target.value })}
                      placeholder="e.g. Sculptural curved lounge upholstered in tactile bouclé..."
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Full Editorial Description (English)</label>
                    <textarea
                      className="admin-form-textarea"
                      value={form.fullDescEn}
                      onChange={(e) => setForm({ ...form, fullDescEn: e.target.value })}
                      placeholder="Detailed craftsmanship narrative for product page..."
                    />
                  </div>
                </div>

                {/* Kurdish Sorani */}
                <div style={{ border: '1px solid #e4e4e7', borderRadius: '10px', padding: '1rem', backgroundColor: '#fafaf8' }}>
                  <div style={{ fontSize: '0.84rem', color: '#18181b', marginBottom: '0.65rem' }}>Kurdish Sorani (کوردی)</div>
                  <div className="admin-form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="admin-form-label">Title (Kurdish - Zain)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      style={{ direction: 'rtl', fontFamily: 'Zain' }}
                      value={form.titleKu}
                      onChange={(e) => setForm({ ...form, titleKu: e.target.value })}
                      placeholder="ناوی بەرهەم بە کوردی"
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="admin-form-label">Short Summary (Kurdish)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      style={{ direction: 'rtl', fontFamily: 'Zain' }}
                      value={form.shortDescKu}
                      onChange={(e) => setForm({ ...form, shortDescKu: e.target.value })}
                      placeholder="کورتەی بەرهەم بە کوردی"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Full Description (Kurdish)</label>
                    <textarea
                      className="admin-form-textarea"
                      style={{ direction: 'rtl', fontFamily: 'Zain' }}
                      value={form.fullDescKu}
                      onChange={(e) => setForm({ ...form, fullDescKu: e.target.value })}
                      placeholder="وەسفی تەواوی بەرهەم بە زمانی کوردی..."
                    />
                  </div>
                </div>

                {/* Arabic */}
                <div style={{ border: '1px solid #e4e4e7', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.84rem', color: '#18181b', marginBottom: '0.65rem' }}>Arabic (العربية)</div>
                  <div className="admin-form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="admin-form-label">Title (Arabic)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      style={{ direction: 'rtl' }}
                      value={form.titleAr}
                      onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                      placeholder="اسم المنتج بالعربية"
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="admin-form-label">Short Summary (Arabic)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      style={{ direction: 'rtl' }}
                      value={form.shortDescAr}
                      onChange={(e) => setForm({ ...form, shortDescAr: e.target.value })}
                      placeholder="ملخص قصير بالعربية"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Full Description (Arabic)</label>
                    <textarea
                      className="admin-form-textarea"
                      style={{ direction: 'rtl' }}
                      value={form.fullDescAr}
                      onChange={(e) => setForm({ ...form, fullDescAr: e.target.value })}
                      placeholder="الوصف الكامل للمنتج بالعربية..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: MEDIA ================= */}
            {activeTab === 'media' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {imageUploadError && (
                  <div style={{ padding: '0.6rem 0.85rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '7px', color: '#dc2626', fontSize: '0.82rem' }}>
                    {imageUploadError}
                  </div>
                )}

                {/* Cover Image + Upload Dropzone */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {/* Current Cover Preview */}
                  <div style={{ border: '1px solid #e4e4e7', borderRadius: '10px', padding: '0.85rem', backgroundColor: '#fafaf9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="admin-form-label" style={{ margin: 0 }}>Cover Image (Main)</span>
                      {uploadingImage && <span style={{ fontSize: '0.74rem', color: '#71717a' }}>Processing...</span>}
                    </div>
                    <div style={{ width: '100%', height: '170px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f4f4f5', border: '1px solid #e4e4e7' }}>
                      <img
                        src={form.images[0] || '/product_placeholder.jpg'}
                        alt="Cover"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        style={{
                          flex: 1,
                          height: '36px',
                          borderRadius: '6px',
                          border: '1px solid #e4e4e7',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>

                  {/* Dropzone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={handleDropImage}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: isDraggingOver ? '2px dashed #18181b' : '2px dashed #d4d4d8',
                      backgroundColor: isDraggingOver ? '#f4f4f5' : '#ffffff',
                      borderRadius: '10px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      cursor: 'pointer',
                      gap: '0.4rem',
                      minHeight: '170px'
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      style={{ display: 'none' }}
                    />
                    <AppIcon name="external" size={24} />
                    <span style={{ fontSize: '0.88rem', color: '#18181b' }}>Upload Photo from Phone / PC</span>
                    <span style={{ fontSize: '0.76rem', color: '#71717a' }}>یان وێنەیەک ڕابکێشە ئێرە (Drag & Drop)</span>
                    <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>Auto-compressed for ultra-fast loading</span>
                  </div>
                </div>

                {/* Multi-Image Gallery List */}
                <div style={{ border: '1px solid #e4e4e7', borderRadius: '10px', padding: '1rem', backgroundColor: '#fafaf9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="admin-form-label" style={{ margin: 0 }}>
                      Product Photo Gallery ({form.images.length} Photos)
                    </span>
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #18181b',
                        backgroundColor: '#18181b',
                        color: '#ffffff',
                        fontSize: '0.76rem',
                        cursor: 'pointer'
                      }}
                    >
                      + Add More Photos
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                    {form.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: '84px',
                          height: '84px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          position: 'relative',
                          border: idx === 0 ? '2px solid #18181b' : '1px solid #d4d4d8',
                          backgroundColor: '#f4f4f5'
                        }}
                      >
                        <img src={imgUrl} alt={`gallery-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {idx === 0 && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              backgroundColor: 'rgba(24, 24, 27, 0.85)',
                              color: '#ffffff',
                              fontSize: '0.62rem',
                              textAlign: 'center',
                              padding: '2px 0'
                            }}
                          >
                            Cover
                          </span>
                        )}
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleMakeCoverImage(idx)}
                            style={{
                              position: 'absolute',
                              bottom: '2px',
                              left: '2px',
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '3px',
                              fontSize: '0.62rem',
                              padding: '2px 4px',
                              cursor: 'pointer'
                            }}
                            title="Make cover photo"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '11px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Delete photo"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Showroom Library Presets */}
                <div>
                  <span className="admin-form-label" style={{ marginBottom: '0.4rem' }}>Or pick from showroom interior presets:</span>
                  <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
                    {AVAILABLE_SHOWROOM_IMAGES.map((img) => (
                      <button
                        type="button"
                        key={img}
                        onClick={() => setForm((prev) => ({ ...prev, images: [img, ...prev.images.filter((i) => i !== img)] }))}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: form.images[0] === img ? '2px solid #18181b' : '1px solid #e4e4e7',
                          padding: 0,
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        <img src={img} alt="preset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* URL Paste */}
                <div style={{ borderTop: '1px dashed #e4e4e7', paddingTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput((p) => !p)}
                    style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    {showUrlInput ? '▼ Hide web URL input' : '▶ Advanced: Paste direct web image URL'}
                  </button>
                  {showUrlInput && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <input
                        type="text"
                        className="admin-form-input"
                        placeholder="https://images.unsplash.com/..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (e.target.value.trim()) {
                              setForm((prev) => ({ ...prev, images: [...prev.images, e.target.value.trim()] }));
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '2px', display: 'block' }}>
                        Type or paste image URL and press Enter
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 4: SPECS & SWATCHES ================= */}
            {activeTab === 'specs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Dimensions */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Dimensions (W × D × H)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={form.dimensions}
                    onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                    placeholder="e.g. 340cm (W) × 180cm (D) × 78cm (H)"
                  />
                </div>

                {/* Materials (3 languages) */}
                <div style={{ border: '1px solid #e4e4e7', borderRadius: '10px', padding: '1rem' }}>
                  <label className="admin-form-label" style={{ marginBottom: '0.5rem' }}>Craftsmanship Materials</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label" style={{ fontSize: '0.76rem' }}>English</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={form.materialsEn}
                        onChange={(e) => setForm({ ...form, materialsEn: e.target.value })}
                        placeholder="Solid Walnut, French Bouclé..."
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label" style={{ fontSize: '0.76rem' }}>Kurdish</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        style={{ direction: 'rtl', fontFamily: 'Zain' }}
                        value={form.materialsKu}
                        onChange={(e) => setForm({ ...form, materialsKu: e.target.value })}
                        placeholder="داری گوێز، قوماشی بۆکلێ..."
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label" style={{ fontSize: '0.76rem' }}>Arabic</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        style={{ direction: 'rtl' }}
                        value={form.materialsAr}
                        onChange={(e) => setForm({ ...form, materialsAr: e.target.value })}
                        placeholder="خشب الجوز، قماش بوكليه..."
                      />
                    </div>
                  </div>
                </div>

                {/* Warranty & Customization */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Warranty / Guarantee Note</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={form.warrantyEn}
                      onChange={(e) => setForm({ ...form, warrantyEn: e.target.value })}
                      placeholder="e.g. Structural & Upholstery Guarantee"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Customization Options Note</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={form.customizationEn}
                      onChange={(e) => setForm({ ...form, customizationEn: e.target.value })}
                      placeholder="e.g. Custom dimensions and fabric swatches available"
                    />
                  </div>
                </div>

                {/* Color & Fabric Swatches */}
                <div style={{ border: '1px solid #e4e4e7', borderRadius: '10px', padding: '1rem', backgroundColor: '#fafaf9' }}>
                  <label className="admin-form-label" style={{ marginBottom: '0.5rem' }}>
                    Color & Fabric Swatches ({form.swatches.length})
                  </label>

                  {/* Existing Swatches */}
                  {form.swatches.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {form.swatches.map((sw, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            border: '1px solid #e4e4e7',
                            backgroundColor: '#ffffff',
                            fontSize: '0.78rem'
                          }}
                        >
                          <span
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              backgroundColor: sw.color,
                              border: '1px solid rgba(0,0,0,0.15)'
                            }}
                          />
                          <span>{sw.name?.en || sw.name?.ku || sw.color}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSwatch(idx)}
                            style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: 0 }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Swatch Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <input
                      type="color"
                      value={newSwatchColor}
                      onChange={(e) => setNewSwatchColor(e.target.value)}
                      style={{ width: '38px', height: '36px', border: '1px solid #d4d4d8', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                      title="Choose swatch color"
                    />
                    <input
                      type="text"
                      className="admin-form-input"
                      style={{ height: '36px', maxWidth: '160px', fontSize: '0.8rem' }}
                      value={newSwatchEn}
                      onChange={(e) => setNewSwatchEn(e.target.value)}
                      placeholder="Color name (English)"
                    />
                    <input
                      type="text"
                      className="admin-form-input"
                      style={{ height: '36px', maxWidth: '160px', fontSize: '0.8rem', direction: 'rtl', fontFamily: 'Zain' }}
                      value={newSwatchKu}
                      onChange={(e) => setNewSwatchKu(e.target.value)}
                      placeholder="ناوی ڕەنگ (کوردی)"
                    />
                    <button
                      type="button"
                      onClick={handleAddSwatch}
                      style={{
                        height: '36px',
                        padding: '0 0.85rem',
                        borderRadius: '6px',
                        border: '1px solid #18181b',
                        backgroundColor: '#18181b',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontSize: '0.78rem'
                      }}
                    >
                      + Add Swatch
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="admin-modal-footer">
            <button
              type="button"
              onClick={onClose}
              style={{
                height: '40px',
                padding: '0 1.25rem',
                borderRadius: '8px',
                border: '1px solid #d4d4d8',
                backgroundColor: '#ffffff',
                color: '#52525b',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-btn-primary"
            >
              {product ? '✓ Save Changes' : '+ Add to Showroom Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
