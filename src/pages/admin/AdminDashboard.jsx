import React, { useState, useMemo, useDeferredValue } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useCatalog } from '../../context/CatalogContext';
import { AppIcon } from '../../components/ui/Icon';
import ProductTableRow from './ProductTableRow';
import ProductEditModal from './ProductEditModal';
import './admin.css';

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

  // Navigation & View state
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'dashboard', 'settings'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filters & Search
  const [searchInput, setSearchInput] = useState('');
  const deferredSearch = useDeferredValue(searchInput);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'home', 'office'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [quickFilter, setQuickFilter] = useState('all'); // 'all', 'published', 'featured', 'new'

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  // Settings State
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
    hoursEn: settings.showroom?.hoursEn || '',
    googleMapsUrl: settings.showroom?.googleMapsUrl || '',
    appleMapsUrl: settings.showroom?.appleMapsUrl || ''
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Authentication Guard: Redirect to /admin/login if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Keep settingsForm synced if settings update externally
  React.useEffect(() => {
    if (settings) {
      setSettingsForm((prev) => ({
        ...prev,
        phoneDisplay: settings.phoneDisplay || prev.phoneDisplay,
        phoneTechnical: settings.phoneTechnical || prev.phoneTechnical,
        whatsappDisplay: settings.whatsappDisplay || prev.whatsappDisplay,
        whatsappNumber: settings.whatsappNumber || prev.whatsappNumber,
        instagramUrl: settings.instagram?.url || prev.instagramUrl,
        instagramHandle: settings.instagram?.handle || prev.instagramHandle,
        addressKu: settings.showroom?.addressKu || prev.addressKu,
        addressAr: settings.showroom?.addressAr || prev.addressAr,
        addressEn: settings.showroom?.addressEn || prev.addressEn,
        hoursKu: settings.showroom?.hoursKu || prev.hoursKu,
        hoursAr: settings.showroom?.hoursAr || prev.hoursAr,
        hoursEn: settings.showroom?.hoursEn || prev.hoursEn,
        googleMapsUrl: settings.showroom?.googleMapsUrl || prev.googleMapsUrl,
        appleMapsUrl: settings.showroom?.appleMapsUrl || prev.appleMapsUrl
      }));
    }
  }, [settings]);

  // Compute Categories available for current type
  const availableCategories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      if (typeFilter !== 'all' && p.type !== typeFilter) return;
      const key = p.categoryKey || 'general';
      if (!map.has(key)) {
        map.set(key, {
          key,
          en: p.category?.en || key,
          ku: p.category?.ku || p.category?.en || key,
          count: 1
        });
      } else {
        map.get(key).count += 1;
      }
    });
    return Array.from(map.values());
  }, [products, typeFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = products.length;
    const published = products.filter((p) => p.published !== false).length;
    const featured = products.filter((p) => Boolean(p.featured)).length;
    const newItems = products.filter((p) => Boolean(p.isNew)).length;
    return { total, published, featured, newItems };
  }, [products]);

  // Filtered Products (Memoized for zero-lag performance)
  const filteredProducts = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return products.filter((p) => {
      // Type
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;

      // Category
      if (categoryFilter !== 'all' && p.categoryKey !== categoryFilter) return false;

      // Quick KPI Filter
      if (quickFilter === 'published' && p.published === false) return false;
      if (quickFilter === 'featured' && !p.featured) return false;
      if (quickFilter === 'new' && !p.isNew) return false;

      // Search Query
      if (query) {
        const matchesCode = p.code?.toLowerCase().includes(query);
        const matchesTitleEn = p.title?.en?.toLowerCase().includes(query);
        const matchesTitleKu = p.title?.ku?.toLowerCase().includes(query);
        const matchesTitleAr = p.title?.ar?.toLowerCase().includes(query);
        const matchesCatEn = p.category?.en?.toLowerCase().includes(query);
        const matchesCatKu = p.category?.ku?.toLowerCase().includes(query);
        const matchesCol = Array.isArray(p.collections) && p.collections.some((c) => c.toLowerCase().includes(query));

        if (!matchesCode && !matchesTitleEn && !matchesTitleKu && !matchesTitleAr && !matchesCatEn && !matchesCatKu && !matchesCol) {
          return false;
        }
      }

      return true;
    });
  }, [products, typeFilter, categoryFilter, quickFilter, deferredSearch]);

  if (!isAuthenticated) {
    return null;
  }

  // Action Handlers
  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setEditModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setSelectedProduct(prod);
    setEditModalOpen(true);
  };

  const handleDuplicateProduct = (prod) => {
    const clone = {
      ...prod,
      code: `${prod.code || 'UF'}-COPY`,
      title: {
        en: `${prod.title?.en || 'Product'} (Copy)`,
        ku: `${prod.title?.ku || ''} (کۆپی)`,
        ar: `${prod.title?.ar || ''} (نسخة)`
      },
      published: false,
      featured: false,
      isNew: true
    };
    delete clone.id;
    delete clone.createdAt;
    addProduct(clone);
  };

  const handleSaveProduct = (formData) => {
    if (selectedProduct && selectedProduct.id) {
      updateProduct(selectedProduct.id, formData);
    } else {
      addProduct(formData);
    }
  };

  const confirmDelete = () => {
    if (deleteCandidate) {
      deleteProduct(deleteCandidate.id);
      setDeleteCandidate(null);
    }
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
        hoursEn: settingsForm.hoursEn,
        googleMapsUrl: settingsForm.googleMapsUrl || settings.showroom?.googleMapsUrl,
        appleMapsUrl: settingsForm.appleMapsUrl || settings.showroom?.appleMapsUrl
      }
    });

    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="admin-layout" style={{ direction: 'ltr' }}>
      {/* 1. SIDEBAR */}
      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand-mark">
            <div className="admin-brand-icon">UF</div>
            <div className="admin-brand-titles">
              <h1>UNIQUE FURNITURE</h1>
              <span>Executive Showroom CMS</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="admin-menu-toggle"
            aria-label="Close menu"
          >
            <AppIcon name="close" size={16} />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="admin-nav">
          <button
            type="button"
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
            type="button"
            onClick={() => {
              setActiveTab('dashboard');
              setMobileSidebarOpen(false);
            }}
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'is-active' : ''}`}
          >
            <AppIcon name="dashboard" size={18} />
            <span>Showroom Overview</span>
          </button>

          <button
            type="button"
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

        {/* User profile & Logout */}
        <div className="admin-user-panel">
          <div className="admin-user-card">
            <div className="admin-avatar">
              {(adminUser.name || 'Admin').slice(0, 2).toUpperCase()}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">{adminUser.name}</span>
              <span className="admin-user-role">{adminUser.role}</span>
            </div>
          </div>

          <button
            type="button"
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

      {/* 2. MAIN WORKSPACE */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen((prev) => !prev)}
              className="admin-menu-toggle"
              aria-label="Toggle menu"
            >
              <AppIcon name={mobileSidebarOpen ? 'close' : 'menu'} size={18} />
            </button>
            <h2 className="admin-topbar-title">
              {activeTab === 'products' && 'Product Catalogue'}
              {activeTab === 'dashboard' && 'Showroom Analytics & Quick View'}
              {activeTab === 'settings' && 'Showroom Settings & Contact Details'}
            </h2>
          </div>

          <div className="admin-topbar-right">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-link-website"
            >
              <span>View Website</span>
              <AppIcon name="external" size={14} />
            </a>
          </div>
        </header>

        {/* Main Body */}
        <main className="admin-content">
          {/* ================= TAB 1: PRODUCT CATALOGUE ================= */}
          {activeTab === 'products' && (
            <>
              {/* 1. Quick KPI Cards (Interactive Filters) */}
              <div className="admin-kpi-grid">
                <div
                  className={`admin-kpi-card ${quickFilter === 'all' ? 'is-active' : ''}`}
                  onClick={() => setQuickFilter('all')}
                  title="Click to show all products"
                >
                  <div className="admin-kpi-meta">
                    <span>Total Pieces</span>
                    <div className="admin-kpi-count">{stats.total}</div>
                  </div>
                  <div className="admin-kpi-icon" style={{ backgroundColor: '#f4f4f5', color: '#18181b' }}>
                    <AppIcon name="package" size={20} />
                  </div>
                </div>

                <div
                  className={`admin-kpi-card ${quickFilter === 'published' ? 'is-active' : ''}`}
                  onClick={() => setQuickFilter((p) => (p === 'published' ? 'all' : 'published'))}
                  title="Click to filter published"
                >
                  <div className="admin-kpi-meta">
                    <span>Published on Site</span>
                    <div className="admin-kpi-count" style={{ color: '#059669' }}>{stats.published}</div>
                  </div>
                  <div className="admin-kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                    <AppIcon name="check" size={20} />
                  </div>
                </div>

                <div
                  className={`admin-kpi-card ${quickFilter === 'featured' ? 'is-active' : ''}`}
                  onClick={() => setQuickFilter((p) => (p === 'featured' ? 'all' : 'featured'))}
                  title="Click to filter featured"
                >
                  <div className="admin-kpi-meta">
                    <span>Homepage Featured</span>
                    <div className="admin-kpi-count" style={{ color: '#d97706' }}>{stats.featured}</div>
                  </div>
                  <div className="admin-kpi-icon" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
                    <AppIcon name="star" size={20} />
                  </div>
                </div>

                <div
                  className={`admin-kpi-card ${quickFilter === 'new' ? 'is-active' : ''}`}
                  onClick={() => setQuickFilter((p) => (p === 'new' ? 'all' : 'new'))}
                  title="Click to filter new arrivals"
                >
                  <div className="admin-kpi-meta">
                    <span>New Arrivals</span>
                    <div className="admin-kpi-count" style={{ color: '#ea580c' }}>{stats.newItems}</div>
                  </div>
                  <div className="admin-kpi-icon" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
                    <AppIcon name="ticket-star" size={20} />
                  </div>
                </div>
              </div>

              {/* 2. Modern Filter & Action Toolbar */}
              <div className="admin-toolbar-card">
                <div className="admin-toolbar-controls">
                  {/* Search Input (Zero-lag deferred value) */}
                  <div className="admin-search-wrapper">
                    <span className="admin-search-icon">
                      <AppIcon name="search" size={16} />
                    </span>
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search name, code, category..."
                      className="admin-search-input"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={() => setSearchInput('')}
                        className="admin-search-clear"
                        aria-label="Clear search"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Showroom Type Segmented Control */}
                  <div className="admin-segmented-control">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'home', label: 'Home' },
                      { key: 'office', label: 'Office' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          setTypeFilter(item.key);
                          setCategoryFilter('all');
                        }}
                        className={`admin-segmented-btn ${typeFilter === item.key ? 'is-selected' : ''}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Category Filter Dropdown */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="admin-category-select"
                    aria-label="Filter by category"
                  >
                    <option value="all">All Categories (هەموو بەشەکان)</option>
                    {availableCategories.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.ku} ({c.en}) · {c.count}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Product Button */}
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="admin-btn-primary"
                >
                  <AppIcon name="plus" size={16} />
                  <span>+ Add Product</span>
                </button>
              </div>

              {/* 3. High-Performance Responsive Table */}
              <div className="admin-table-container">
                <div className="admin-table-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '70px' }}>Image</th>
                        <th>Product Title & Code</th>
                        <th>Type & Category</th>
                        <th>Visibility</th>
                        <th>Featured</th>
                        <th>New</th>
                        <th style={{ textAlign: 'right', paddingRight: '1.25rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#71717a' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                              <AppIcon name="search" size={28} />
                              <span style={{ fontSize: '0.95rem' }}>No furniture pieces match your filter.</span>
                              {(searchInput || typeFilter !== 'all' || categoryFilter !== 'all' || quickFilter !== 'all') && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSearchInput('');
                                    setTypeFilter('all');
                                    setCategoryFilter('all');
                                    setQuickFilter('all');
                                  }}
                                  style={{
                                    marginTop: '0.5rem',
                                    padding: '5px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #d4d4d8',
                                    background: '#ffffff',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  Reset All Filters
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((prod) => (
                          <ProductTableRow
                            key={prod.id}
                            product={prod}
                            onEdit={handleOpenEditModal}
                            onDuplicate={handleDuplicateProduct}
                            onDelete={(p) => setDeleteCandidate(p)}
                            onTogglePublish={togglePublish}
                            onToggleFeatured={toggleFeatured}
                            onToggleNew={toggleNewArrival}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Summary */}
                <div
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: '#fafaf9',
                    borderTop: '1px solid #e4e4e7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    color: '#71717a'
                  }}
                >
                  <span>
                    Showing {filteredProducts.length} of {products.length} furniture pieces
                  </span>
                  <span>Instant auto-saved to showroom storage</span>
                </div>
              </div>
            </>
          )}

          {/* ================= TAB 2: OVERVIEW ================= */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-toolbar-card" style={{ padding: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#18181b', margin: '0 0 0.35rem' }}>
                    Showroom Operational Health
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#71717a', margin: 0 }}>
                    UNIQUE FURNITURE (Sulaymaniyah) · 48 Years of Bespoke Craftsmanship
                  </p>
                </div>
              </div>

              <div className="admin-kpi-grid">
                <div className="admin-kpi-card" onClick={() => setActiveTab('products')}>
                  <div className="admin-kpi-meta">
                    <span>Active Catalog</span>
                    <div className="admin-kpi-count">{stats.total}</div>
                  </div>
                  <div className="admin-kpi-icon" style={{ backgroundColor: '#f4f4f5' }}>
                    <AppIcon name="package" size={20} />
                  </div>
                </div>

                <div className="admin-kpi-card" onClick={() => setActiveTab('products')}>
                  <div className="admin-kpi-meta">
                    <span>Published</span>
                    <div className="admin-kpi-count" style={{ color: '#059669' }}>{stats.published}</div>
                  </div>
                  <div className="admin-kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                    <AppIcon name="check" size={20} />
                  </div>
                </div>

                <div className="admin-kpi-card" onClick={() => setActiveTab('products')}>
                  <div className="admin-kpi-meta">
                    <span>Featured Pieces</span>
                    <div className="admin-kpi-count" style={{ color: '#d97706' }}>{stats.featured}</div>
                  </div>
                  <div className="admin-kpi-icon" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
                    <AppIcon name="star" size={20} />
                  </div>
                </div>

                <div className="admin-kpi-card" onClick={() => setActiveTab('settings')}>
                  <div className="admin-kpi-meta">
                    <span>Showroom WhatsApp</span>
                    <div className="admin-kpi-count" style={{ fontSize: '1.1rem' }}>
                      {settings.whatsappDisplay || 'Active'}
                    </div>
                  </div>
                  <div className="admin-kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                    <AppIcon name="call" size={20} />
                  </div>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#18181b', margin: '0 0 0.25rem' }}>
                    Catalog Factory Reset
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#71717a', margin: 0 }}>
                    Restores the original 32 curated furniture pieces and standard showroom phone numbers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to restore the default catalog? Any custom products will be reset.')) {
                      resetCatalogToDefaults();
                    }
                  }}
                  style={{
                    height: '38px',
                    padding: '0 1rem',
                    borderRadius: '7px',
                    border: '1px solid #fecaca',
                    backgroundColor: '#fff5f5',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontSize: '0.82rem'
                  }}
                >
                  Reset Catalog to Defaults
                </button>
              </div>
            </div>
          )}

          {/* ================= TAB 3: SHOWROOM SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-toolbar-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#18181b', margin: '0 0 0.25rem' }}>
                      Official Showroom & Direct Contact Details
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: '#71717a', margin: 0 }}>
                      Changes made here update header call buttons, showroom advisory cards, and map links instantly.
                    </p>
                  </div>

                  {settingsSaved && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        fontSize: '0.82rem',
                        color: '#059669'
                      }}
                    >
                      <AppIcon name="check" size={14} color="#059669" />
                      <span>Changes Saved!</span>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Phones & WhatsApp */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#18181b', margin: '0 0 1rem' }}>
                    Telephone & WhatsApp Direct Dispatch
                  </h4>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Phone Display (Visual)</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={settingsForm.phoneDisplay}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phoneDisplay: e.target.value })}
                        placeholder="0772 975 4844"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Phone Dial Link (+964...)</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={settingsForm.phoneTechnical}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phoneTechnical: e.target.value })}
                        placeholder="+9647729754844"
                      />
                    </div>
                  </div>

                  <div className="admin-form-row" style={{ marginTop: '1rem' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">WhatsApp Display Number</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={settingsForm.whatsappDisplay}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappDisplay: e.target.value })}
                        placeholder="0772 975 4844"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">WhatsApp Clean Number (No +, No spaces)</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        placeholder="9647729754844"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media & Maps */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#18181b', margin: '0 0 1rem' }}>
                    Instagram & Navigation Maps
                  </h4>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Instagram Profile URL</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={settingsForm.instagramUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Instagram Handle</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={settingsForm.instagramHandle}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                        placeholder="@unique.furniture.iq"
                      />
                    </div>
                  </div>

                  <div className="admin-form-row" style={{ marginTop: '1rem' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Google Maps Showroom Link</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={settingsForm.googleMapsUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })}
                        placeholder="https://maps.google.com/..."
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Apple Maps Link</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={settingsForm.appleMapsUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, appleMapsUrl: e.target.value })}
                        placeholder="https://maps.apple.com/..."
                      />
                    </div>
                  </div>
                </div>

                {/* Showroom Physical Address (3 Languages) */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#18181b', margin: '0 0 1rem' }}>
                    Showroom Physical Address (Sulaymaniyah)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Kurdish Address (Zain)</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        style={{ direction: 'rtl', fontFamily: 'Zain' }}
                        value={settingsForm.addressKu}
                        onChange={(e) => setSettingsForm({ ...settingsForm, addressKu: e.target.value })}
                        placeholder="ناونیشان بە کوردی"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">English Address</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={settingsForm.addressEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, addressEn: e.target.value })}
                        placeholder="Sulaymaniyah, Malik Mahmood Circle..."
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Arabic Address</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        style={{ direction: 'rtl' }}
                        value={settingsForm.addressAr}
                        onChange={(e) => setSettingsForm({ ...settingsForm, addressAr: e.target.value })}
                        placeholder="العنوان بالعربية"
                      />
                    </div>
                  </div>
                </div>

                {/* Opening Hours */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#18181b', margin: '0 0 1rem' }}>
                    Showroom Opening Hours
                  </h4>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Kurdish Hours</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        style={{ direction: 'rtl', fontFamily: 'Zain' }}
                        value={settingsForm.hoursKu}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hoursKu: e.target.value })}
                        placeholder="شەممە بۆ پێنجشەممە ۹ بەیانی - ۹ شەو"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">English Hours</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={settingsForm.hoursEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hoursEn: e.target.value })}
                        placeholder="Mon - Sat: 9:00 AM - 9:00 PM"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="submit" className="admin-btn-primary" style={{ height: '44px', padding: '0 2rem' }}>
                    Save All Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* 3. RICH PRODUCT EDIT / ADD MODAL */}
      <ProductEditModal
        isOpen={editModalOpen}
        product={selectedProduct}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* 4. DELETE CONFIRMATION MODAL */}
      {deleteCandidate && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteCandidate(null)}>
          <div
            className="admin-modal-container"
            style={{ maxWidth: '440px', padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.15rem', color: '#18181b', margin: '0 0 0.5rem' }}>
              Delete Furniture Piece?
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#71717a', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
              Are you sure you want to remove <strong>{deleteCandidate.title?.en || deleteCandidate.code}</strong> from the catalog? This action will permanently remove it from the website.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                style={{
                  height: '38px',
                  padding: '0 1rem',
                  borderRadius: '7px',
                  border: '1px solid #d4d4d8',
                  background: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.84rem'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                style={{
                  height: '38px',
                  padding: '0 1.25rem',
                  borderRadius: '7px',
                  border: '1px solid #dc2626',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.84rem'
                }}
              >
                Delete Piece
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
