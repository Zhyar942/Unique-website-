import React, { useState, useRef } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useCatalog } from '../../context/CatalogContext';
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
    {
      key: 'living',
      en: 'Living Room',
      ku: 'ژووری میوان و دانیشتن',
      ar: 'غرفة المعيشة'
    },
    {
      key: 'dining',
      en: 'Dining Room',
      ku: 'ژووری نانخواردن',
      ar: 'غرفة الطعام'
    },
    {
      key: 'bedroom',
      en: 'Bedroom',
      ku: 'ژووری نووستن',
      ar: 'غرفة النوم'
    },
    {
      key: 'coffeeTables',
      en: 'Coffee Tables',
      ku: 'مێزی ناوەڕاست',
      ar: 'طاولات الوسط'
    },
    {
      key: 'tvUnits',
      en: 'TV Units',
      ku: 'مێزی تەلەفزیۆن',
      ar: 'طاولات التلفزيون'
    },
    {
      key: 'storage',
      en: 'Storage & Cabinets',
      ku: 'دۆڵاب و ڕەفە',
      ar: 'الخزائن والرفوف'
    }
  ],
  office: [
    {
      key: 'executive',
      en: 'Executive Desks',
      ku: 'مێزی بەڕێوەبەرایەتی',
      ar: 'المكاتب التنفيذية'
    },
    {
      key: 'meeting',
      en: 'Meeting Tables',
      ku: 'ژووری کۆبوونەوە',
      ar: 'طاولات الاجتماعات'
    },
    {
      key: 'chairs',
      en: 'Office & Lounge Chairs',
      ku: 'کورسی ئۆفیس و پشوودان',
      ar: 'كراسي الراحة والعمل'
    },
    {
      key: 'storage',
      en: 'Office Storage',
      ku: 'دۆڵاب و کەنتۆری ئۆفیس',
      ar: 'خزائن المكاتب'
    }
  ]
};

const AdminDashboard = () => {
  const { navigate } = useRouter();
  const { isAuthenticated, logout, adminUser } = useAdminAuth();
  const {
    products,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    togglePublish,
    toggleFeatured,
    toggleNewArrival,
    updateSettings,
    resetCatalogToDefaults
  } = useCatalog();

  const [activeTab, setActiveTab] = useState('products'); // 'dashboard', 'products', 'settings'
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [customCategoryMode, setCustomCategoryMode] = useState(false);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [productForm, setProductForm] = useState({
    titleEn: '',
    titleKu: '',
    titleAr: '',
    code: '',
    type: 'home',
    categoryKey: 'living',
    categoryEn: 'Living Room',
    categoryKu: 'ژووری میوان و دانیشتن',
    categoryAr: 'غرفة المعيشة',
    dimensions: '',
    materialsEn: '',
    materialsKu: '',
    materialsAr: '',
    shortDescEn: '',
    shortDescKu: '',
    shortDescAr: '',
    images: ['/images/sofa_cloud_sectional.jpg'],
    featured: false,
    isNew: true,
    published: true
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    phoneDisplay: settings.phoneDisplay || '0772 975 4844',
    phoneTechnical: settings.phoneTechnical || '+9647729754844',
    whatsappDisplay: settings.whatsappDisplay || '0772 975 4844',
    whatsappNumber: settings.whatsappNumber || '9647729754844',
    instagramUrl: settings.instagram?.url || 'https://www.instagram.com/unique.furniture.iq',
    instagramHandle: settings.instagram?.handle || '@unique.furniture.iq',
    addressKu: settings.showroom?.addressKu || '',
    addressAr: settings.showroom?.addressAr || '',
    addressEn: settings.showroom?.addressEn || '',
    hoursKu: settings.showroom?.hoursKu || '',
    hoursAr: settings.showroom?.hoursAr || '',
    hoursEn: settings.showroom?.hoursEn || ''
  });

  const [settingsSaved, setSettingsSaved] = useState(false);

  // Authentication Guard: Redirect to /admin/login if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Handle Type Filter Change
  const handleTypeFilterChange = (newType) => {
    setTypeFilter(newType);
    setCategoryFilter('all');
  };

  // Compute Categories available for current filter / catalog
  const availableCategories = React.useMemo(() => {
    const targetTypeProducts = typeFilter === 'all' ? products : products.filter((p) => p.type === typeFilter);
    const map = new Map();
    const presetList = typeFilter === 'all'
      ? [...CATEGORY_PRESETS.home, ...CATEGORY_PRESETS.office]
      : (CATEGORY_PRESETS[typeFilter] || []);

    presetList.forEach((item) => {
      if (!map.has(item.key)) {
        map.set(item.key, { key: item.key, ku: item.ku, en: item.en });
      }
    });

    targetTypeProducts.forEach((p) => {
      if (p.categoryKey && !map.has(p.categoryKey)) {
        map.set(p.categoryKey, {
          key: p.categoryKey,
          ku: p.category?.ku || p.categoryKey,
          en: p.category?.en || p.categoryKey
        });
      }
    });

    return Array.from(map.values());
  }, [products, typeFilter]);

  if (!isAuthenticated) {
    return null;
  }

  // Filter Products
  const filteredProducts = products.filter((p) => {
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || p.categoryKey === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.code?.toLowerCase().includes(q) ||
      p.title?.en?.toLowerCase().includes(q) ||
      p.title?.ku?.toLowerCase().includes(q) ||
      p.title?.ar?.toLowerCase().includes(q) ||
      p.category?.en?.toLowerCase().includes(q) ||
      p.category?.ku?.toLowerCase().includes(q) ||
      p.category?.ar?.toLowerCase().includes(q);
    return matchesType && matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setCustomCategoryMode(false);
    const defaultPreset = CATEGORY_PRESETS.home[0];
    setProductForm({
      titleEn: '',
      titleKu: '',
      titleAr: '',
      code: `UF-${Date.now().toString().slice(-4)}`,
      type: 'home',
      categoryKey: defaultPreset.key,
      categoryEn: defaultPreset.en,
      categoryKu: defaultPreset.ku,
      categoryAr: defaultPreset.ar,
      dimensions: '220cm (W) × 95cm (D) × 75cm (H)',
      materialsEn: 'Solid American Walnut, High-Resilience Fabric',
      materialsKu: 'داری گوێزی ئەمریکی، قوماشی دژە-پەڵە',
      materialsAr: 'خشب الجوز الأمريكي، أقمشة فاخرة',
      shortDescEn: 'Bespoke modern craftsmanship tailored for elegant spaces.',
      shortDescKu: 'دیزاینێکی سەردەمیانە و تایبەت بە کەرەستەی بەرز.',
      shortDescAr: 'تصميم أنيق وعصري ملائم للمساحات الراقية.',
      images: ['/images/sofa_cloud_sectional.jpg'],
      featured: false,
      isNew: true,
      published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProductId(prod.id);
    const prodType = prod.type || 'home';
    const isPreset = (CATEGORY_PRESETS[prodType] || []).some((c) => c.key === prod.categoryKey);
    setCustomCategoryMode(!isPreset && Boolean(prod.categoryKey));
    setProductForm({
      titleEn: prod.title?.en || '',
      titleKu: prod.title?.ku || '',
      titleAr: prod.title?.ar || '',
      code: prod.code || '',
      type: prodType,
      categoryKey: prod.categoryKey || (prodType === 'office' ? 'executive' : 'living'),
      categoryEn: prod.category?.en || (prodType === 'office' ? 'Executive Desks' : 'Living Room'),
      categoryKu: prod.category?.ku || (prodType === 'office' ? 'مێزی بەڕێوەبەرایەتی' : 'ژووری میوان و دانیشتن'),
      categoryAr: prod.category?.ar || (prodType === 'office' ? 'المكاتب التنفيذية' : 'غرفة المعيشة'),
      dimensions: prod.specs?.dimensions || '',
      materialsEn: prod.specs?.materials?.en || '',
      materialsKu: prod.specs?.materials?.ku || '',
      materialsAr: prod.specs?.materials?.ar || '',
      shortDescEn: prod.shortDesc?.en || '',
      shortDescKu: prod.shortDesc?.ku || '',
      shortDescAr: prod.shortDesc?.ar || '',
      images: prod.images || ['/images/sofa_cloud_sectional.jpg'],
      featured: !!prod.featured,
      isNew: !!prod.isNew,
      published: prod.published !== false
    });
    setIsModalOpen(true);
  };

  const handleTypeChange = (newType) => {
    const defaultPreset = CATEGORY_PRESETS[newType]?.[0] || CATEGORY_PRESETS.home[0];
    setCustomCategoryMode(false);
    setProductForm((prev) => ({
      ...prev,
      type: newType,
      categoryKey: defaultPreset.key,
      categoryEn: defaultPreset.en,
      categoryKu: defaultPreset.ku,
      categoryAr: defaultPreset.ar
    }));
  };

  const handleCategorySelectChange = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setCustomCategoryMode(true);
      setProductForm((prev) => ({
        ...prev,
        categoryKey: '',
        categoryEn: '',
        categoryKu: '',
        categoryAr: ''
      }));
    } else {
      const preset = (CATEGORY_PRESETS[productForm.type] || []).find((c) => c.key === val);
      if (preset) {
        setCustomCategoryMode(false);
        setProductForm((prev) => ({
          ...prev,
          categoryKey: preset.key,
          categoryEn: preset.en,
          categoryKu: preset.ku,
          categoryAr: preset.ar
        }));
      }
    }
  };

  const processAndSetCoverImage = async (file) => {
    try {
      setUploadingImage(true);
      setImageUploadError('');
      const result = await optimizeImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 });
      const currentImgs = [...(productForm.images || [])];
      currentImgs[0] = result.dataUrl;
      setProductForm((prev) => ({
        ...prev,
        images: currentImgs
      }));
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
      const newUrls = processed.map((p) => p.dataUrl);
      setProductForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls]
      }));
    } catch (err) {
      console.error('Gallery upload failed:', err);
      setImageUploadError(err.message || 'Failed to process additional photos');
    } finally {
      setUploadingImage(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = (productForm.images || []).filter((_, idx) => idx !== indexToRemove);
    setProductForm((prev) => ({
      ...prev,
      images: updated.length ? updated : ['/category_placeholder.jpg']
    }));
  };

  const handleDropImage = async (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      await processAndSetCoverImage(file);
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    let finalKey = (productForm.categoryKey || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!finalKey) {
      if (productForm.categoryEn) {
        finalKey = productForm.categoryEn.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      } else {
        finalKey = productForm.type === 'office' ? 'executive' : 'living';
      }
    }

    const defaultPreset = (CATEGORY_PRESETS[productForm.type] || []).find((c) => c.key === finalKey) || {};

    const productPayload = {
      code: productForm.code,
      type: productForm.type,
      categoryKey: finalKey,
      featured: productForm.featured,
      isNew: productForm.isNew,
      published: productForm.published,
      images: productForm.images,
      title: {
        en: productForm.titleEn || 'Modern Furniture Piece',
        ku: productForm.titleKu || 'مۆدێلی مۆبیلیاتی نوێ',
        ar: productForm.titleAr || 'قطعة أثاث عصرية'
      },
      category: {
        en: productForm.categoryEn || defaultPreset.en || 'Living Room',
        ku: productForm.categoryKu || defaultPreset.ku || 'ژووری میوان و دانیشتن',
        ar: productForm.categoryAr || defaultPreset.ar || 'غرفة المعيشة'
      },
      shortDesc: {
        en: productForm.shortDescEn,
        ku: productForm.shortDescKu,
        ar: productForm.shortDescAr
      },
      fullDesc: {
        en: productForm.shortDescEn,
        ku: productForm.shortDescKu,
        ar: productForm.shortDescAr
      },
      specs: {
        dimensions: productForm.dimensions,
        materials: {
          en: productForm.materialsEn,
          ku: productForm.materialsKu,
          ar: productForm.materialsAr
        },
        warranty: {
          en: 'Structural Guarantee',
          ku: 'دەستەبەری پێکهاتە',
          ar: 'ضمان الهيكل'
        },
        customization: {
          en: 'Custom dimensions and swatches available',
          ku: 'دەستکاریکردنی قەبارە و ڕەنگ بەردەستە',
          ar: 'إمكانية التعديل متوفرة'
        }
      },
      swatches: [
        { name: { en: 'Walnut', ku: 'داری گوێز', ar: 'خشب الجوز' }, color: '#4a3525' },
        { name: { en: 'Natural Cream', ku: 'کرێمی سروشتی', ar: 'كريمي طبيعي' }, color: '#f3eee6' }
      ]
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings({
      phoneDisplay: settingsForm.phoneDisplay,
      phoneTechnical: settingsForm.phoneTechnical,
      whatsappDisplay: settingsForm.whatsappDisplay,
      whatsappNumber: settingsForm.whatsappNumber,
      instagram: {
        ...settings.instagram,
        url: settingsForm.instagramUrl,
        handle: settingsForm.instagramHandle
      },
      showroom: {
        ...settings.showroom,
        addressKu: settingsForm.addressKu,
        addressAr: settingsForm.addressAr,
        addressEn: settingsForm.addressEn,
        hoursKu: settingsForm.hoursKu,
        hoursAr: settingsForm.hoursAr,
        hoursEn: settingsForm.hoursEn
      }
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="admin-layout" style={{ direction: 'ltr' }}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'is-open' : ''}`}>
        {/* Logo and Brand */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <img
              src="/brand/unique-logo-dark.svg"
              alt="Unique Furniture"
              style={{
                height: '32px',
                marginBottom: '0.5rem',
                display: 'block'
              }}
            />
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--brand-orange)',
                textTransform: 'uppercase'
              }}
            >
              Showroom CMS
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="admin-menu-toggle"
            aria-label="Close admin menu"
            style={{
              width: '34px',
              height: '34px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '6px'
            }}
          >
            <AppIcon name="close" size={16} />
          </button>
        </div>

        {/* Navigation items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setMobileSidebarOpen(false);
            }}
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'is-active' : ''}`}
          >
            <AppIcon name="dashboard" size={18} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              setMobileSidebarOpen(false);
            }}
            className={`admin-nav-item ${activeTab === 'products' ? 'is-active' : ''}`}
          >
            <AppIcon name="package" size={18} />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('settings');
              setMobileSidebarOpen(false);
            }}
            className={`admin-nav-item ${activeTab === 'settings' ? 'is-active' : ''}`}
          >
            <AppIcon name="settings" size={18} />
            <span>Showroom & Contact</span>
          </button>
        </nav>

        {/* User and Logout */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-orange)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              UF
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                {adminUser.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                {adminUser.role}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="admin-nav-item"
            style={{ color: '#f87171' }}
          >
            <AppIcon name="logout" size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen((prev) => !prev)}
              className="admin-menu-toggle"
              aria-label="Toggle admin navigation menu"
            >
              <AppIcon name={mobileSidebarOpen ? 'close' : 'menu'} size={18} />
            </button>
            <h2 style={{ fontSize: 'clamp(0.95rem, 3vw, 1.25rem)', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeTab === 'dashboard' && 'Showroom Overview'}
              {activeTab === 'products' && 'Product Catalogue'}
              {activeTab === 'settings' && 'Showroom Settings'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#0f172a',
                padding: '0.45rem 0.85rem',
                backgroundColor: '#f1f5f9',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              <span className="desktop-only-block">View Public Showroom</span>
              <span className="mobile-only-block">Showroom</span>
              <AppIcon name="external" size={13} />
            </a>
          </div>
        </header>

        {/* Content Body */}
        <main className="admin-content">
          {/* ================= TAB 1: DASHBOARD OVERVIEW ================= */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
                <div className="admin-card">
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                    Total Products
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                    {products.length}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.25rem' }}>
                    ✓ Active in catalogue
                  </div>
                </div>

                <div className="admin-card">
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                    Home Furniture
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                    {products.filter((p) => p.type === 'home').length}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Living, dining, bedroom
                  </div>
                </div>

                <div className="admin-card">
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                    Office Furniture
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                    {products.filter((p) => p.type === 'office').length}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Executive, meeting, seating
                  </div>
                </div>

                <div className="admin-card">
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                    Featured Pieces
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--brand-orange)', marginTop: '0.25rem' }}>
                    {products.filter((p) => p.featured).length}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Highlighted on homepage
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                    Quick Management Actions
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                    Add new showroom inventory or manage public contact information.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      handleOpenAddModal();
                    }}
                    className="btn btn-brand"
                    style={{
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      minHeight: '40px',
                      padding: '0.5rem 1.15rem'
                    }}
                  >
                    <AppIcon name="plus" size={16} />
                    <span>Add New Furniture</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="btn btn-secondary"
                    style={{
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      minHeight: '40px',
                      padding: '0.5rem 1.15rem'
                    }}
                  >
                    <AppIcon name="settings" size={16} />
                    <span>Showroom Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PRODUCT CATALOGUE ================= */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Top Filter and Search Bar */}
              <div
                className="admin-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: '1 1 240px', minWidth: 0, flexWrap: 'wrap' }}>
                  {/* Search */}
                  <div style={{ position: 'relative', flex: '1 1 180px', minWidth: 0 }}>
                    <span style={{ position: 'absolute', top: '11px', left: '12px', display: 'flex', alignItems: 'center' }}>
                      <AppIcon name="search" size={16} color="var(--brand-orange)" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name or SKU..."
                      className="neu-input"
                      style={{
                        height: '40px',
                        paddingLeft: '38px',
                        paddingRight: '12px',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  {/* Type Filter Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      backgroundColor: 'var(--bg-primary)',
                      padding: '3px',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-pressed-subtle)',
                      border: '1px solid var(--border-subtle)',
                      flexShrink: 0,
                      gap: '2px'
                    }}
                  >
                    {['all', 'home', 'office'].map((t) => (
                      <button
                        key={t}
                        onClick={() => handleTypeFilterChange(t)}
                        style={{
                          padding: '0.4rem 0.85rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: typeFilter === t ? 700 : 500,
                          backgroundColor: typeFilter === t ? '#ffffff' : 'transparent',
                          color: typeFilter === t ? 'var(--brand-orange)' : 'var(--text-secondary)',
                          boxShadow: typeFilter === t ? 'var(--shadow-raised-sm)' : 'none',
                          border: typeFilter === t ? '1px solid var(--border-subtle)' : '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'background-color var(--duration-hover) ease, color var(--duration-hover) ease, box-shadow var(--duration-hover) ease'
                        }}
                      >
                        {t === 'all' ? 'All' : t === 'home' ? 'Home' : 'Office'}
                      </button>
                    ))}
                  </div>

                  {/* Category Filter Dropdown */}
                  <div style={{ flexShrink: 0 }}>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      aria-label="Filter products by category"
                      style={{
                        height: '40px',
                        padding: '0 0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        backgroundColor: categoryFilter === 'all' ? 'var(--bg-primary)' : '#fff7ed',
                        color: categoryFilter === 'all' ? 'var(--text-secondary)' : 'var(--brand-orange)',
                        border: categoryFilter === 'all' ? '1px solid var(--border-subtle)' : '1px solid var(--brand-orange)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="all">All Categories (هەموو بەشەکان)</option>
                      {availableCategories.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.ku} ({c.en})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleOpenAddModal}
                  className="btn btn-brand"
                  style={{
                    minHeight: '40px',
                    padding: '0 1rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    flexShrink: 0
                  }}
                >
                  <AppIcon name="plus" size={16} />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Desktop Table View (screens >= 768px) */}
              <div className="admin-table-desktop admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Image</th>
                      <th>Product Title & Code</th>
                      <th>Type & Category</th>
                      <th>Visibility</th>
                      <th>Featured</th>
                      <th>New</th>
                      <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                          No furniture pieces found matching your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => (
                        <tr key={prod.id}>
                          <td>
                            <div
                              style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #e2e8f0'
                              }}
                            >
                              <img
                                src={prod.images?.[0] || '/images/sofa_cloud_sectional.jpg'}
                                alt={prod.title?.en}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                          </td>

                          <td>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>
                              {prod.title?.en}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '0.5rem', marginTop: '2px' }}>
                              <span style={{ fontFamily: 'monospace', color: '#0284c7', fontWeight: 600 }}>
                                {prod.code}
                              </span>
                              <span>·</span>
                              <span style={{ direction: 'rtl' }}>{prod.title?.ku}</span>
                            </div>
                          </td>

                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  backgroundColor: prod.type === 'home' ? '#fef3c7' : '#e0e7ff',
                                  color: prod.type === 'home' ? '#b45309' : '#3730a3'
                                }}
                              >
                                {prod.type === 'home' ? 'Home' : 'Office'}
                              </span>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  backgroundColor: '#f1f5f9',
                                  color: '#334155'
                                }}
                              >
                                {prod.category?.ku || prod.category?.en || prod.categoryKey}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '3px' }}>
                              {prod.category?.en}
                            </div>
                          </td>

                          <td>
                            <button
                              onClick={() => togglePublish(prod.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: prod.published !== false ? '#dcfce7' : '#fee2e2',
                                color: prod.published !== false ? '#15803d' : '#b91c1c'
                              }}
                            >
                              {prod.published !== false ? (
                                <>
                                  <AppIcon name="check" size={13} />
                                  <span>Published</span>
                                </>
                              ) : (
                                <>
                                  <AppIcon name="close" size={13} />
                                  <span>Draft</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td>
                            <button
                              onClick={() => toggleFeatured(prod.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: prod.featured ? '#f59e0b' : '#cbd5e1'
                              }}
                              title={prod.featured ? 'Featured on homepage' : 'Not featured'}
                            >
                              <AppIcon name="star" size={17} set={prod.featured ? 'bold' : 'light'} color={prod.featured ? '#f59e0b' : '#cbd5e1'} />
                            </button>
                          </td>

                          <td>
                            <button
                              onClick={() => toggleNewArrival(prod.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                              title={prod.isNew ? 'Marked as New' : 'Standard catalog'}
                            >
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  padding: '2px 7px',
                                  borderRadius: '4px',
                                  backgroundColor: prod.isNew ? 'rgba(255, 102, 0, 0.12)' : '#f1f5f9',
                                  color: prod.isNew ? 'var(--brand-orange)' : '#94a3b8',
                                  display: 'inline-block'
                                }}
                              >
                                {prod.isNew ? 'NEW' : '—'}
                              </span>
                            </button>
                          </td>

                          <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => handleOpenEditModal(prod)}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '6px',
                                  backgroundColor: '#f1f5f9',
                                  color: '#334155',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                                title="Edit Product"
                              >
                                <AppIcon name="edit" size={15} />
                              </button>

                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete ${prod.title?.en}?`)) {
                                    deleteProduct(prod.id);
                                  }
                                }}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '6px',
                                  backgroundColor: '#fee2e2',
                                  color: '#dc2626',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                                title="Delete Product"
                              >
                                <AppIcon name="delete" size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View (screens < 768px) */}
              <div className="admin-cards-mobile" style={{ display: 'none' }}>
                {filteredProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    No furniture pieces found matching your filter.
                  </div>
                ) : (
                  filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                        <div
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            flexShrink: 0
                          }}
                        >
                          <img
                            src={prod.images?.[0] || '/images/sofa_cloud_sectional.jpg'}
                            alt={prod.title?.en}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', lineHeight: 1.3 }}>
                            {prod.title?.en}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: '0.4rem', marginTop: '3px', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'monospace', color: '#0284c7', fontWeight: 600 }}>
                              {prod.code}
                            </span>
                            <span>·</span>
                            <span style={{ direction: 'rtl' }}>{prod.title?.ku}</span>
                          </div>
                          <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span
                              style={{
                                padding: '2px 7px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                backgroundColor: prod.type === 'home' ? '#fef3c7' : '#e0e7ff',
                                color: prod.type === 'home' ? '#b45309' : '#3730a3'
                              }}
                            >
                              {prod.type === 'home' ? 'Home' : 'Office'}
                            </span>
                            <span
                              style={{
                                padding: '2px 7px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                backgroundColor: '#f1f5f9',
                                color: '#334155'
                              }}
                            >
                              {prod.category?.ku || prod.category?.en || prod.categoryKey}
                            </span>
                            {prod.category?.en && prod.category?.ku && (
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                ({prod.category.en})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Mobile Badges and Action Controls */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '0.65rem',
                          borderTop: '1px solid #f1f5f9',
                          gap: '0.5rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button
                            onClick={() => togglePublish(prod.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              border: 'none',
                              cursor: 'pointer',
                              backgroundColor: prod.published !== false ? '#dcfce7' : '#fee2e2',
                              color: prod.published !== false ? '#15803d' : '#b91c1c'
                            }}
                          >
                            <AppIcon name={prod.published !== false ? 'check' : 'close'} size={12} />
                            <span>{prod.published !== false ? 'Published' : 'Draft'}</span>
                          </button>

                          <button
                            onClick={() => toggleFeatured(prod.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              border: '1px solid #e2e8f0',
                              background: '#ffffff',
                              cursor: 'pointer',
                              color: prod.featured ? '#f59e0b' : '#94a3b8'
                            }}
                          >
                            <AppIcon name="star" size={13} set={prod.featured ? 'bold' : 'light'} color={prod.featured ? '#f59e0b' : '#94a3b8'} />
                            <span>Featured</span>
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#f1f5f9',
                              color: '#0f172a',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <AppIcon name="edit" size={14} />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${prod.title?.en}?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                            title="Delete Product"
                          >
                            <AppIcon name="delete" size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 3: SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
              <div className="admin-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                      Official Contact & Showroom Details
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem', marginBottom: 0 }}>
                      Changes here directly update all header buttons, contact sheets, and showroom pages.
                    </p>
                  </div>
                  {settingsSaved && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'var(--shadow-raised-sm)',
                        fontSize: '0.84rem',
                        color: '#16a34a',
                        fontWeight: 700
                      }}
                    >
                      <AppIcon name="check" size={14} color="#16a34a" />
                      <span>Saved</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                        Local Display Phone
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phoneDisplay}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phoneDisplay: e.target.value })}
                        className="neu-input"
                        style={{ height: '42px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                        Technical Phone (+964...)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phoneTechnical}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phoneTechnical: e.target.value })}
                        className="neu-input"
                        style={{ height: '42px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                        WhatsApp Display Number
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappDisplay}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappDisplay: e.target.value })}
                        className="neu-input"
                        style={{ height: '42px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                        WhatsApp Technical (e.g. 9647729754844)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="neu-input"
                        style={{ height: '42px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        value={settingsForm.instagramHandle}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                        className="neu-input"
                        style={{ height: '42px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                        Instagram Full URL
                      </label>
                      <input
                        type="text"
                        value={settingsForm.instagramUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                        className="neu-input"
                        style={{ height: '42px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                      Showroom Address (Kurdish)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.addressKu}
                      onChange={(e) => setSettingsForm({ ...settingsForm, addressKu: e.target.value })}
                      className="neu-input"
                      style={{ height: '42px', direction: 'rtl' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                      Showroom Address (Arabic)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.addressAr}
                      onChange={(e) => setSettingsForm({ ...settingsForm, addressAr: e.target.value })}
                      className="neu-input"
                      style={{ height: '42px', direction: 'rtl' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                      Showroom Address (English)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.addressEn}
                      onChange={(e) => setSettingsForm({ ...settingsForm, addressEn: e.target.value })}
                      className="neu-input"
                      style={{ height: '42px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-brand"
                    style={{
                      width: '100%',
                      minHeight: '46px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      marginTop: '1rem'
                    }}
                  >
                    <AppIcon name="save" size={17} />
                    <span>Save Configuration</span>
                  </button>
                </form>
              </div>

              {/* Reset Defaults Warning */}
              <div className="admin-card" style={{ border: '1px solid #fecaca', backgroundColor: '#fff5f5' }}>
                <h4 style={{ color: '#b91c1c', margin: '0 0 0.5rem' }}>Factory Reset Catalog</h4>
                <p style={{ fontSize: '0.85rem', color: '#7f1d1d', margin: 0, marginBottom: '1rem' }}>
                  Reset all products and business numbers back to initial project state. Use only if necessary.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Reset all catalog modifications back to defaults?')) {
                      resetCatalogToDefaults();
                      alert('Catalog reset to factory defaults.');
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <AppIcon name="reset" size={14} />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(0.75rem, 3vw, 1.5rem)'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: 'min(90dvh, 850px)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1rem clamp(1rem, 3vw, 1.75rem)',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  {editingProductId ? 'Edit Furniture Piece' : 'Add New Furniture Piece'}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Showroom Catalog · Strictly No Public Prices
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <AppIcon name="close" size={16} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} style={{ overflowY: 'auto', padding: 'clamp(1rem, 3vw, 1.75rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Section 1: Basic Identification & Category */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
                  1. Basic Information & Category (بەش)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                      Model Code / SKU
                    </label>
                    <input
                      type="text"
                      value={productForm.code}
                      onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                      required
                      style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                      Showroom Type (جۆری بەش)
                    </label>
                    <select
                      value={productForm.type}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontWeight: 600 }}
                    >
                      <option value="home">Home Furniture (مۆبیلیاتی ماڵ)</option>
                      <option value="office">Office Furniture (مۆبیلیاتی ئۆفیس)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                      Category / بەشی تایبەت <span style={{ color: 'var(--brand-orange)' }}>*</span>
                    </label>
                    <select
                      value={customCategoryMode ? '__custom__' : productForm.categoryKey}
                      onChange={handleCategorySelectChange}
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontWeight: 600,
                        color: '#0f172a'
                      }}
                    >
                      <optgroup label={productForm.type === 'home' ? 'Home Categories (بەشەکانی ماڵ)' : 'Office Categories (بەشەکانی ئۆفیس)'}>
                        {(CATEGORY_PRESETS[productForm.type] || []).map((preset) => (
                          <option key={preset.key} value={preset.key}>
                            {preset.ku} — {preset.en}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Custom / بەشێکی تر">
                        <option value="__custom__">➕ Custom Category / بەشێکی تر...</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Category preview and custom fields */}
                <div
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.85rem 1rem',
                    backgroundColor: customCategoryMode ? '#fffbeb' : '#f8fafc',
                    borderRadius: '8px',
                    border: customCategoryMode ? '1px solid #fde68a' : '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: customCategoryMode ? '0.75rem' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Selected Category:
                      </span>
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: 'var(--brand-orange)',
                          backgroundColor: '#ffffff',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          border: '1px solid #fed7aa',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                        }}
                      >
                        {productForm.categoryKu || '(Not set)'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        · {productForm.categoryAr || '(العربية)'} · {productForm.categoryEn || '(English)'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCustomCategoryMode((prev) => !prev)}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#0284c7',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      {customCategoryMode ? '✓ Done Editing Category' : '✏️ Edit / Customize Category Names'}
                    </button>
                  </div>

                  {/* Expanded Category Customization Inputs */}
                  {customCategoryMode && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed #e2e8f0' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>
                          Kurdish Name (ناوی بەش بە کوردی) <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={productForm.categoryKu}
                          onChange={(e) => setProductForm({ ...productForm, categoryKu: e.target.value })}
                          placeholder="وەک: ژووری میوان و دانیشتن"
                          style={{ width: '100%', height: '36px', padding: '0 8px', borderRadius: '6px', border: '1px solid #cbd5e1', direction: 'rtl', fontSize: '0.82rem' }}
                          required={customCategoryMode}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>
                          Arabic Name (اسم الفئة بالعربية)
                        </label>
                        <input
                          type="text"
                          value={productForm.categoryAr}
                          onChange={(e) => setProductForm({ ...productForm, categoryAr: e.target.value })}
                          placeholder="مثل: غرفة المعيشة"
                          style={{ width: '100%', height: '36px', padding: '0 8px', borderRadius: '6px', border: '1px solid #cbd5e1', direction: 'rtl', fontSize: '0.82rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>
                          English Name
                        </label>
                        <input
                          type="text"
                          value={productForm.categoryEn}
                          onChange={(e) => setProductForm({ ...productForm, categoryEn: e.target.value })}
                          placeholder="e.g. Living Room"
                          style={{ width: '100%', height: '36px', padding: '0 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>
                          Category Key / ID (Slug)
                        </label>
                        <input
                          type="text"
                          value={productForm.categoryKey}
                          onChange={(e) => setProductForm({ ...productForm, categoryKey: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                          placeholder="e.g. living, dining, bedroom"
                          style={{ width: '100%', height: '36px', padding: '0 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'monospace' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={productForm.titleEn}
                    onChange={(e) => setProductForm({ ...productForm, titleEn: e.target.value })}
                    required
                    placeholder="e.g. Cloud Modular Sectional Sofa"
                    style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                      Title (Kurdish Sorani)
                    </label>
                    <input
                      type="text"
                      value={productForm.titleKu}
                      onChange={(e) => setProductForm({ ...productForm, titleKu: e.target.value })}
                      placeholder="ناوی بەرهەم بە کوردی"
                      style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1', direction: 'rtl' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                      Title (Arabic)
                    </label>
                    <input
                      type="text"
                      value={productForm.titleAr}
                      onChange={(e) => setProductForm({ ...productForm, titleAr: e.target.value })}
                      placeholder="اسم المنتج بالعربية"
                      style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1', direction: 'rtl' }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Photography & Media */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem', marginBottom: '0.85rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    2. Photography & Cover Image (وێنەی بەرهەم)
                  </h4>
                  <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    Direct device upload from phone or computer
                  </span>
                </div>

                {imageUploadError && (
                  <div style={{ padding: '0.6rem 0.85rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#dc2626', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                    {imageUploadError}
                  </div>
                )}

                {/* Primary Cover Image Box */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', alignItems: 'start', marginBottom: '1rem' }}>
                  {/* Image Preview & Details */}
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Current Cover Image</span>
                      {uploadingImage && <span style={{ color: 'var(--brand-orange)', fontSize: '0.74rem' }}>Processing...</span>}
                    </div>

                    <div
                      style={{
                        width: '100%',
                        height: '180px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        backgroundColor: '#e2e8f0',
                        position: 'relative',
                        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                      }}
                    >
                      <img
                        src={productForm.images[0] || '/category_placeholder.jpg'}
                        alt="Product Cover"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-secondary"
                        disabled={uploadingImage}
                        style={{ flex: 1, fontSize: '0.8rem', minHeight: '36px', padding: '0 0.5rem', justifyContent: 'center' }}
                      >
                        <AppIcon name="image" size={15} />
                        <span>Change Photo</span>
                      </button>

                      {productForm.images.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(0)}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '6px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                          title="Remove cover photo"
                        >
                          <AppIcon name="delete" size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Drag & Drop Upload Zone */}
                  <div>
                    {/* Hidden Native File Input for Mobile & Desktop */}
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

                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                      onDragLeave={() => setIsDraggingOver(false)}
                      onDrop={handleDropImage}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: isDraggingOver ? '2px dashed var(--brand-orange)' : '2px dashed #cbd5e1',
                        backgroundColor: isDraggingOver ? '#fff7ed' : '#ffffff',
                        borderRadius: '8px',
                        padding: '1.5rem 1rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s ease, background-color 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        minHeight: '180px'
                      }}
                    >
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: '#fff7ed',
                          color: 'var(--brand-orange)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <AppIcon name="external" size={24} />
                      </div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                        Click to Upload from Device
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        یان وێنەیەک ڕابکێشە ئێرە (Drag & Drop)
                      </div>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          marginTop: '0.2rem'
                        }}
                      >
                        JPG, PNG, WEBP · Auto-compressed for speed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Gallery Photos */}
                {productForm.images.length > 1 && (
                  <div style={{ marginBottom: '1rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                      Additional Gallery Images ({productForm.images.length - 1} extra photos):
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {productForm.images.slice(1).map((imgUrl, idx) => (
                        <div
                          key={idx + 1}
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            position: 'relative',
                            border: '1px solid #cbd5e1'
                          }}
                        >
                          <img src={imgUrl} alt="extra view" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx + 1)}
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(0,0,0,0.65)',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              lineHeight: 1
                            }}
                            title="Remove this photo"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '6px',
                          border: '1px dashed #94a3b8',
                          backgroundColor: '#ffffff',
                          color: '#475569',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}
                      >
                        <AppIcon name="plus" size={16} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Showroom Library Presets */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Or quick-pick from showroom collection:
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
                    {AVAILABLE_SHOWROOM_IMAGES.map((img) => (
                      <button
                        type="button"
                        key={img}
                        onClick={() => setProductForm({ ...productForm, images: [img] })}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: productForm.images[0] === img ? '2px solid var(--brand-orange)' : '1px solid #cbd5e1',
                          padding: 0,
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                        title="Select this showroom image"
                      >
                        <img src={img} alt="preset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collapsible Web Link (URL) Input */}
                <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput((prev) => !prev)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: 0
                    }}
                  >
                    <span>{showUrlInput ? '▼ Hide web link input' : '▶ Advanced: Paste an image link (URL / بەستەری ئۆنلاین)'}</span>
                  </button>

                  {showUrlInput && (
                    <div style={{ marginTop: '0.5rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                        Image Web Link (URL)
                      </label>
                      <input
                        type="text"
                        value={productForm.images[0] || ''}
                        onChange={(e) => {
                          const newImgs = [...productForm.images];
                          newImgs[0] = e.target.value;
                          setProductForm({ ...productForm, images: newImgs });
                        }}
                        placeholder="e.g. https://images.unsplash.com/... or /images/sofa.jpg"
                        style={{ width: '100%', height: '36px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                      <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '0.3rem' }}>
                        Only needed if your photo is already hosted on the web. For local files from your phone or PC, use "Click to Upload" above.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Dimensions & Craftsmanship */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
                  3. Specifications & Materials
                </h4>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Dimensions (W × D × H)
                  </label>
                  <input
                    type="text"
                    value={productForm.dimensions}
                    onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                    style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Materials Description
                  </label>
                  <input
                    type="text"
                    value={productForm.materialsEn}
                    onChange={(e) => setProductForm({ ...productForm, materialsEn: e.target.value })}
                    style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              {/* Section 4: Visibility Flags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={productForm.published}
                    onChange={(e) => setProductForm({ ...productForm, published: e.target.checked })}
                  />
                  <span>Published (Show in Showroom)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={productForm.isNew}
                    onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                  />
                  <span>New Arrival Badge</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.5rem',
                    backgroundColor: 'var(--brand-orange)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(255, 102, 0, 0.25)'
                  }}
                >
                  {editingProductId ? 'Update Piece' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
